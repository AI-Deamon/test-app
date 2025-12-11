# Wazuh Client Library - Python Implementation
"""
Python implementation of Wazuh API client functionality
Equivalent to the Rust wazuh-client crate
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from datetime import datetime
import aiohttp
import requests
from urllib.parse import urljoin
import ssl
import certifi

# Configure logging
logger = logging.getLogger(__name__)

@dataclass
class Agent:
    """Represents a Wazuh agent"""
    id: str
    name: str
    ip: Optional[str] = None
    register_ip: Optional[str] = None
    status: str = ""
    os_name: Optional[str] = None
    os_version: Optional[str] = None
    os_platform: Optional[str] = None
    version: Optional[str] = None
    manager_host: Optional[str] = None
    node_name: Optional[str] = None
    date_add: Optional[str] = None
    last_keepalive: Optional[str] = None
    group: Optional[List[str]] = None
    group_config_status: Optional[str] = None

@dataclass
class Alert:
    """Represents a Wazuh security alert"""
    id: str
    timestamp: str
    agent: Optional[Dict] = None
    rule: Optional[Dict] = None
    manager: Optional[Dict] = None
    cluster: Optional[Dict] = None
    location: Optional[str] = None
    decoder: Optional[Dict] = None
    data: Optional[Dict] = None
    full_log: Optional[str] = None

@dataclass
class Rule:
    """Represents a Wazuh security rule"""
    id: int
    level: int
    description: str
    groups: List[str]
    filename: Optional[str] = None
    pci_dss: Optional[List[str]] = None
    gdpr: Optional[List[str]] = None
    hipaa: Optional[List[str]] = None
    nist_800_53: Optional[List[str]] = None
    mitre: Optional[Dict] = None
    status: Optional[str] = None

@dataclass
class Vulnerability:
    """Represents a vulnerability detection"""
    cve: str
    title: str
    description: Optional[str] = None
    severity: str = ""
    published: Optional[str] = None
    updated: Optional[str] = None
    detection_time: Optional[str] = None
    agent: Optional[Dict] = None
    cvss: Optional[Dict] = None
    reference: Optional[str] = None

@dataclass
class Process:
    """Represents a system process"""
    pid: str
    name: str
    state: Optional[str] = None
    user: Optional[str] = None
    group: Optional[str] = None
    cmd: Optional[str] = None
    args: Optional[str] = None

@dataclass
class Port:
    """Represents a network port"""
    local_ip: Optional[str] = None
    local_port: Optional[int] = None
    remote_ip: Optional[str] = None
    remote_port: Optional[int] = None
    protocol: Optional[str] = None
    state: Optional[str] = None
    pid: Optional[str] = None
    process: Optional[str] = None

@dataclass
class ClusterNode:
    """Represents a cluster node"""
    name: str
    node_type: str
    version: str
    ip: str
    status: str

@dataclass
class ClusterStatus:
    """Represents cluster status"""
    enabled: str
    running: str

@dataclass
class ClusterHealthCheck:
    """Represents cluster health check"""
    n_connected_nodes: int

class WazuhApiError(Exception):
    def __init__(self, message: str, status_code: int = None):
        super().__init__(message)
        self.status_code = status_code

class WazuhClientBase:
    """Base class for Wazuh API clients"""

    def __init__(self, host: str, port: int, username: str, password: str,
                 protocol: str = "https", verify_ssl: bool = True): # Changed default to True
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.protocol = protocol
        self.verify_ssl = verify_ssl
        self.base_url = f"{protocol}://{host}:{port}"
        self.token = None
        self._session: Optional[aiohttp.ClientSession] = None
        self._connector: Optional[aiohttp.TCPConnector] = None
        self._ssl_context: Optional[ssl.SSLContext] = None
        logger.debug(f"WazuhClientBase initialized for {self.base_url} with verify_ssl={self.verify_ssl}")

    async def __aenter__(self):
        """Initialize the aiohttp session and connector."""
        if self.protocol == "https":
            self._ssl_context = ssl.create_default_context(cafile=certifi.where())
            if not self.verify_ssl:
                self._ssl_context.check_hostname = False
                self._ssl_context.verify_mode = ssl.CERT_NONE
                logger.warning(f"WazuhClientBase ({self.base_url}): SSL verification is DISABLED.")
            else:
                self._ssl_context.check_hostname = True
                self._ssl_context.verify_mode = ssl.CERT_REQUIRED
                logger.debug(f"WazuhClientBase ({self.base_url}): SSL verification is ENABLED.")
            self._ssl_context.minimum_version = ssl.TLSVersion.TLSv1_2 # Ensure minimum TLS version
        
        self._connector = aiohttp.TCPConnector(ssl=self._ssl_context)
        self._session = aiohttp.ClientSession(connector=self._connector)
        logger.debug(f"aiohttp ClientSession created for {self.base_url}")
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Close the aiohttp session."""
        if self._session:
            await self._session.close()
            logger.debug(f"aiohttp ClientSession closed for {self.base_url}")
        if self._connector:
            await self._connector.close()
            logger.debug(f"aiohttp TCPConnector closed for {self.base_url}")

    async def authenticate(self):
        """Authenticate with the Wazuh API and get JWT token"""
        if not self._session:
            raise WazuhApiError("Client session not initialized. Use 'async with' for WazuhClientBase.")

        auth_url = urljoin(self.base_url, "/security/user/authenticate")

        try:
            async with self._session.post( # Use self._session
                auth_url,
                auth=aiohttp.BasicAuth(self.username, self.password),
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self.token = data.get("data", {}).get("token")
                    logger.info("Successfully authenticated with Wazuh API")
                    return self.token
                else:
                    error_text = await response.text()
                    raise WazuhApiError(
                        f"Authentication failed: {response.status} - {error_text}",
                        status_code=response.status
                    )
        except aiohttp.ClientError as e:
            raise WazuhApiError(f"Connection error during authentication: {str(e)}", status_code=503)

    async def _make_request(self, method: str, endpoint: str, params: Optional[Dict] = None,
                           json_data: Optional[Dict] = None) -> Dict:
        """Make an authenticated request to the Wazuh API"""
        if not self._session:
            raise WazuhApiError("Client session not initialized. Use 'async with' for WazuhClientBase.")

        if not self.token:
            await self.authenticate()

        url = urljoin(self.base_url, endpoint)
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

        try:
            async with self._session.request(method, url, headers=headers, params=params, json=json_data) as response: # Use self._session
                response_text = await response.text()
                if response.status == 200:
                    try:
                        return json.loads(response_text)
                    except json.JSONDecodeError:
                        raise WazuhApiError(f"Invalid JSON response: {response_text}")
                elif response.status == 401:
                    logger.warning("Wazuh API token expired or invalid. Attempting re-authentication.")
                    # Token invalid/expired: re-authenticate and retry once
                    self.token = None
                    await self.authenticate()
                    headers["Authorization"] = f"Bearer {self.token}"
                    async with self._session.request(method, url, headers=headers, params=params, json=json_data) as retry_resp: # Use self._session
                        retry_text = await retry_resp.text()
                        if retry_resp.status == 200:
                            logger.info("Successfully re-authenticated and retried request.")
                            return json.loads(retry_text)
                        raise WazuhApiError(f"API request failed after re-auth: {retry_resp.status} - {retry_text}",
                                            status_code=retry_resp.status)
                else:
                    raise WazuhApiError(f"API request failed: {response.status} - {response_text}", status_code=response.status)
        except aiohttp.ClientError as e:
            raise WazuhApiError(f"Connection error: {str(e)}", status_code=503)

class WazuhIndexerClient:
    """Client for Wazuh Indexer API (Elasticsearch-like)"""

    def __init__(self, host: str, port: int, username: str, password: str,
                 protocol: str = "https", verify_ssl: bool = True): # Changed default to True
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.protocol = protocol
        self.verify_ssl = verify_ssl
        self.base_url = f"{protocol}://{host}:{port}"
        self._session: Optional[aiohttp.ClientSession] = None
        self._connector: Optional[aiohttp.TCPConnector] = None
        self._ssl_context: Optional[ssl.SSLContext] = None
        logger.info(f"WazuhIndexerClient initialized with verify_ssl={verify_ssl}")

    async def __aenter__(self):
        """Initialize the aiohttp session and connector for the Indexer."""
        if self.protocol == "https":
            self._ssl_context = ssl.create_default_context(cafile=certifi.where())
            if not self.verify_ssl:
                self._ssl_context.check_hostname = False
                self._ssl_context.verify_mode = ssl.CERT_NONE
                logger.warning("WazuhIndexerClient: SSL verification is DISABLED.")
            else:
                self._ssl_context.check_hostname = True
                self._ssl_context.verify_mode = ssl.CERT_REQUIRED
                logger.debug("WazuhIndexerClient: SSL verification is ENABLED.")
            # Ensure minimum TLS version for security, even if verification is off
            self._ssl_context.minimum_version = ssl.TLSVersion.TLSv1_2
        
        self._connector = aiohttp.TCPConnector(ssl=self._ssl_context)
        self._session = aiohttp.ClientSession(connector=self._connector)
        logger.debug(f"aiohttp ClientSession created for Indexer at {self.base_url}")
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Close the aiohttp session for the Indexer."""
        if self._session:
            await self._session.close()
            logger.debug(f"aiohttp ClientSession closed for Indexer at {self.base_url}")
        if self._connector:
            await self._connector.close()
            logger.debug(f"aiohttp TCPConnector closed for Indexer at {self.base_url}")

    async def search_alerts(self, limit=100, offset=0, sort="desc"):
        """
        Retrieve alerts from Wazuh Indexer (Elasticsearch/OpenSearch).
        """
        if not self._session:
            raise WazuhApiError("Client session not initialized. Use 'async with' for WazuhIndexerClient.")

        query = {
            "size": limit,
            "from": offset,
            "sort": [{"@timestamp": {"order": sort}}],
            "query": {"match_all": {}}
        }
        search_url = f"{self.base_url}/.wazuh-alerts-*/_search"

        try:
            async with self._session.post( # Use self._session
                search_url,
                auth=aiohttp.BasicAuth(self.username, self.password),
                json=query,
                headers={"Content-Type": "application/json"}
            ) as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    logger.error(f"Indexer API error: {resp.status} - {error_text}")
                    raise WazuhApiError(f"Indexer error: {resp.status} - {error_text}", status_code=resp.status)
                data = await resp.json()
                return [hit["_source"] for hit in data.get("hits", {}).get("hits", [])]
        except aiohttp.ClientError as e:
            error_msg = f"Connection error to Wazuh Indexer: {str(e)}"
            logger.error(error_msg)
            raise WazuhApiError(error_msg, status_code=503)

    async def get_alerts(self, limit=100):
        """
        Retrieve alerts from Wazuh Indexer.
        """
        if not self._session:
            raise WazuhApiError("Client session not initialized. Use 'async with' for WazuhIndexerClient.")

        query = {
            "size": limit,
            "sort": [{"@timestamp": {"order": "desc"}}],
            "query": {"match_all": {}}
        }
        search_url = f"{self.base_url}/.wazuh-alerts-*/_search"

        try:
            async with self._session.post( # Use self._session
                search_url,
                auth=aiohttp.BasicAuth(self.username, self.password),
                json=query,
                headers={"Content-Type": "application/json"}
            ) as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    logger.error(f"Indexer API error: {resp.status} - {error_text}")
                    raise WazuhApiError(f"Indexer error: {resp.status} - {error_text}", status_code=resp.status)
                data = await resp.json()
                return [hit["_source"] for hit in data.get("hits", {}).get("hits", [])]
        except aiohttp.ClientError as e:
            error_msg = f"Connection error to Wazuh Indexer: {str(e)}"
            logger.error(error_msg)
            raise WazuhApiError(error_msg, status_code=503)

class AgentsClient(WazuhClientBase):
    """Client for Wazuh Agent management"""

    async def get_agents(self, limit: int = 300, status: str = "active",
                        name: Optional[str] = None, ip: Optional[str] = None,
                        group: Optional[str] = None, os_platform: Optional[str] = None,
                        version: Optional[str] = None) -> List[Agent]:
        """Get list of agents"""
        params = {
            "limit": limit,
            "status": status
        }

        if name:
            params["search"] = name
        if ip:
            params["ip"] = ip
        if group:
            params["group"] = group
        if os_platform:
            params["os.platform"] = os_platform
        if version:
            params["version"] = version

        response = await self._make_request("GET", "/agents", params=params)

        agents = []
        for agent_data in response.get("data", {}).get("affected_items", []):
            agent = Agent(
                id=agent_data.get("id", ""),
                name=agent_data.get("name", ""),
                ip=agent_data.get("ip"),
                register_ip=agent_data.get("registerIP"),
                status=agent_data.get("status", ""),
                os_name=agent_data.get("os", {}).get("name"),
                os_version=agent_data.get("os", {}).get("version"),
                os_platform=agent_data.get("os", {}).get("platform"),
                version=agent_data.get("version"),
                manager_host=agent_data.get("manager"),
                node_name=agent_data.get("node_name"),
                date_add=agent_data.get("dateAdd"),
                last_keepalive=agent_data.get("lastKeepAlive"),
                group=agent_data.get("group"),
                group_config_status=agent_data.get("groupConfigStatus")
            )
            agents.append(agent)

        return agents

class RulesClient(WazuhClientBase):
    """Client for Wazuh Rules management"""

    async def get_rules(self, limit: int = 300, level: Optional[int] = None,
                       group: Optional[str] = None, filename: Optional[str] = None) -> List[Rule]:
        """Get security rules"""
        params = {"limit": limit}

        if level:
            params["level"] = level
        if group:
            params["group"] = group
        if filename:
            params["filename"] = filename

        response = await self._make_request("GET", "/rules", params=params)

        rules = []
        for rule_data in response.get("data", {}).get("affected_items", []):
            rule = Rule(
                id=rule_data.get("id", 0),
                level=rule_data.get("level", 0),
                description=rule_data.get("description", ""),
                groups=rule_data.get("groups", []),
                filename=rule_data.get("filename"),
                pci_dss=rule_data.get("pci_dss"),
                gdpr=rule_data.get("gdpr"),
                hipaa=rule_data.get("hipaa"),
                nist_800_53=rule_data.get("nist_800_53"),
                mitre=rule_data.get("mitre"),
                status=rule_data.get("status")
            )
            rules.append(rule)

        return rules

class VulnerabilityClient(WazuhClientBase):
    """Client for Wazuh Vulnerability management"""

    async def get_vulnerabilities(self, agent_id: str, limit: int = 300,
                                 severity: Optional[str] = None,
                                 cve: Optional[str] = None) -> List[Vulnerability]:
        """Get vulnerabilities for an agent"""
        params = {"limit": limit}

        if severity:
            params["severity"] = severity
        if cve:
            params["cve"] = cve

        endpoint = f"/vulnerability/{agent_id}"
        response = await self._make_request("GET", endpoint, params=params)

        vulnerabilities = []
        for vuln_data in response.get("data", {}).get("affected_items", []):
            vuln = Vulnerability(
                cve=vuln_data.get("cve", ""),
                title=vuln_data.get("title", ""),
                description=vuln_data.get("description"),
                severity=vuln_data.get("severity", ""),
                published=vuln_data.get("published"),
                updated=vuln_data.get("updated"),
                detection_time=vuln_data.get("detection_time"),
                agent=vuln_data.get("agent"),
                cvss=vuln_data.get("cvss"),
                reference=vuln_data.get("reference")
            )
            vulnerabilities.append(vuln)

        return vulnerabilities

    async def get_agent_vulnerabilities(self, agent_id: str, limit: int = 300,
                                       offset: int = 0, severity: Optional[str] = None,
                                       cve: Optional[str] = None, search: Optional[str] = None) -> List[Vulnerability]:
        """Get vulnerabilities for an agent (alternative method name for compatibility)"""
        return await self.get_vulnerabilities(agent_id, limit, severity, cve)

    async def get_critical_vulnerabilities(self, agent_id: str, limit: int = 300) -> List[Vulnerability]:
        """Get critical vulnerabilities for an agent"""
        return await self.get_vulnerabilities(agent_id, limit, severity="Critical")

    async def get_agent_processes(self, agent_id: str, limit: int = 300,
                                 offset: int = 0, search: Optional[str] = None) -> List[Process]:
        """Get running processes for an agent"""
        params = {"limit": limit, "offset": offset}

        if search:
            params["search"] = search

        endpoint = f"/syscollector/{agent_id}/processes"
        response = await self._make_request("GET", endpoint, params=params)

        processes = []
        for proc_data in response.get("data", {}).get("affected_items", []):
            process = Process(
                pid=str(proc_data.get("pid", "")),
                name=proc_data.get("name", ""),
                state=proc_data.get("state"),
                user=proc_data.get("user"),
                group=proc_data.get("group"),
                cmd=proc_data.get("cmd"),
                args=proc_data.get("args")
            )
            processes.append(process)

        return processes

    async def get_agent_ports(self, agent_id: str, limit: int = 300,
                             protocol: Optional[str] = None, state: Optional[str] = None) -> List[Port]:
        """Get network ports for an agent"""
        params = {"limit": limit}

        if protocol:
            params["protocol"] = protocol
        if state:
            params["state"] = state

        endpoint = f"/syscollector/{agent_id}/ports"
        response = await self._make_request("GET", endpoint, params=params)

        ports = []
        for port_data in response.get("data", {}).get("affected_items", []):
            port = Port(
                local_ip=port_data.get("local", {}).get("ip"),
                local_port=port_data.get("local", {}).get("port"),
                remote_ip=port_data.get("remote", {}).get("ip"),
                remote_port=port_data.get("remote", {}).get("port"),
                protocol=port_data.get("protocol"),
                state=port_data.get("state"),
                pid=str(port_data.get("pid", "")) if port_data.get("pid") else None,
                process=port_data.get("process")
            )
            ports.append(port)

        return ports

class LogsClient(WazuhClientBase):
    """Client for Wazuh Logs management"""

    async def search_manager_logs(self, limit: int = 100, offset: int = 0,
                                 level: Optional[str] = None, tag: Optional[str] = None,
                                 search_term: Optional[str] = None) -> List[Dict]:
        """Search manager logs"""
        params = {"limit": limit, "offset": offset}

        if level:
            params["level"] = level
        if tag:
            params["tag"] = tag
        if search_term:
            params["search"] = search_term

        response = await self._make_request("GET", "/manager/logs", params=params)
        return response.get("data", {}).get("affected_items", [])

    async def get_manager_error_logs(self, limit: int = 100) -> List[Dict]:
        """Get manager error logs"""
        return await self.search_manager_logs(limit=limit, level="error")

class ClusterClient(WazuhClientBase):
    """Client for Wazuh Cluster management"""

    async def get_cluster_status(self) -> ClusterStatus:
        """Get cluster status"""
        response = await self._make_request("GET", "/cluster/status")
        data = response.get("data", {}).get("affected_items", [{}])[0]

        return ClusterStatus(
            enabled=data.get("enabled", "no"),
            running=data.get("running", "no")
        )

    async def get_cluster_healthcheck(self) -> ClusterHealthCheck:
        """Get cluster health check"""
        response = await self._make_request("GET", "/cluster/healthcheck")
        data = response.get("data", {}).get("affected_items", [{}])[0]

        return ClusterHealthCheck(
            n_connected_nodes=data.get("n_connected_nodes", 0)
        )

    async def get_cluster_nodes(self, limit: Optional[int] = None,
                               offset: Optional[int] = None,
                               node_type: Optional[str] = None) -> List[ClusterNode]:
        """Get cluster nodes"""
        params = {}

        if limit:
            params["limit"] = limit
        if offset:
            params["offset"] = offset
        if node_type:
            params["type"] = node_type

        response = await self._make_request("GET", "/cluster/nodes", params=params)

        nodes = []
        for node_data in response.get("data", {}).get("affected_items", []):
            node = ClusterNode(
                name=node_data.get("name", ""),
                node_type=node_data.get("type", ""),
                version=node_data.get("version", ""),
                ip=node_data.get("ip", ""),
                status=node_data.get("status", "")
            )
            nodes.append(node)

        return nodes

class WazuhClientFactory:
    """Factory class for creating Wazuh clients"""

    def __init__(self, api_host: str, api_port: int, api_username: str, api_password: str,
                 indexer_host: str, indexer_port: int, indexer_username: str, indexer_password: str,
                 protocol: str = "https", verify_ssl: bool = True): # Changed default to True
        self.api_host = api_host
        self.api_port = api_port
        self.api_username = api_username
        self.api_password = api_password
        self.indexer_host = indexer_host
        self.indexer_port = indexer_port
        self.indexer_username = indexer_username
        self.indexer_password = indexer_password
        self.protocol = protocol
        self.verify_ssl = verify_ssl

    @classmethod
    def builder(cls):
        """Create a builder instance"""
        return cls._Builder()

    class _Builder:
        def __init__(self):
            self._api_host = "localhost"
            self._api_port = 55000
            self._api_username = "wazuh"
            self._api_password = "wazuh"
            self._indexer_host = "localhost"
            self._indexer_port = 9200
            self._indexer_username = "admin"
            self._indexer_password = "admin"
            self._protocol = "https"
            self._verify_ssl = True # Changed default to True to align with client classes

        def api_host(self, host: str):
            self._api_host = host
            return self

        def api_port(self, port: int):
            self._api_port = port
            return self

        def api_credentials(self, username: str, password: str):
            self._api_username = username
            self._api_password = password
            return self

        def indexer_host(self, host: str):
            self._indexer_host = host
            return self

        def indexer_port(self, port: int):
            self._indexer_port = port
            return self

        def indexer_credentials(self, username: str, password: str):
            self._indexer_username = username
            self._indexer_password = password
            return self

        def protocol(self, protocol: str):
            self._protocol = protocol
            return self

        def verify_ssl(self, verify: bool):
            self._verify_ssl = verify
            return self

        def build(self):
            return WazuhClientFactory(
                self._api_host, self._api_port, self._api_username, self._api_password,
                self._indexer_host, self._indexer_port, self._indexer_username, self._indexer_password,
                self._protocol, self._verify_ssl
            )

    def create_indexer_client(self) -> WazuhIndexerClient:
        """Create Wazuh Indexer client"""
        return WazuhIndexerClient(
            self.indexer_host, self.indexer_port,
            self.indexer_username, self.indexer_password,
            self.protocol, self.verify_ssl
        )

    def create_agents_client(self) -> AgentsClient:
        """Create Agents client"""
        return AgentsClient(
            self.api_host, self.api_port,
            self.api_username, self.api_password,
            self.protocol, self.verify_ssl
        )

    def create_rules_client(self) -> RulesClient:
        """Create Rules client"""
        return RulesClient(
            self.api_host, self.api_port,
            self.api_username, self.api_password,
            self.protocol, self.verify_ssl
        )

    def create_vulnerability_client(self) -> VulnerabilityClient:
        """Create Vulnerability client"""
        return VulnerabilityClient(
            self.api_host, self.api_port,
            self.api_username, self.api_password,
            self.protocol, self.verify_ssl
        )

    def create_logs_client(self) -> LogsClient:
        """Create Logs client"""
        return LogsClient(
            self.api_host, self.api_port,
            self.api_username, self.api_password,
            self.protocol, self.verify_ssl
        )

    def create_cluster_client(self) -> ClusterClient:
        """Create Cluster client"""
        return ClusterClient(
            self.api_host, self.api_port,
            self.api_username, self.api_password,
            self.protocol, self.verify_ssl
        )
