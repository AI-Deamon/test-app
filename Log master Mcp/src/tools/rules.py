# Rules Tools Module
"""
Rules-related tool implementations for Wazuh MCP Server
Equivalent to the Rust tools/rules.rs
"""

import logging
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
import asyncio

from . import ToolModule, ToolUtils, Content, CallToolResult
from wazuh_client import RulesClient, WazuhApiError

logger = logging.getLogger(__name__)

@dataclass
class GetRulesSummaryParams:
    """Parameters for get_wazuh_rules_summary"""
    limit: Optional[int] = None
    level: Optional[int] = None
    group: Optional[str] = None
    filename: Optional[str] = None

class RuleTools(ToolModule):
    """Tools for managing Wazuh security rules"""
    
    def __init__(self, rules_client: RulesClient):
        self.rules_client = rules_client
        
    async def get_wazuh_rules_summary(self, params: Dict[str, Any]) -> CallToolResult:
        """
        Retrieve a summary of Wazuh security rules
        
        Args:
            params: Dictionary containing:
                - limit: Maximum number of rules to retrieve (default: 300)
                - level: Filter by rule level (optional)
                - group: Filter by rule group (optional) 
                - filename: Filter by rule filename (optional)
                
        Returns:
            CallToolResult with formatted rule information
        """
        limit = params.get("limit", 300)
        level = params.get("level")
        group = params.get("group")
        filename = params.get("filename")
        
        logger.info(
            f"Retrieving Wazuh rules summary with limit={limit}, level={level}, "
            f"group={group}, filename={filename}"
        )
        
        # Build and filter client_kwargs
        client_kwargs = {k: v for k, v in {
            "limit": limit,
            "level": level,
            "group": group,
            "filename": filename,
        }.items() if v is not None}

        try:
            rules = await self.rules_client.get_rules(**client_kwargs)
            
            if not rules:
                logger.info("No Wazuh rules found matching criteria. Returning standard message.")
                return self.not_found_result("Wazuh rules matching the specified criteria")
                
            num_rules = len(rules)
            
            # Format rules into MCP content items
            mcp_content_items = []
            
            for rule in rules:
                details = []
                
                # Basic rule information
                details.append(f"Rule ID: {rule.id}")
                
                # Level with indicator
                level_indicator = ToolUtils.get_level_indicator(rule.level)
                details.append(f"Level: {level_indicator}")
                
                # Description
                details.append(f"Description: {rule.description}")
                
                # Groups
                if rule.groups:
                    groups = ", ".join(rule.groups)
                    details.append(f"Groups: {groups}")
                
                # Filename
                if rule.filename:
                    details.append(f"Filename: {rule.filename}")
                
                # Compliance information
                compliance_info = []
                if rule.pci_dss:
                    compliance_info.append(f"PCI DSS: {', '.join(rule.pci_dss)}")
                if rule.gdpr:
                    compliance_info.append(f"GDPR: {', '.join(rule.gdpr)}")
                if rule.hipaa:
                    compliance_info.append(f"HIPAA: {', '.join(rule.hipaa)}")
                if rule.nist_800_53:
                    compliance_info.append(f"NIST 800-53: {', '.join(rule.nist_800_53)}")
                
                if compliance_info:
                    details.append(f"Compliance: {'; '.join(compliance_info)}")
                
                # MITRE ATT&CK information
                if rule.mitre:
                    mitre_info = []
                    if "id" in rule.mitre:
                        mitre_info.append(f"ID: {', '.join(rule.mitre['id']) if isinstance(rule.mitre['id'], list) else rule.mitre['id']}")
                    if "tactic" in rule.mitre:
                        mitre_info.append(f"Tactic: {', '.join(rule.mitre['tactic']) if isinstance(rule.mitre['tactic'], list) else rule.mitre['tactic']}")
                    if "technique" in rule.mitre:
                        mitre_info.append(f"Technique: {', '.join(rule.mitre['technique']) if isinstance(rule.mitre['technique'], list) else rule.mitre['technique']}")
                    
                    if mitre_info:
                        details.append(f"MITRE ATT&CK: {'; '.join(mitre_info)}")
                
                # Status
                if rule.status:
                    status_indicator = ToolUtils.get_status_indicator(rule.status)
                    details.append(f"Status: {status_indicator}")
                
                formatted_text = "\\n".join(details)
                mcp_content_items.append(Content.text(formatted_text))
            
            logger.info(
                f"Successfully processed {num_rules} rules into {len(mcp_content_items)} MCP content items"
            )
            
            return self.success_result(mcp_content_items)
            
        except WazuhApiError as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving rules", e)
            logger.error(error_msg)
            return self.error_result(error_msg)
            
        except asyncio.TimeoutError:
            return self.error_result("Request timed out - server may be overloaded")
            
        except Exception as e:
            error_msg = self.format_error("Wazuh Manager", "retrieving rules", e)
            logger.exception(error_msg)
            return self.error_result(f"Connection error: {str(e)}")