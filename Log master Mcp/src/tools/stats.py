# Stats Tools Module
"""
Statistics and monitoring-related tool implementations for Wazuh MCP Server
Equivalent to the Rust tools/stats.rs
"""

import logging
import json
from typing import Dict, Any, Optional, List
from dataclasses import dataclass

from . import ToolModule, ToolUtils, Content, CallToolResult
from wazuh_client import LogsClient, ClusterClient, WazuhApiError

logger = logging.getLogger(__name__)

@dataclass
class SearchManagerLogsParams:
    """Parameters for search_wazuh_manager_logs"""
    limit: Optional[int] = None
    offset: Optional[int] = None
    level: Optional[str] = None
    tag: Optional[str] = None
    search_term: Optional[str] = None

@dataclass
class GetManagerErrorLogsParams:
    """Parameters for get_wazuh_manager_error_logs"""
    limit: Optional[int] = None

@dataclass
class GetLogCollectorStatsParams:
    """Parameters for get_wazuh_log_collector_stats"""
    agent_id: str

@dataclass  
class GetRemotedStatsParams:
    """Parameters for get_wazuh_remoted_stats"""
    pass

@dataclass
class GetWeeklyStatsParams:
    """Parameters for get_wazuh_weekly_stats"""
    pass

@dataclass
class GetClusterHealthParams:
    """Parameters for get_wazuh_cluster_health"""
    pass

@dataclass
class GetClusterNodesParams:
    """Parameters for get_wazuh_cluster_nodes"""
    limit: Optional[int] = None
    offset: Optional[int] = None
    node_type: Optional[str] = None

