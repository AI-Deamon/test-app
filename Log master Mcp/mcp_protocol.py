# MCP (Model Context Protocol) Implementation for Python
"""
Python implementation of the Model Context Protocol
Equivalent to the Rust rmcp framework
"""

import json
import sys
import asyncio
import logging
from typing import Dict, List, Optional, Any, Callable, Union, get_origin, get_args # Added get_origin, get_args
from dataclasses import dataclass, asdict
from enum import Enum
import traceback
from abc import ABC, abstractmethod
import inspect # Added inspect

# Configure logging
logger = logging.getLogger(__name__)

class ProtocolVersion:
    V_2024_11_05 = "2024-11-05"

@dataclass
class ServerInfo:
    """Server information for MCP protocol"""
    name: str
    version: str

@dataclass  
class ServerCapabilities:
    """Server capabilities for MCP protocol"""
    tools: bool = True
    prompts: bool = False
    resources: bool = False
    
    @classmethod
    def builder(cls):
        return cls._Builder()
    
    class _Builder:
        def __init__(self):
            self._tools = False
            self._prompts = False
            self._resources = False
        
        def enable_tools(self):
            self._tools = True
            return self
        
        def enable_prompts(self):
            self._prompts = True
            return self
            
        def enable_resources(self):
            self._resources = True
            return self
        
        def build(self):
            return ServerCapabilities(
                tools=self._tools,
                prompts=self._prompts,
                resources=self._resources
            )

@dataclass
class Content:
    """Content item for MCP responses"""
    type: str
    text: str
    
    @classmethod
    def text(cls, text: str):
        return cls(type="text", text=text)

@dataclass
class CallToolResult:
    """Result of a tool call"""
    content: List[Content]
    is_error: bool = False
    
    @classmethod
    def success(cls, content: List[Content]):
        return cls(content=content, is_error=False)
    
    @classmethod 
    def error(cls, content: List[Content]):
        return cls(content=content, is_error=True)

@dataclass
class ToolDefinition:
    """Definition of an MCP tool"""
    name: str
    description: str
    input_schema: Dict[str, Any]

class McpError(Exception):
    """Base exception for MCP protocol errors"""
    pass

class JsonRpcError(Exception):
    """JSON-RPC protocol error"""
    def __init__(self, code: int, message: str, data: Optional[Any] = None):
        self.code = code
        self.message = message
        self.data = data
        super().__init__(f"JSON-RPC Error {code}: {message}")

# JSON-RPC error codes
class ErrorCodes:
    PARSE_ERROR = -32700
    INVALID_REQUEST = -32600
    METHOD_NOT_FOUND = -32601
    INVALID_PARAMS = -32602
    INTERNAL_ERROR = -32603

