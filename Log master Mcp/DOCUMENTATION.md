# Wazuh MCP Server - Python Implementation

## 🚀 Hackathon Project Documentation

### Project Overview

**Wazuh MCP Server** is a Python implementation that bridges **Wazuh SIEM** (Security Information and Event Management) systems with **MCP clients** (Model Context Protocol), enabling natural language queries for security monitoring and analysis.

Instead of complex API calls, users can now ask questions like:
- *"Show me critical security alerts from the last 24 hours"*
- *"What vulnerabilities exist on my web servers?"*
- *"Are all my agents reporting properly?"*
- *"Check cluster health and node status"*

The server transforms Wazuh API responses into MCP-compatible format for seamless AI integration, making security data accessible through conversational interfaces.

### 🏗️ Architecture & Design

#### System Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │◄──►│  Wazuh MCP       │◄──►│   Wazuh SIEM    │
│   (Claude,      │    │  Server          │    │   (Manager +    │
│    Cursor, etc.)│    │                  │    │    Indexer)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Environment    │
                       │   Variables      │
                       └──────────────────┘
```

#### Key Components

1. **MCP Protocol Layer** (`mcp_protocol.py`)
   - Implements Model Context Protocol specification
   - Handles tool registration and execution
   - Manages stdio transport for MCP communication

2. **Wazuh Client Library** (`wazuh_client.py`)
   - Python client for Wazuh Manager API
   - Indexer client for Elasticsearch/OpenSearch queries
   - Factory pattern for client creation
   - Comprehensive error handling and retry logic

3. **Tool Modules** (`src/tools/`)
   - **AgentTools**: Agent management and monitoring
   - **AlertTools**: Security alert retrieval and analysis
   - **RuleTools**: Security rule management
   - **VulnerabilityTools**: Vulnerability detection and reporting
   - **StatsTools**: System statistics and log analysis

### 🚀 Quick Start Guide

#### Prerequisites
- Python 3.8+
- Wazuh SIEM instance (Manager + Indexer)
- MCP-compatible client (Claude Desktop, Cursor, etc.)

#### Installation

1. **Clone and Setup**
```bash
git clone <repository-url>
cd wazuh-mcp-py
pip install -r requirements.txt
```

2. **Environment Configuration**
Create `.env` file with your Wazuh configuration:
```bash
# Wazuh Manager API Configuration
WAZUH_API_HOST=your-wazuh-manager-host
WAZUH_API_PORT=55000
WAZUH_API_USERNAME=your-username
WAZUH_API_PASSWORD=your-password

# Wazuh Indexer Configuration
WAZUH_INDEXER_HOST=your-indexer-host
WAZUH_INDEXER_PORT=9200
WAZUH_INDEXER_USERNAME=admin
WAZUH_INDEXER_PASSWORD=admin

