import re
import logging
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class ToolModule:
    """Base class for MCP tool modules"""

    def _success_result(self, content):
        """Create a successful tool result"""
        return {"type": "success", "content": content}

    def _error_result(self, message: str):
        """Create an error tool result"""
        return {"type": "error", "content": [{"type": "text", "text": message}]}

    def _not_found_result(self, item_description: str):
        """Create a not found result"""
        return {"type": "success", "content": [{"type": "text", "text": f"No {item_description} found."}]}

class ToolUtils:
    """Utility functions for MCP tool implementations"""

    @staticmethod
    def format_agent_id(agent_id: str) -> tuple[str, Optional[str]]:
        """
        Formats an agent ID to the '001' or '007' format.
        Returns (formatted_id, error_message).
        """
        if not agent_id:
            return "", "Agent ID cannot be empty."

        # Remove 'agent/' prefix if present
        if agent_id.startswith("agent/"):
            agent_id = agent_id[len("agent/"):]

        # Check if it's already in the correct format (e.g., "001")
        if re.fullmatch(r'\d{3}', agent_id):
            return agent_id, None

        # Try to convert an integer to the '001' format
        try:
            int_id = int(agent_id)
            if 0 <= int_id <= 999:
                return f"{int_id:03d}", None
            else:
                return "", "Agent ID must be between 0 and 999 for automatic formatting."
        except ValueError:
            return "", f"Invalid agent ID format: '{agent_id}'. Expected '001' or an integer."

    @staticmethod
    def format_timestamp(timestamp):
        """Format timestamp for display"""
        if not timestamp:
            return "N/A"
        try:
            if isinstance(timestamp, str):
                # Try to parse different timestamp formats
                for fmt in ["%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d %H:%M:%S"]:
                    try:
                        dt = datetime.strptime(timestamp.replace('Z', '+00:00'), fmt)
                        return dt.strftime("%Y-%m-%d %H:%M:%S UTC")
                    except ValueError:
                        pass
                return timestamp  # Return as is if can't parse
            else:
                return str(timestamp)
        except Exception:
            return str(timestamp)

    @staticmethod
    def get_severity_indicator(severity: str) -> str:
        """Get severity indicator with color/symbol"""
        severity = severity.upper() if severity else ""
        if severity == "CRITICAL":
            return "🔴 CRITICAL"
        elif severity == "HIGH":
            return "🟠 HIGH"
        elif severity == "MEDIUM":
            return "🟡 MEDIUM"
        elif severity == "LOW":
            return "🟢 LOW"
        elif severity == "INFORMATIONAL":
            return "ℹ️ INFORMATIONAL"
        else:
            return f"❓ {severity}"

    @staticmethod
    def truncate_text(text: str, max_length: int = 200) -> str:
        """Truncate text to max length with ellipsis"""
        if not text or len(text) <= max_length:
            return text
        return text[:max_length - 3] + "..."