class StatsTools(ToolModule):
    """Tools for Wazuh statistics and monitoring"""
    
    def __init__(self, logs_client: LogsClient, cluster_client: ClusterClient):
        self.logs_client = logs_client
        self.cluster_client = cluster_client
        
    async def search_wazuh_manager_logs(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Search Wazuh manager logs
        
        Args:
            params: Dictionary containing:
                - limit: Maximum number of log entries to retrieve (default: 100)
                - offset: Number of log entries to skip (default: 0)
                - level: Filter by log level (optional)
                - tag: Filter by log tag (optional)
                - search_term: Free-text search term (optional)
                
        Returns:
            CallToolResult with formatted log entries
        """
        limit = params.get("limit", 100)
        offset = params.get("offset", 0)
        level = params.get("level")
        tag = params.get("tag")
        search_term = params.get("search_term")
        
        logger.info(
            f"Searching Wazuh manager logs with limit={limit}, offset={offset}, "
            f"level={level}, tag={tag}, search_term={search_term}"
        )
        
        # Filter out None values before API call
        client_kwargs = {k: v for k, v in {
            "limit": limit,
            "offset": offset,
            "level": level,
            "tag": tag,
            "search": search_term,    # use 'search' for free-text
        }.items() if v is not None}

        try:
            log_entries = await self.logs_client.search_manager_logs(**client_kwargs)
            
            if not log_entries:
                logger.info("No Wazuh manager logs found matching criteria.")
                return self.not_found_result("Wazuh manager logs matching the specified criteria")
                
            num_logs = len(log_entries)
            
            # Format log entries into MCP content items
            mcp_content_items = []
            
            for log_entry in log_entries:
                details = []
                
                # Timestamp
                timestamp = log_entry.get("timestamp", "N/A")
                details.append(f"Timestamp: {ToolUtils.format_timestamp(timestamp)}")
                
                # Tag
                tag_value = log_entry.get("tag", "N/A")
                details.append(f"Tag: {tag_value}")
                
                # Level with indicator
                level_value = log_entry.get("level", "N/A")
                if level_value.lower() == "error":
                    level_display = f"🔴 {level_value.upper()}"
                elif level_value.lower() == "warning":
                    level_display = f"🟡 {level_value.upper()}"
                elif level_value.lower() == "info":
                    level_display = f"🔵 {level_value.upper()}"
                else:
                    level_display = level_value.upper()
                details.append(f"Level: {level_display}")
                
                # Description/message
                description = log_entry.get("description", log_entry.get("message", "No description"))
                details.append(f"Description: {description}")
                
                formatted_text = "\\n".join(details)
                mcp_content_items.append(Content.text(formatted_text))
            
            logger.info(
                f"Successfully processed {num_logs} log entries into {len(mcp_content_items)} MCP content items"
            )
            
            return self.success_result(mcp_content_items)
            
        except WazuhApiError as e:
            error_msg = self.format_error("Wazuh Manager", "searching manager logs", e)
            logger.error(error_msg)
            return self.error_result(error_msg)
            
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "searching manager logs", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)
    
    async def get_wazuh_manager_error_logs(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Get Wazuh manager error logs
        
        Args:
            params: Dictionary containing:
                - limit: Maximum number of log entries to retrieve (default: 100)
                
        Returns:
            CallToolResult with formatted error log entries
        """
        limit = params.get("limit", 100)
        if limit is None:
            limit = 100

        client_kwargs = {k: v for k, v in {
            "limit": limit,
            "level": "error"
        }.items() if v is not None}

        logger.info(f"Retrieving Wazuh manager error logs with limit={limit}")
        
        try:
            log_entries = await self.logs_client.search_manager_logs(**client_kwargs)
            
            if not log_entries:
                logger.info("No Wazuh manager error logs found.")
                return self.not_found_result("Wazuh manager error logs")
                
            num_logs = len(log_entries)
            
            # Format log entries into MCP content items
            mcp_content_items = []
            
            for log_entry in log_entries:
                details = []
                
                # Timestamp
                timestamp = log_entry.get("timestamp", "N/A")
                details.append(f"Timestamp: {ToolUtils.format_timestamp(timestamp)}")
                
                # Tag
                tag_value = log_entry.get("tag", "N/A")
                details.append(f"Tag: {tag_value}")
                
                # Level (should be error)
                details.append("Level: 🔴 ERROR")
                
                # Description
                description = log_entry.get("description", log_entry.get("message", "No description"))
                details.append(f"Description: {description}")
                
                formatted_text = "\\n".join(details)
                mcp_content_items.append(Content.text(formatted_text))
            
            logger.info(
                f"Successfully processed {num_logs} error log entries into {len(mcp_content_items)} MCP content items"
            )
            
            return self.success_result(mcp_content_items)
            
        except WazuhApiError as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving manager error logs", e)
            logger.error(error_msg)
            return self.error_result(error_msg)
            
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving manager error logs", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)
    
    async def get_wazuh_log_collector_stats(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Get log collector statistics for a specific Wazuh agent
        
        Args:
            params: Dictionary containing:
                - agent_id: Agent ID to get log collector stats for (required)
                
        Returns:
            CallToolResult with formatted log collector statistics
        """
        agent_id = params.get("agent_id")
        if not agent_id:
            return self.error_result("Missing required parameter: agent_id. Available agents: 000 (manager), 001 (client)")
        
        # Format agent ID
        formatted_agent_id, error_msg = ToolUtils.format_agent_id(agent_id)
        if error_msg:
            logger.error(f"Error formatting agent_id for log collector stats: {error_msg}")
            return self.error_result(error_msg)
        
        logger.info(f"Retrieving log collector stats for agent_id={formatted_agent_id}")
        
        try:
            # Note: This is a placeholder implementation
            # The actual Wazuh API endpoint for log collector stats would need to be implemented
            # in the wazuh_client module
            
            # For now, return a placeholder message
            placeholder_text = f"Log collector statistics for agent {formatted_agent_id} are not yet implemented in this Python version. This would typically include information about events processed, dropped bytes, and target log files."
            
            return self.success_result([Content.text(placeholder_text)])
            
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving log collector stats", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)
    
    async def get_wazuh_remoted_stats(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Get statistics from the Wazuh remoted daemon
        
        Returns:
            CallToolResult with formatted remoted statistics
        """
        logger.info("Retrieving Wazuh remoted stats")
        
        try:
            # Note: This is a placeholder implementation
            # The actual Wazuh API endpoint for remoted stats would need to be implemented
            # in the wazuh_client module
            
            placeholder_text = "Remoted daemon statistics are not yet implemented in this Python version. This would typically include information about queue size, TCP sessions, event counts, and message traffic."
            
            return self.success_result([Content.text(placeholder_text)])
            
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving remoted stats", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)
    
    async def get_wazuh_weekly_stats(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Get weekly statistics from the Wazuh manager
        
        Returns:
            CallToolResult with formatted weekly statistics
        """
        logger.info("Retrieving Wazuh weekly stats")
        
        try:
            # Note: This is a placeholder implementation
            # The actual Wazuh API endpoint for weekly stats would need to be implemented
            # in the wazuh_client module
            
            placeholder_text = "Weekly statistics are not yet implemented in this Python version. This would typically return a JSON object detailing various metrics aggregated over the past week."
            
            return self.success_result([Content.text(placeholder_text)])
            
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving weekly stats", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)
    
    async def get_wazuh_cluster_health(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Check the health of the Wazuh cluster
        
        Returns:
            CallToolResult with cluster health status
        """
        logger.info("Checking Wazuh cluster health")
        
        try:
            # Get cluster status
            cluster_status = await self.cluster_client.get_cluster_status()
            
            # Determine if cluster is healthy
            is_healthy = True
            health_reasons = []
            
            if cluster_status.enabled.lower() != "yes":
                is_healthy = False
                health_reasons.append("cluster is not enabled")
            
            if cluster_status.running.lower() != "yes":
                is_healthy = False
                health_reasons.append("cluster is not running")
            
            if cluster_status.enabled.lower() == "yes" and cluster_status.running.lower() == "yes":
                try:
                    # Check if nodes are connected
                    health_check = await self.cluster_client.get_cluster_healthcheck()
                    if health_check.n_connected_nodes == 0:
                        is_healthy = False
                        health_reasons.append("no nodes are connected")
                except:
                    is_healthy = False
                    health_reasons.append("healthcheck endpoint failed or reported issues")
            
            # Format health status
            if is_healthy:
                health_text = "Cluster is healthy: Yes"
            else:
                if not health_reasons:
                    health_reasons.append("unknown reason, check detailed logs or healthcheck endpoint")
                health_text = f"Cluster is healthy: No. Reasons: {'; '.join(health_reasons)}"
            
            logger.info(f"Successfully retrieved cluster health: {health_text}")
            
            return self.success_result([Content.text(health_text)])
            
        except WazuhApiError as e:
            # If we can't get basic cluster status, assume unhealthy
            health_text = "Cluster is healthy: No. Additionally, failed to retrieve basic cluster status for more details."
            logger.error(f"Error checking cluster health: {e}")
            return self.success_result([Content.text(health_text)])
            
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "checking cluster health", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)
    
    async def get_wazuh_cluster_nodes(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Get a list of nodes in the Wazuh cluster
        
        Args:
            params: Dictionary containing:
                - limit: Maximum number of nodes to retrieve (optional)
                - offset: Number of nodes to skip (optional)
                - node_type: Filter by node type (optional)
                
        Returns:
            CallToolResult with formatted cluster node information
        """
        limit = params.get("limit")
        offset = params.get("offset")
        node_type = params.get("node_type")
        
        logger.info(
            f"Retrieving Wazuh cluster nodes with limit={limit}, offset={offset}, node_type={node_type}"
        )
        
        # Build client_kwargs and filter out None values
        client_kwargs = {k: v for k, v in {
            "limit": limit,
            "offset": offset,
            "node_type": node_type,
        }.items() if v is not None}

        try:
            nodes = await self.cluster_client.get_cluster_nodes(**client_kwargs)
            if not nodes:
                logger.info("No Wazuh cluster nodes found matching criteria.")
                return self.not_found_result("Wazuh cluster nodes")
                
            num_nodes = len(nodes)
            
            # Format nodes into MCP content items
            mcp_content_items = []
            
            for node in nodes:
                details = []
                details.append(f"Node Name: {node.name}")
                details.append(f"Type: {node.node_type}")
                details.append(f"Version: {node.version}")
                details.append(f"IP: {node.ip}")
                status_indicator = ToolUtils.get_status_indicator(node.status)
                details.append(f"Status: {status_indicator}")
                formatted_text = "\\n".join(details)
                mcp_content_items.append(Content.text(formatted_text))
            
            logger.info(
                f"Successfully processed {num_nodes} cluster nodes into {len(mcp_content_items)} MCP content items"
            )
            
            return self.success_result(mcp_content_items)
        except WazuhApiError as e:
            if e.status_code == 400 and "Cluster is not running" in str(e):
                return self.not_found_result("Wazuh cluster (not enabled)")
            error_msg = self.format_error("Wazuh Manager", "retrieving cluster nodes", e)
            logger.error(error_msg)
            return self.error_result(error_msg)
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving cluster nodes", e)
            logger.exception(error_msg)
            return self.error_result(error_msg)