# Optional: SSL and Protocol Settings
WAZUH_VERIFY_SSL=false
WAZUH_TEST_PROTOCOL=https
```

3. **MCP Client Configuration**
Add to your MCP client's configuration file (e.g., `claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "wazuh": {
      "command": "python",
      "args": ["/path/to/wazuh-mcp-py/main.py"]
    }
  }
}
```

4. **Launch**
```bash
python main.py
```

### 📚 Available Tools & API Reference

#### Agent Management Tools

**`get_wazuh_agents`**
- **Description**: Retrieve list of Wazuh agents with status and details
- **Parameters**:
  - `limit` (optional): Maximum agents to return (default: 300)
  - `status` (optional): Filter by status - "active", "disconnected", "pending", "never_connected" (default: "active")
  - `name` (optional): Filter by agent name
  - `ip` (optional): Filter by agent IP
  - `group` (optional): Filter by agent group
  - `os_platform` (optional): Filter by OS platform
  - `version` (optional): Filter by Wazuh version

**`get_wazuh_agent_processes`**
- **Description**: Get running processes for specific agent
- **Parameters**:
  - `agent_id` (required): Agent ID (e.g., "001", "002")
  - `limit` (optional): Maximum processes (default: 300)
  - `search` (optional): Filter by process name/command

**`get_wazuh_agent_ports`**
- **Description**: Get open network ports for specific agent
- **Parameters**:
  - `agent_id` (required): Agent ID
  - `limit` (optional): Maximum ports (default: 300)
  - `protocol` (optional): Filter by protocol ("tcp", "udp")
  - `state` (optional): Filter by state ("LISTEN", "ESTABLISHED")

#### Security Monitoring Tools

**`get_wazuh_alert_summary`**
- **Description**: Retrieve security alerts from Wazuh Indexer
- **Parameters**:
  - `limit` (optional): Maximum alerts (default: 100)

**`get_wazuh_rules_summary`**
- **Description**: Get security rules configuration
- **Parameters**:
  - `limit` (optional): Maximum rules (default: 300)
  - `level` (optional): Filter by rule level (0-15)
  - `group` (optional): Filter by rule group
  - `filename` (optional): Filter by rule filename

#### Vulnerability Management Tools

**`get_wazuh_vulnerability_summary`**
- **Description**: Get vulnerability detections for specific agent
- **Parameters**:
  - `agent_id` (required): Target agent ID
  - `limit` (optional): Maximum vulnerabilities (default: 300)
  - `severity` (optional): Filter by severity level
  - `cve` (optional): Filter by CVE ID

**`get_wazuh_critical_vulnerabilities`**
- **Description**: Get only critical vulnerabilities for specific agent
- **Parameters**:
  - `agent_id` (required): Target agent ID
  - `limit` (optional): Maximum vulnerabilities (default: 300)

#### System Monitoring Tools

**`get_wazuh_cluster_health`**
- **Description**: Check Wazuh cluster health status
- **Parameters**: None

**`get_wazuh_cluster_nodes`**
- **Description**: List cluster nodes with status
- **Parameters**:
  - `limit` (optional): Maximum nodes
  - `offset` (optional): Skip nodes
  - `node_type` (optional): Filter by node type

**`search_wazuh_manager_logs`**
- **Description**: Search Wazuh manager logs
- **Parameters**:
  - `limit` (optional): Maximum entries (default: 100)
  - `offset` (optional): Skip entries
  - `level` (optional): Filter by log level
  - `tag` (optional): Filter by log tag
  - `search_term` (optional): Free-text search

**`get_wazuh_manager_error_logs`**
- **Description**: Get manager error logs
- **Parameters**:
  - `limit` (optional): Maximum entries (default: 100)

### 💡 Usage Examples

#### Basic Agent Monitoring
```
"Show me all active agents"
"List agents that haven't reported in the last hour"
"Check if agent 001 is connected"
```

#### Security Alert Analysis
```
"Show me the latest security alerts"
"Find authentication failure alerts from today"
"Get alerts with severity level 10 or higher"
```

#### Vulnerability Assessment
```
"Check for critical vulnerabilities on web servers"
"Show me all CVEs detected on agent 002"
"List vulnerabilities by severity level"
```

#### System Health Monitoring
```
"Is the Wazuh cluster healthy?"
"Show me all cluster nodes and their status"
"Check for any error logs in the manager"
```

### 🔧 Configuration Options

#### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `WAZUH_API_HOST` | Wazuh Manager hostname/IP | `localhost` | Yes |
| `WAZUH_API_PORT` | Wazuh Manager API port | `55000` | No |
| `WAZUH_API_USERNAME` | API username | `wazuh` | Yes |
| `WAZUH_API_PASSWORD` | API password | `wazuh` | Yes |
| `WAZUH_INDEXER_HOST` | Indexer hostname/IP | `localhost` | Yes |
| `WAZUH_INDEXER_PORT` | Indexer port | `9200` | No |
| `WAZUH_INDEXER_USERNAME` | Indexer username | `admin` | Yes |
| `WAZUH_INDEXER_PASSWORD` | Indexer password | `admin` | Yes |
| `WAZUH_VERIFY_SSL` | Verify SSL certificates | `false` | No |
| `WAZUH_TEST_PROTOCOL` | Protocol (http/https) | `https` | No |

#### SSL/TLS Configuration

For production deployments with SSL:
```bash
WAZUH_VERIFY_SSL=true
WAZUH_API_HOST=secure-wazuh-manager.company.com
WAZUH_TEST_PROTOCOL=https
```

### 🛠️ Development Guide

#### Project Structure
```
wazuh-mcp-py/
├── main.py                 # Main MCP server entry point
├── mcp_protocol.py         # MCP protocol implementation
├── wazuh_client.py         # Wazuh API client library
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
├── DOCUMENTATION.md       # This file
├── README.md              # Project overview
└── src/
    └── tools/             # MCP tool implementations
        ├── __init__.py
        ├── agents.py      # Agent management tools
        ├── alerts.py      # Alert analysis tools
        ├── rules.py       # Security rules tools
        ├── stats.py       # Statistics & monitoring
        └── vulnerabilities.py # Vulnerability tools
