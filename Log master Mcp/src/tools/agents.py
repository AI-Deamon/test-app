# Agent Tools Module  
"""
Agent-related tool implementations for Wazuh MCP Server
Equivalent to the Rust tools/agents.rs
"""

import logging
from typing import Dict, Any, Optional, List
from dataclasses import dataclass

from . import ToolModule, ToolUtils, Content, CallToolResult
from wazuh_client import AgentsClient, VulnerabilityClient, WazuhApiError

logger = logging.getLogger(__name__)

@dataclass
class GetAgentsParams:
    """Parameters for get_wazuh_agents"""
    limit: Optional[int] = None
    status: str = "active"
    name: Optional[str] = None
    ip: Optional[str] = None
    group: Optional[str] = None
    os_platform: Optional[str] = None
    version: Optional[str] = None

@dataclass
class GetAgentProcessesParams:
    """Parameters for get_wazuh_agent_processes"""
    agent_id: str
    limit: Optional[int] = None
    search: Optional[str] = None

@dataclass
class GetAgentPortsParams:
    """Parameters for get_wazuh_agent_ports"""
    agent_id: str
    limit: Optional[int] = None
    protocol: str = ""
    state: str = ""

class AgentTools(ToolModule):
    """Tools for managing Wazuh agents"""
    
    def __init__(self, agents_client: AgentsClient, vulnerability_client: VulnerabilityClient):
        self.agents_client = agents_client
        self.vulnerability_client = vulnerability_client
        
    async def get_wazuh_agents(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Retrieve a list of Wazuh agents
        """
        limit = params.get("limit", 300)
        status = params.get("status", "active")
        name = params.get("name")
        ip = params.get("ip")
        group = params.get("group")
        os_platform = params.get("os_platform")
        version = params.get("version")

        logger.info(
            f"Retrieving Wazuh agents with limit={limit}, status={status}, "
            f"name={name}, ip={ip}, group={group}, os_platform={os_platform}, version={version}"
        )

        # Filter out None parameters before passing to client
        client_kwargs = {
            "limit": limit,
            "status": status,
            "name": name,
            "ip": ip,
            "group": group,
            "os_platform": os_platform,
            "version": version,
        }
        client_kwargs = {k: v for k, v in client_kwargs.items() if v is not None}

        try:
            agents = await self.agents_client.get_agents(**client_kwargs)

            
            if not agents:
                logger.info("No Wazuh agents found matching criteria. Returning standard message.")
                return self.not_found_result("Wazuh agents matching the specified criteria")
                
            num_agents = len(agents)
            
            # Format agents into MCP content items
            mcp_content_items = []
            
            for agent in agents:
                # Get status indicator
                status_indicator = ToolUtils.get_status_indicator(agent.status)
                
                # Build agent information
                details = []
                
                # Basic info
                agent_id_display = f"{agent.id} (Wazuh Manager)" if agent.id == "000" else agent.id
                details.append(f"Agent ID: {agent_id_display}")
                details.append(f"Name: {agent.name}")
                details.append(f"Status: {status_indicator}")
                
                # IP information
                if agent.ip:
                    details.append(f"IP: {agent.ip}")
                if agent.register_ip and agent.register_ip != agent.ip:
                    details.append(f"Register IP: {agent.register_ip}")
                
                # OS information
                if agent.os_name:
                    os_info = agent.os_name
                    if agent.os_version:
                        os_info += f" {agent.os_version}"
                    if agent.os_platform:
                        os_info += f" ({agent.os_platform})"
                    details.append(f"OS: {os_info}")
                
                # Version info
                if agent.version:
                    details.append(f"Version: {agent.version}")
                
                # Group info
                if agent.group:
                    groups = ", ".join(agent.group) if isinstance(agent.group, list) else str(agent.group)
                    details.append(f"Groups: {groups}")
                
                # Timestamps
                if agent.last_keepalive:
                    details.append(f"Last Keep Alive: {ToolUtils.format_timestamp(agent.last_keepalive)}")
                    
                if agent.date_add:
                    details.append(f"Registered: {ToolUtils.format_timestamp(agent.date_add)}")
                
                # Node info
                if agent.node_name:
                    details.append(f"Node: {agent.node_name}")
                
                # Config status
                if agent.group_config_status:
                    config_indicator = ToolUtils.get_status_indicator(agent.group_config_status)
                    details.append(f"Config Status: {config_indicator}")
                
                formatted_text = "\\n".join(details)
                mcp_content_items.append(Content.text(formatted_text))
            
            logger.info(
                f"Successfully processed {num_agents} agents into {len(mcp_content_items)} MCP content items"
            )
            
            return self.success_result(mcp_content_items)
            
        except WazuhApiError as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving agents", e)
            logger.error(error_msg)
            return self.error_result(error_msg)
            
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving agents", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)
    
    async def get_wazuh_agent_processes(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Retrieve running processes for a specific Wazuh agent
        
        Args:
            params: Dictionary containing agent_id, limit, and search parameters
                
        Returns:
            CallToolResult with formatted process information
        """
        agent_id = params.get("agent_id")
        if not agent_id:
            return self.error_result("Missing required parameter: agent_id. Available agents: 000 (manager), 001 (client)")
        
        limit = params.get("limit", 300)
        search = params.get("search")
        
        # Format agent ID
        formatted_agent_id, error_msg = ToolUtils.format_agent_id(agent_id)
        if error_msg:
            logger.error(f"Error formatting agent_id for agent processes: {error_msg}")
            return self.error_result(error_msg)
        
        logger.info(
            f"Retrieving Wazuh agent processes for agent_id={formatted_agent_id}, "
            f"limit={limit}, search={search}"
        )
        
        # Build and filter client_kwargs
        client_kwargs = {k: v for k, v in {
            "agent_id": formatted_agent_id,
            "limit": limit,
            "offset": 0,
            "search": search,
        }.items() if v is not None}

        try:
            processes = await self.vulnerability_client.get_agent_processes(**client_kwargs)
            
            if not processes:
                logger.info(f"No processes found for agent {formatted_agent_id} with current filters.")
                return self.not_found_result(f"processes for agent {formatted_agent_id} matching the specified criteria")
                
            num_processes = len(processes)
            
            # Format processes into MCP content items
            mcp_content_items = []
            
            for process in processes:
                details = []
                details.append(f"PID: {process.pid}")
                details.append(f"Name: {process.name}")
                
                if process.state:
                    details.append(f"State: {process.state}")
                    
                if process.user:
                    details.append(f"User: {process.user}")
                    
                if process.group:
                    details.append(f"Group: {process.group}")
                
                if process.cmd:
                    cmd = ToolUtils.truncate_text(process.cmd, 150)
                    details.append(f"Command: {cmd}")
                    
                if process.args:
                    args = ToolUtils.truncate_text(process.args, 150)
                    details.append(f"Args: {args}")
                
                formatted_text = "\\n".join(details)
                mcp_content_items.append(Content.text(formatted_text))
            
            logger.info(
                f"Successfully processed {num_processes} processes into {len(mcp_content_items)} MCP content items"
            )
            
            return self.success_result(mcp_content_items)
            
        except WazuhApiError as e:
            if e.status_code == 404:
                logger.info(f"No processes found for agent {formatted_agent_id} (404).")
                return self.not_found_result(f"processes for agent {formatted_agent_id}")
            else:
                error_msg = self.format_error("Wazuh Manager", "retrieving agent processes", e)
                logger.error(error_msg)
                return self.error_result(error_msg)
                
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving agent processes", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)
    
    async def get_wazuh_agent_ports(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Retrieve open network ports for a specific Wazuh agent
        
        Args:
            params: Dictionary containing agent_id, limit, protocol, and state parameters
                
        Returns:
            CallToolResult with formatted port information
        """
        agent_id = params.get("agent_id")
        if not agent_id:
            return self.error_result("Missing required parameter: agent_id. Available agents: 000 (manager), 001 (client)")
        
        limit = params.get("limit", 300)
        protocol = params.get("protocol", "")
        state = params.get("state", "")
        
        # Format agent ID
        formatted_agent_id, error_msg = ToolUtils.format_agent_id(agent_id)
        if error_msg:
            logger.error(f"Error formatting agent_id for agent ports: {error_msg}")
            return self.error_result(error_msg)
        
        logger.info(
            f"Retrieving Wazuh agent ports for agent_id={formatted_agent_id}, "
            f"limit={limit}, protocol={protocol}, state={state}"
        )
        
        # Build and filter client_kwargs
        client_kwargs = {k: v for k, v in {
            "agent_id": formatted_agent_id,
            "limit": limit,
            "protocol": protocol,
            "state": state,
        }.items() if v is not None}

        try:
            ports = await self.vulnerability_client.get_agent_ports(**client_kwargs)
            
            # Apply state filtering if specified (client-side filtering)
            if state:
                ports = ToolUtils.filter_ports_by_state(ports, state)
            
            if not ports:
                logger.info(f"No ports found for agent {formatted_agent_id} with current filters.")
                return self.not_found_result(f"ports for agent {formatted_agent_id} matching the specified criteria")
                
            num_ports = len(ports)
            
            # Format ports into MCP content items
            mcp_content_items = []
            
            for port in ports:
                details = []
                
                # Local information
                local_info = f"{port.local_ip or 'N/A'}:{port.local_port or 'N/A'}"
                details.append(f"Local: {local_info}")
                
                # Remote information (if available)
                if port.remote_ip or port.remote_port:
                    remote_info = f"{port.remote_ip or 'N/A'}:{port.remote_port or 'N/A'}"
                    details.append(f"Remote: {remote_info}")
                
                # Protocol
                if port.protocol:
                    details.append(f"Protocol: {port.protocol.upper()}")
                
                # State
                if port.state:
                    state_indicator = ToolUtils.get_status_indicator(port.state)
                    details.append(f"State: {state_indicator}")
                
                # Process information
                if port.process:
                    process_info = port.process
                    if port.pid:
                        process_info += f" (PID: {port.pid})"
                    details.append(f"Process: {process_info}")
                elif port.pid:
                    details.append(f"PID: {port.pid}")
                
                formatted_text = "\\n".join(details)
                mcp_content_items.append(Content.text(formatted_text))
            
            logger.info(
                f"Successfully processed {num_ports} ports into {len(mcp_content_items)} MCP content items"
            )
            
            return self.success_result(mcp_content_items)
            
        except WazuhApiError as e:
            if e.status_code == 404:
                logger.info(f"No ports found for agent {formatted_agent_id} (404).")
                return self.not_found_result(f"ports for agent {formatted_agent_id}")
            else:
                error_msg = self.format_error("Wazuh Manager", "retrieving agent ports", e)
                logger.error(error_msg)
                return self.error_result(error_msg)
                
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving agent ports", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)