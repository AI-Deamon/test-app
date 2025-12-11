#!/usr/bin/env python3
"""
Wazuh MCP Server - Python Implementation

This is the main entry point for the Python implementation of the Wazuh MCP Server.
It serves as a bridge between Wazuh SIEM systems and MCP clients.

Equivalent to the Rust main.rs file.
"""

import asyncio
import logging
import os
import sys
from typing import Dict, Any, Optional

from dotenv import load_dotenv

# Import MCP protocol components
from mcp_protocol import (
    ServerHandler, McpServerInfo, Implementation, ServerCapabilities,
    ProtocolVersion, serve_stdio, CallToolResult, Content, tool_box, tool
)

# Import Wazuh client components
from wazuh_client import WazuhClientFactory, WazuhApiError

# Import tool modules
from src.tools.vulnerabilities import VulnerabilityTools
from src.tools.utils import ToolModule

# Configure logging
logger = logging.getLogger(__name__)

def setup_logging():
    """Setup structured logging based on LOG_LEVEL environment variable."""
    load_dotenv()  # Load environment variables from .env file
    log_level_str = os.getenv("LOG_LEVEL", "INFO").upper()  # Use LOG_LEVEL

    log_level = getattr(logging, log_level_str, logging.INFO)

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        stream=sys.stderr
    )
    logger.info(f"Logging level set to {log_level_str}")

