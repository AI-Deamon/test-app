# Alert Tools Module
"""
Alert-related tool implementations for Wazuh MCP Server
Equivalent to the Rust tools/alerts.rs
"""

import logging
from typing import Dict, Any, Optional, List
from dataclasses import dataclass

from . import ToolModule, ToolUtils, Content, CallToolResult
from wazuh_client import WazuhIndexerClient, WazuhApiError

logger = logging.getLogger(__name__)

@dataclass
class GetAlertSummaryParams:
    """Parameters for get_wazuh_alert_summary"""
    limit: Optional[int] = None

class AlertTools(ToolModule):
    """Tools for managing Wazuh alerts"""
    
    def __init__(self, indexer_client: WazuhIndexerClient):
        self.indexer_client = indexer_client
        
    async def get_wazuh_alert_summary(self, params: Dict[str, Any]) -> CallToolResult:
        limit = params.get("limit")
        if not isinstance(limit, int):
            limit = 100
        
        logger.info(f"Retrieving Wazuh alert summary with limit={limit}")
        
        # Ensure limit is not None and is valid
        if limit is None:
            limit = 100

        try:
            alerts = await self.indexer_client.get_alerts(limit=limit)
            
            if not alerts:
                logger.info("No Wazuh alerts found. Returning standard message.")
                return self.not_found_result("Wazuh alerts")
                
            num_alerts = len(alerts)
            
            # Format alerts into MCP content items
            mcp_content_items = []
            
            for alert in alerts:
                # Extract key information from alert
                alert_id = alert.id or "N/A"
                timestamp = ToolUtils.format_timestamp(alert.timestamp)
                
                # Get agent information
                agent_info = ""
                if alert.agent:
                    agent_name = alert.agent.get("name", "N/A")
                    agent_ip = alert.agent.get("ip", "N/A")
                    agent_info = f"\\nAgent: {agent_name} ({agent_ip})"
                
                # Get rule information
                rule_info = ""
                level_indicator = ""
                if alert.rule:
                    rule_id = alert.rule.get("id", "N/A")
                    rule_description = alert.rule.get("description", "N/A")
                    rule_level = alert.rule.get("level", 0)
                    
                    level_indicator = ToolUtils.get_level_indicator(rule_level)
                    rule_info = f"\\nRule: {rule_id} - {rule_description}\\nLevel: {level_indicator}"
                
                # Get location information
                location_info = ""
                if alert.location:
                    location_info = f"\\nLocation: {alert.location}"
                
                # Get manager information  
                manager_info = ""
                if alert.manager:
                    manager_name = alert.manager.get("name", "N/A")
                    manager_info = f"\\nManager: {manager_name}"
                
                # Get cluster information
                cluster_info = ""
                if alert.cluster:
                    cluster_name = alert.cluster.get("name", "N/A")
                    cluster_info = f"\\nCluster: {cluster_name}"
                
                # Format the main alert text
                formatted_text = f"Alert ID: {alert_id}\\nTime: {timestamp}{agent_info}{rule_info}{location_info}{manager_info}{cluster_info}"
                
                # Add full log if available (truncated)
                if alert.full_log:
                    full_log = ToolUtils.truncate_text(alert.full_log, 300)
                    formatted_text += f"\\nLog: {full_log}"
                
                mcp_content_items.append(Content.text(formatted_text))
            
            logger.info(
                f"Successfully processed {num_alerts} alerts into {len(mcp_content_items)} MCP content items"
            )
            
            return self.success_result(mcp_content_items)
            
        except WazuhApiError as e:
            if e.status_code == 404:
                logger.info("No Wazuh alerts found (404). Returning standard message.")
                return self.not_found_result("Wazuh alerts")
            else:
                error_msg = self.format_error("Wazuh Indexer", "retrieving alerts", e)
                logger.error(error_msg)
                return self.error_result(error_msg)
                
        except Exception as e:
            error_msg = self.format_error("Wazuh Indexer", "retrieving alerts", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)