class McpServer:
    """MCP Protocol server implementation"""
    
    def __init__(self, server_handler):
        self.handler = server_handler
        self.tools = {}
        self.initialized = False
        
        # Register built-in tools from handler
        self._register_tools()
    
    def _register_tools(self):
        """Register tools from the server handler"""
        # Look for methods with tool decorations in the handler
        if hasattr(self.handler, '_tools'):
            for tool_name, tool_info in self.handler._tools.items():
                self.tools[tool_name] = tool_info
    
    async def handle_message(self, message: str) -> Optional[str]:
        """Handle an incoming MCP message"""
        try:
            request = json.loads(message)
            
            # Validate JSON-RPC structure
            if not isinstance(request, dict) or "jsonrpc" not in request:
                return self._create_error_response(
                    None, ErrorCodes.INVALID_REQUEST, "Invalid JSON-RPC request"
                )
            
            if request["jsonrpc"] != "2.0":
                return self._create_error_response(
                    request.get("id"), ErrorCodes.INVALID_REQUEST, 
                    "Unsupported JSON-RPC version"
                )
            
            method = request.get("method")
            if not method:
                return self._create_error_response(
                    request.get("id"), ErrorCodes.INVALID_REQUEST, 
                    "Missing method field"
                )
            
            params = request.get("params", {})
            request_id = request.get("id")
            
            # Handle different MCP methods
            if method == "initialize":
                response = await self._handle_initialize(params)
                return self._create_success_response(request_id, response)
                
            elif method == "notifications/initialized":
                # This is a notification, no response needed
                self.initialized = True
                return None
                
            elif method == "tools/list":
                response = await self._handle_tools_list(params)
                return self._create_success_response(request_id, response)
                
            elif method == "tools/call":
                response = await self._handle_tools_call(params)
                return self._create_success_response(request_id, response)
                
            else:
                return self._create_error_response(
                    request_id, ErrorCodes.METHOD_NOT_FOUND, 
                    f"Method not found: {method}"
                )
                
        except json.JSONDecodeError:
            return self._create_error_response(
                None, ErrorCodes.PARSE_ERROR, "Parse error"
            )
        except Exception as e:
            logger.exception("Error handling MCP message")
            return self._create_error_response(
                request.get("id") if isinstance(request, dict) else None,
                ErrorCodes.INTERNAL_ERROR, str(e)
            )
    
    async def _handle_initialize(self, params: Dict) -> Dict:
        """Handle initialize request"""
        server_info = self.handler.get_info()

        return {
            "protocolVersion": ProtocolVersion.V_2024_11_05,
            "capabilities": {
                "tools": {},
                "prompts": {},
                "resources": {}
            },
            "serverInfo": {
                "name": server_info.server_info.name,
                "version": server_info.server_info.version
            },
            "instructions": getattr(server_info, 'instructions', None)
        }
    
    async def _handle_tools_list(self, params: Dict) -> Dict:
        """Handle tools/list request"""
        tools = []
        
        # Get tools from handler if it implements the tool interface
        if hasattr(self.handler, '_tools'):
            for tool_name, tool_info in self.handler._tools.items():
                tools.append({
                    "name": tool_name,
                    "description": tool_info.get("description", ""),
                    "inputSchema": tool_info.get("input_schema", {})
                })
        
        return {"tools": tools}
    
    async def _handle_tools_call(self, params: Dict) -> Dict:
        """Handle tools/call request"""
        tool_name = params.get("name")
        if not tool_name:
            raise JsonRpcError(ErrorCodes.INVALID_PARAMS, "Missing tool name")
        
        arguments = params.get("arguments", {})
        
        # Find and call the tool
        if hasattr(self.handler, '_tools') and tool_name in self.handler._tools:
            tool_info = self.handler._tools[tool_name]
            method = tool_info.get("method")
            
            if method:
                try:
                    # Call the tool method
                    result = await method(self.handler, **arguments)
                    
                    if isinstance(result, CallToolResult):
                        return {
                            "content": [asdict(c) for c in result.content],
                            "isError": result.is_error
                        }
                    else:
                        # Handle unexpected result format
                        return {
                            "content": [{"type": "text", "text": str(result)}],
                            "isError": False
                        }
                        
                except Exception as e:
                    logger.exception(f"Error calling tool {tool_name}")
                    return {
                        "content": [{"type": "text", "text": f"Error calling tool: {str(e)}"}],
                        "isError": True
                    }
        
        raise JsonRpcError(ErrorCodes.METHOD_NOT_FOUND, f"Tool not found: {tool_name}")
    
    def _create_success_response(self, request_id: Any, result: Any) -> str:
        """Create a successful JSON-RPC response"""
        response = {
            "jsonrpc": "2.0",
            "id": request_id,
            "result": result
        }
        return json.dumps(response)
    
    def _create_error_response(self, request_id: Any, code: int, message: str, data: Any = None) -> str:
        """Create an error JSON-RPC response"""
        error = {
            "code": code,
            "message": message
        }
        if data is not None:
            error["data"] = data
            
        response = {
            "jsonrpc": "2.0",
            "id": request_id,
            "error": error
        }
        return json.dumps(response)

class StdioTransport:
    """Stdio transport for MCP communication"""
    
    def __init__(self, server: McpServer):
        self.server = server
    
    async def start(self):
        """Start the stdio transport"""
        logger.info("Starting MCP server with stdio transport")
        
        try:
            while True:
                # Read line from stdin
                line = await asyncio.get_event_loop().run_in_executor(
                    None, sys.stdin.readline
                )
                
                if not line:  # EOF
                    break
                
                line = line.strip()
                if not line:
                    continue
                
                logger.debug(f"Received: {line}")
                
                # Handle the message
                response = await self.server.handle_message(line)
                
                if response:
                    logger.debug(f"Sending: {response}")
                    print(response, flush=True)
                    
        except KeyboardInterrupt:
            logger.info("Received interrupt, shutting down")
        except Exception:
            logger.exception("Error in stdio transport")