@tool_box
class WazuhMcpHandler(ServerHandler):
    """
    Main handler for the Wazuh MCP server, exposing Wazuh API functionalities
    as MCP tools.
    """
    def __init__(self):
        load_dotenv()  # Ensure .env is loaded for client factory config

        # Initialize WazuhClientFactory
        self.client_factory = WazuhClientFactory.builder() \
            .api_host(os.getenv("WAZUH_API_HOST", "localhost")) \
            .api_port(int(os.getenv("WAZUH_API_PORT", "55000"))) \
            .api_credentials(os.getenv("WAZUH_API_USERNAME", "wazuh"), os.getenv("WAZUH_API_PASSWORD", "wazuh")) \
            .indexer_host(os.getenv("WAZUH_INDEXER_HOST", "localhost")) \
            .indexer_port(int(os.getenv("WAZUH_INDEXER_PORT", "9200"))) \
            .indexer_credentials(os.getenv("WAZUH_INDEXER_USERNAME", "admin"), os.getenv("WAZUH_INDEXER_PASSWORD", "admin")) \
            .protocol(os.getenv("WAZUH_PROTOCOL", "https")) \
            .verify_ssl(os.getenv("WAZUH_VERIFY_SSL", "false").lower() == "true") \
            .build()

        # Initialize specific tool modules
        # These clients will be used as async context managers within the tool methods
        self.vulnerability_client = self.client_factory.create_vulnerability_client()
        self.indexer_client = self.client_factory.create_indexer_client()
        self.agents_client = self.client_factory.create_agents_client()
        # ... create other clients as needed ...

        self.vulnerability_tools = VulnerabilityTools(self.vulnerability_client)

    def get_info(self) -> McpServerInfo:
        """Returns the server's information and capabilities."""
        server_impl = Implementation.from_build_env()
        capabilities = ServerCapabilities.builder().enable_tools().build()

        return McpServerInfo(
            protocol_version=ProtocolVersion.V_2024_11_05,
            capabilities=capabilities,
            server_info=server_impl,
            instructions="""This server provides tools to interact with a Wazuh SIEM instance for security monitoring and analysis.
Available tools:
- 'get_wazuh_agents': Retrieves a list of Wazuh agents with their current status and details
- 'get_wazuh_vulnerability_summary': Retrieves vulnerability summary for a specific agent
- 'get_wazuh_critical_vulnerabilities': Retrieves critical vulnerabilities for a specific agent
- 'get_wazuh_alert_summary': Retrieves alerts from Wazuh Indexer
- Various other security monitoring and analysis tools"""
        )

    # --- Vulnerability Tools ---
    @tool(
        name="get_wazuh_vulnerability_summary",
        description="Retrieves a summary of Wazuh vulnerability detections for a specific agent."
    )
    async def get_wazuh_vulnerability_summary(self, agent_id: str,
                                            limit: Optional[int] = None,
                                            severity: Optional[str] = None,
                                            cve: Optional[str] = None) -> CallToolResult:
        """Get Wazuh vulnerability summary"""
        try:
            # Delegate to the VulnerabilityTools module
            return await self.vulnerability_tools.get_wazuh_vulnerability_summary(
                {"agent_id": agent_id, "limit": limit, "severity": severity, "cve": cve}
            )
        except Exception as e:
            logger.exception(f"Error in get_wazuh_vulnerability_summary: {e}")
            return CallToolResult.error([Content.text(f"Error retrieving vulnerabilities: {str(e)}")])

    @tool(name="get_wazuh_critical_vulnerabilities", description="Get critical vulnerabilities for a specific Wazuh agent.")
    async def get_wazuh_critical_vulnerabilities(self, agent_id: str, limit: int = 100) -> CallToolResult:
        """Get critical vulnerabilities for a specific agent"""
        try:
            # Delegate to the VulnerabilityTools module
            return await self.vulnerability_tools.get_wazuh_critical_vulnerabilities(
                {"agent_id": agent_id, "limit": limit}
            )
        except Exception as e:
            logger.exception(f"Error in get_wazuh_critical_vulnerabilities: {e}")
            return CallToolResult.error([Content.text(f"Error retrieving critical vulnerabilities: {str(e)}")])

    # --- Agents Tool ---
    @tool(name="get_wazuh_agents",
          description="Retrieves a list of Wazuh agents with their current status and details.")
    async def get_wazuh_agents(self, limit: Optional[int] = None,
                              status: str = "active") -> CallToolResult:
        """Get Wazuh agents"""
        try:
            async with self.agents_client as client:
                agents = await client.get_agents(limit=limit if limit else 100, status=status)

                if not agents:
                    return CallToolResult.success([Content.text("No agents found.")])

                agent_list = "Wazuh Agents:\n\n"
                for agent in agents:
                    agent_list += f"Agent ID: {agent.id} ({agent.name})\n"
                    agent_list += f"  Status: {'🟢 ACTIVE' if agent.status == 'active' else '🔴 ' + agent.status.upper()}\n"
                    agent_list += f"  IP: {agent.ip or 'N/A'}\n"
                    agent_list += f"  OS: {agent.os_name or 'N/A'} {agent.os_version or ''}\n"
                    agent_list += f"  Last Seen: {agent.last_keepalive or 'N/A'}\n\n"

                return CallToolResult.success([Content.text(agent_list)])

        except Exception as e:
            logger.exception(f"Error in get_wazuh_agents: {e}")
            return CallToolResult.error([Content.text(f"Error retrieving agents: {str(e)}")])

    # --- Alerts Tool ---
    @tool(name="get_wazuh_alert_summary",
          description="Retrieves alerts from Wazuh Indexer.")
    async def get_wazuh_alert_summary(self, limit: Optional[int] = None) -> CallToolResult:
        """Get Wazuh alerts summary"""
        try:
            async with self.indexer_client as client:
                alerts = await client.search_alerts(limit=limit if limit else 100)

                if not alerts:
                    return CallToolResult.success([Content.text("No alerts found.")])

                alert_summary = f"Recent Alerts ({len(alerts)} found):\n\n"
                for i, alert in enumerate(alerts[:10]):  # Show first 10
                    alert_summary += f"Alert {i+1}:\n"
                    alert_summary += f"  ID: {alert.get('id', 'N/A')}\n"
                    alert_summary += f"  Timestamp: {alert.get('timestamp', 'N/A')}\n"
                    alert_summary += f"  Level: {alert.get('rule', {}).get('level', 'N/A')}\n"
                    alert_summary += f"  Description: {alert.get('rule', {}).get('description', 'N/A')}\n\n"

                return CallToolResult.success([Content.text(alert_summary)])

        except Exception as e:
            logger.exception(f"Error in get_wazuh_alert_summary: {e}")
            return CallToolResult.error([Content.text(f"Error retrieving alerts: {str(e)}")])


async def main():
    setup_logging()
    logger.info("Starting Wazuh MCP Server...")
    handler = WazuhMcpHandler()
    await serve_stdio(handler)

if __name__ == "__main__":
    asyncio.run(main())