```

#### Adding New Tools

1. **Create Tool Module** in `src/tools/`
```python
from . import ToolModule, Content, CallToolResult

class NewTools(ToolModule):
    async def new_tool_method(self, params: Dict[str, Any]) -> CallToolResult:
        # Implementation here
        return self.success_result([Content.text("Result")])
```

2. **Register in Main Server** (`main.py`)
```python
# Add to imports
from tools.new_tools import NewTools

# Add to WazuhToolsServer.__init__
self.new_tools = NewTools(client)

# Add tool method with @tool decorator
@tool(name="new_tool", description="Description")
async def new_tool(self, param: str) -> CallToolResult:
    return await self.new_tools.new_tool_method({"param": param})
```

#### Testing Tools

Test new tools using curl:
```bash
curl -X POST http://localhost:3000/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "tool_name", "parameters": {...}}'
```

### 🔒 Security Considerations

#### Authentication
- Uses Wazuh API token-based authentication
- Supports both HTTP and HTTPS protocols
- Configurable SSL certificate verification

#### Access Control
- Respects Wazuh RBAC (Role-Based Access Control)
- API credentials determine accessible resources
- No additional authentication layer added

#### Data Protection
- All API communications use HTTPS when configured
- No sensitive data logged in plain text
- Structured logging with configurable levels

### 📊 Performance & Scalability

#### Optimization Features
- **Connection Pooling**: Reuses HTTP connections
- **Async/Await**: Non-blocking I/O operations
- **Pagination Support**: Configurable result limits
- **Error Handling**: Graceful degradation on failures

#### Recommended Limits
- Agent queries: 100-500 agents per request
- Alert queries: 100-1000 alerts per request
- Log searches: 100-500 entries per request

### 🐛 Troubleshooting

#### Common Issues

**Connection Refused**
```bash
# Check if Wazuh services are running
sudo systemctl status wazuh-manager
sudo systemctl status wazuh-indexer

# Verify API credentials
curl -k -u username:password https://wazuh-manager:55000/
```

**SSL Certificate Errors**
```bash
# For self-signed certificates
WAZUH_VERIFY_SSL=false

# Or add CA to trusted store
WAZUH_VERIFY_SSL=true
```

**No Data Returned**
```bash
# Check agent status
python main.py  # Then query: "list active agents"

# Verify indexer has data
curl -k -u admin:admin https://indexer:9200/_cat/indices
```

#### Debug Mode
Enable detailed logging:
```bash
RUST_LOG=debug python main.py
```

### 🤝 Contributing

#### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Install development dependencies: `pip install -r requirements.txt`
4. Make changes and add tests
5. Submit pull request

#### Code Style
- Follow PEP 8 for Python code
- Use type hints for function parameters
- Add docstrings for all public methods
- Include error handling for API calls

#### Testing Checklist
- [ ] New tools have proper error handling
- [ ] API parameters are validated
- [ ] Authentication works correctly
- [ ] SSL/TLS configurations tested
- [ ] Performance tested with large datasets

### 📄 License & Credits

This project is part of the Wazuh ecosystem and follows the same licensing terms. Built with inspiration from the Rust implementation and designed for seamless integration with MCP-compatible AI assistants.

### 🏆 Hackathon Achievements

**Technical Innovation**
- ✅ Python implementation of MCP protocol
- ✅ Comprehensive Wazuh API integration
- ✅ Async/await architecture for performance
- ✅ Production-ready error handling

**User Experience**
- ✅ Natural language security queries
- ✅ Conversational AI integration
- ✅ Comprehensive tool coverage
- ✅ Easy configuration and deployment

**Code Quality**
- ✅ Modular architecture
- ✅ Extensive documentation
- ✅ Type hints and validation
- ✅ Structured logging

---

**Ready for Hackathon Submission! 🚀**

This Wazuh MCP Server provides a complete bridge between security monitoring systems and conversational AI, enabling users to interact with their SIEM infrastructure using natural language queries. The Python implementation offers the same powerful capabilities as the original Rust version while being more accessible to a broader developer audience.