# Tool decorator functionality
class ToolRegistry:
    """Registry for MCP tools"""
    
    def __init__(self):
        self.tools = {}
    
    def register_tool(self, name: str, description: str, input_schema: Dict,
                     method: Callable):
        """Register a tool"""
        self.tools[name] = {
            "name": name,
            "description": description,
            "input_schema": input_schema,
            "method": method
        }

def python_type_to_json_type(py_type):
    """Maps Python types to JSON schema types."""
    if py_type is str:
        return "string"
    if py_type is int:
        return "integer"
    if py_type is float:
        return "number"
    if py_type is bool:
        return "boolean"
    if py_type is list or get_origin(py_type) is list:
        return "array"
    if py_type is dict or get_origin(py_type) is dict:
        return "object"
    if py_type is type(None): # For Optional[T]
        return "null"
    # Handle Optional[T] and Union types
    if get_origin(py_type) is Union:
        args = get_args(py_type)
        non_none_args = [arg for arg in args if arg is not type(None)]
        if len(non_none_args) == 1:
            return python_type_to_json_type(non_none_args[0])
        # For complex unions, default to object or string
        return "object" 
    return "string" # Default fallback for unknown types

def tool(name: str = None, description: str = ""):
    """Decorator for MCP tools"""
    def decorator(func):
        tool_name = name or func.__name__
        
        # Store tool metadata on the function
        func._tool_name = tool_name
        func._tool_description = description
        
        # Generate input schema from function signature
        signature = inspect.signature(func)
        properties = {}
        required = []
        
        # Skip 'self' parameter if it's a method
        params_to_inspect = list(signature.parameters.values())
        if params_to_inspect and params_to_inspect[0].name == 'self':
            params_to_inspect = params_to_inspect[1:]

        for param in params_to_inspect:
            param_name = param.name
            param_type = param.annotation
            
            prop_def = {"type": python_type_to_json_type(param_type)}
            
            # Determine if parameter is required
            is_optional = (get_origin(param_type) is Union and type(None) in get_args(param_type))
            if param.default is inspect.Parameter.empty and not is_optional:
                required.append(param_name)
            
            properties[param_name] = prop_def
        
        func._tool_input_schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": properties,
            "required": required,
            "title": f"{tool_name}_params"
        }
        
        return func
    return decorator

def tool_box(cls):
    """Class decorator for MCP tool boxes"""
    tools = {}
    
    # Find all methods with tool decorations
    for name, method in cls.__dict__.items():
        if hasattr(method, '_tool_name'):
            tools[method._tool_name] = {
                "name": method._tool_name,
                "description": method._tool_description,
                "input_schema": method._tool_input_schema,
                "method": method
            }
    
    # Store tools on the class
    cls._tools = tools
    
    return cls

class ServerHandler(ABC):
    """Base class for MCP server handlers"""
    
    @abstractmethod
    def get_info(self):
        """Get server info"""
        pass

# Implementation classes that mirror the Rust rmcp structure
@dataclass
class Implementation:
    """Server implementation info"""
    name: str
    version: str
    
    @classmethod
    def from_build_env(cls):
        """Create implementation info from build environment"""
        return cls(name="mcp-server-wazuh-python", version="0.2.4")

@dataclass  
class McpServerInfo:
    """Complete server information"""
    protocol_version: str
    capabilities: ServerCapabilities
    server_info: Implementation
    instructions: Optional[str] = None

# Utility functions for creating responses
def create_stdio_server(handler: ServerHandler) -> StdioTransport:
    """Create a stdio MCP server"""
    server = McpServer(handler)
    return StdioTransport(server)

async def serve_stdio(handler: ServerHandler):
    """Serve MCP over stdio"""
    transport = create_stdio_server(handler)
    await transport.start()
