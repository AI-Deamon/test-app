# Vulnerabilities Tools Module
"""
Vulnerability-related tool implementations for Wazuh MCP Server
Equivalent to the Rust tools/vulnerabilities.rs
"""

import logging
from typing import Dict, Any, Optional, List

from mcp_protocol import CallToolResult, Content
from wazuh_client import VulnerabilityClient, WazuhApiError, Vulnerability

from . import ToolModule, ToolUtils

logger = logging.getLogger(__name__)

class VulnerabilityTools(ToolModule):
    """Tools for managing Wazuh vulnerabilities"""

    def __init__(self, vulnerability_client: VulnerabilityClient):
        self.vulnerability_client = vulnerability_client

    def _success_result(self, content: List[Content]) -> CallToolResult:
        return CallToolResult.success(content=content)

    def _error_result(self, message: str) -> CallToolResult:
        return CallToolResult.error(content=[Content.text(message)])

    def _not_found_result(self, item_description: str) -> CallToolResult:
        return CallToolResult.success(content=[Content.text(f"No {item_description} found.")])

    async def get_wazuh_vulnerability_summary(self, params: Dict[str, Any]) -> CallToolResult:
        agent_id = params.get("agent_id")
        if not agent_id:
            return self._error_result("Missing required parameter: agent_id. Available agents: 000 (manager), 001 (client)")

        agent_id = params.get("agent_id", "")
        limit = params.get("limit", 300)
        severity = params.get("severity")
        cve = params.get("cve")

        # Format agent ID
        formatted_agent_id, error_msg = ToolUtils.format_agent_id(agent_id)
        if error_msg:
            logger.error(f"Error formatting agent_id for vulnerability summary: {error_msg}")
            return self._error_result(error_msg)

        logger.info(
            f"Retrieving Wazuh vulnerability summary for agent_id={formatted_agent_id}, "
            f"limit={limit}, severity={severity}, cve={cve}"
        )

        try:
            # Use the vulnerability_client as an async context manager
            async with self.vulnerability_client as client:
                vulnerabilities: List[Vulnerability] = await client.get_vulnerabilities(
                    agent_id=formatted_agent_id,
                    limit=limit if limit is not None else 300,
                    severity=severity,
                    cve=cve
                )

            if not vulnerabilities:
                logger.info(f"No vulnerability summary found for agent {formatted_agent_id}.")
                return self._not_found_result(f"vulnerability summary for agent {formatted_agent_id}")

            # Format response
            mcp_content_items = []
            summary_text = f"Vulnerability Summary for Agent {formatted_agent_id}:\n"
            for vuln in vulnerabilities:
                summary_text += (
                    f"- CVE: {vuln.cve}, Title: {vuln.title}, Severity: {vuln.severity}, "
                    f"Published: {vuln.published}, Updated: {vuln.updated}\n"
                )
            mcp_content_items.append(Content.text(summary_text))

            return self._success_result(mcp_content_items)

        except WazuhApiError as e:
            error_msg = f"Error retrieving vulnerabilities from Wazuh Manager: {e}"
            logger.error(error_msg)
            return self._error_result(error_msg)
        except Exception as e:
            error_msg = f"An unexpected error occurred while retrieving vulnerabilities: {str(e)}"
            logger.exception(error_msg)
            return self._error_result(error_msg)

    async def get_wazuh_critical_vulnerabilities(self, params: Dict[str, Any]) -> CallToolResult:
        agent_id = params.get("agent_id")
        if not agent_id:
            return self._error_result("Missing required parameter: agent_id. Available agents: 000 (manager), 001 (client)")

        agent_id = params.get("agent_id", "")
        limit = params.get("limit", 300)

        # Format agent ID
        formatted_agent_id, error_msg = ToolUtils.format_agent_id(agent_id)
        if error_msg:
            logger.error(f"Error formatting agent_id for critical vulnerabilities: {error_msg}")
            return self._error_result(error_msg)

        logger.info(
            f"Retrieving Wazuh critical vulnerabilities for agent_id={formatted_agent_id}, limit={limit}"
        )

        try:
            # Use the vulnerability_client as an async context manager
            async with self.vulnerability_client as client:
                vulnerabilities: List[Vulnerability] = await client.get_critical_vulnerabilities(
                    agent_id=formatted_agent_id,
                    limit=limit
                )

            if not vulnerabilities:
                logger.info(f"No critical vulnerabilities found for agent {formatted_agent_id}.")
                return self._not_found_result(f"critical vulnerabilities for agent {formatted_agent_id}")

            # Format response
            mcp_content_items = []
            summary_text = f"Critical Vulnerabilities for Agent {formatted_agent_id}:\n"
            for vuln in vulnerabilities:
                summary_text += (
                    f"- CVE: {vuln.cve}, Title: {vuln.title}, Severity: {vuln.severity}, "
                    f"Published: {vuln.published}, Updated: {vuln.updated}\n"
                )
            mcp_content_items.append(Content.text(summary_text))

            return self._success_result(mcp_content_items)

        except WazuhApiError as e:
            error_msg = f"Error retrieving critical vulnerabilities from Wazuh Manager: {e}"
            logger.error(error_msg)
            return self._error_result(error_msg)
        except Exception as e:
            error_msg = f"An unexpected error occurred while retrieving critical vulnerabilities: {str(e)}"
            logger.exception(error_msg)
            return self._error_result(error_msg)
