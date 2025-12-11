# Wazuh MCP Server - Python

A Python implementation that connects Wazuh SIEM to Claude Desktop via MCP (Model Context Protocol), enabling natural language queries for security data.

## What It Does

Instead of complex API calls, users can ask questions like:
- "Show me critical security alerts"
- "What vulnerabilities exist on my web servers?"
- "Are all agents healthy?"

The server transforms Wazuh API responses into MCP-compatible format for easy AI integration.

## Quick Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Create a `.env` file:
```bash
WAZUH_API_HOST=your-wazuh-server
WAZUH_API_PORT=55000
WAZUH_API_USERNAME=your-username
WAZUH_API_PASSWORD=your-password
WAZUH_INDEXER_HOST=your-indexer-server
WAZUH_INDEXER_PORT=9200
WAZUH_INDEXER_USERNAME=admin
WAZUH_INDEXER_PASSWORD=admin
```

### 3. Configure Claude Desktop
Add to `claude_desktop_config.json`:
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

### 4. Run
```bash
python main.py
```

## Features

Available MCP tools for Wazuh SIEM integration:
- **Alert Management** - Security alerts and events
- **Agent Management** - Monitor agent health and processes
- **Vulnerability Assessment** - Scan results and critical vulnerabilities
- **Rule Management** - Security rules and configuration
- **Statistics & Monitoring** - System metrics and log analysis

## Project Structure

```
wazuh-mcp-py/
├── main.py                 # Main MCP server
├── mcp_protocol.py         # MCP implementation
├── wazuh_client.py         # Wazuh API client
├── requirements.txt        # Dependencies
├── Dockerfile             # Container setup
└── src/tools/             # MCP tools
    ├── alerts.py
    ├── agents.py
    ├── rules.py
    ├── stats.py
    └── vulnerabilities.py
```
