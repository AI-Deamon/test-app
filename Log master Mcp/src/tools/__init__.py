# Base Tool Module and Utilities
"""
Base classes and utilities for Wazuh MCP Server tool modules
Equivalent to the Rust tools/mod.rs functionality
"""

import logging
import re
from typing import List, Dict, Any, Optional
from abc import ABC, abstractmethod
from mcp_protocol import Content, CallToolResult

logger = logging.getLogger(__name__)

class ToolModule(ABC):
    """Base class for all tool modules"""
    
    @staticmethod
    def success_result(content: List[Content]) -> CallToolResult:
        """Create a successful result"""
        return CallToolResult.success(content)
    
    @staticmethod
    def error_result(error_msg: str) -> CallToolResult:
        """Create an error result"""
        return CallToolResult.error([Content.text(error_msg)])
    
    @staticmethod
    def not_found_result(item_type: str) -> CallToolResult:
        """Create a not found result"""
        return CallToolResult.success([Content.text(f"No {item_type} found.")])
    
    @staticmethod
    def format_error(component: str, action: str, error: Exception) -> str:
        """Format error message consistently"""
        return f"Error {action} from {component}: {str(error)}"

class ToolUtils:
    """Utility functions for tool modules"""
    
    @staticmethod
    def format_agent_id(agent_id: str) -> tuple[str, Optional[str]]:
        """
        Format agent ID to ensure it's a 3-digit zero-padded string.
        Returns (formatted_id, error_message)
        
        Examples:
        - "0" -> ("000", None)  
        - "1" -> ("001", None)
        - "12" -> ("012", None)
        - "123" -> ("123", None)
        - "invalid" -> (None, "error message")
        """
        try:
            # Handle string input that represents a number
            if isinstance(agent_id, str):
                # Remove leading/trailing whitespace
                agent_id = agent_id.strip()
                
                # Check if it's already a valid format (e.g., "001", "123")
                if re.match(r'^\d{1,3}$', agent_id):
                    # Convert to int and back to ensure it's valid, then zero-pad
                    num = int(agent_id)
                    if 0 <= num <= 999:
                        formatted_id = f"{num:03d}"
                        return formatted_id, None
                    else:
                        return "", f"Agent ID must be between 0 and 999, got: {agent_id}"
                else:
                    return "", f"Invalid agent ID format: {agent_id}. Expected numeric string."
            else:
                return "", f"Agent ID must be a string, got: {type(agent_id)}"
                
        except ValueError:
            return "", f"Cannot convert agent ID to number: {agent_id}"
        except Exception as e:
            return "", f"Error formatting agent ID {agent_id}: {str(e)}"
    
    @staticmethod
    def filter_ports_by_state(ports: List[Any], state_filter: str) -> List[Any]:
        """
        Filter ports by state, implementing the same logic as the Rust version.
        
        Args:
            ports: List of port objects
            state_filter: State to filter by (e.g., "LISTENING", "ESTABLISHED")
            
        Returns:
            Filtered list of ports
        """
        if not state_filter:
            return ports
            
        filtered_ports = []
        state_filter_lower = state_filter.lower()
        
        for port in ports:
            port_state = getattr(port, 'state', None)
            
            # Skip ports with empty state strings
            if port_state == "":
                continue
                
            if state_filter_lower == "listening":
                # Only ports explicitly in LISTENING state
                if port_state and port_state.lower() == "listening":
                    filtered_ports.append(port)
            else:
                # All ports NOT in LISTENING state (including those with no state)
                if not port_state or port_state.lower() != "listening":
                    filtered_ports.append(port)
                    
        return filtered_ports
    
    @staticmethod
    def truncate_text(text: str, max_length: int = 200) -> str:
        """Truncate text to maximum length with ellipsis"""
        if len(text) <= max_length:
            return text
        return text[:max_length-3] + "..."
    
    @staticmethod
    def format_timestamp(timestamp: Optional[str]) -> str:
        """Format timestamp for display"""
        if not timestamp:
            return "N/A"
        
        # Basic timestamp formatting - could be enhanced
        return timestamp.replace('T', ' ').replace('Z', ' UTC')
    
    @staticmethod
    def get_status_indicator(status: str) -> str:
        """Get emoji indicator for status"""
        status_lower = status.lower()
        
        status_indicators = {
            'active': '🟢 ACTIVE',
            'connected': '🟢 CONNECTED', 
            'online': '🟢 ONLINE',
            'running': '🟢 RUNNING',
            'synced': '✅ SYNCED',
            'healthy': '✅ HEALTHY',
            
            'inactive': '🔴 INACTIVE',
            'disconnected': '🔴 DISCONNECTED',
            'offline': '🔴 OFFLINE',
            'stopped': '🔴 STOPPED', 
            'not synced': '❌ NOT SYNCED',
            'unhealthy': '❌ UNHEALTHY',
            
            'pending': '🟡 PENDING',
            'never_connected': '⚪ NEVER CONNECTED',
            'unknown': '❓ UNKNOWN'
        }
        
        return status_indicators.get(status_lower, status.upper())
    
    @staticmethod
    def get_severity_indicator(severity: str) -> str:
        """Get emoji indicator for vulnerability severity"""
        severity_lower = severity.lower()
        
        severity_indicators = {
            'critical': '🔴 CRITICAL',
            'high': '🟠 HIGH',
            'medium': '🟡 MEDIUM', 
            'low': '🟢 LOW',
            'info': '🔵 INFO',
            'informational': '🔵 INFO'
        }
        
        return severity_indicators.get(severity_lower, severity.upper())
    
    @staticmethod
    def get_level_indicator(level: int) -> str:
        """Get emoji indicator for rule/alert level"""
        if level >= 12:
            return f"🔴 LEVEL {level}"
        elif level >= 7:
            return f"🟠 LEVEL {level}"
        elif level >= 4:
            return f"🟡 LEVEL {level}"
        elif level >= 1:
            return f"🟢 LEVEL {level}"
        else:
            return f"⚪ LEVEL {level}"

# Export commonly used types and functions
__all__ = [
    'ToolModule',
    'ToolUtils', 
    'Content',
    'CallToolResult'
]