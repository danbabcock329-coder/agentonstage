---
title: "Expose Stream Deck actions to AI assistants with Elgato's MCP server"
slug: expose-stream-deck-actions-to-ai-assistants-with-elgato-s-mcp-server
category: "Show Control"
tools: ["Elgato Stream Deck 7.4+", "MCP", "Claude Desktop"]
difficulty: Beginner
source_url: https://www.elgato.com/us/en/explorer/products/stream-deck/sd-mcp-setup/
summary: "Stream Deck 7.4 adds MCP support. Actions you put on a dedicated MCP Actions profile become tools that Claude Desktop or other AI clients can trigger."
---

## What it does

Stream Deck 7.4 adds MCP support. Actions you put on a dedicated MCP Actions profile become tools that Claude Desktop or other AI clients can trigger.

## How to set it up

1. In Stream Deck go to Preferences → General and enable MCP Deck. This creates the MCP Actions profile.
2. Drag only the actions you want the AI to reach onto that profile, and give each one a description.
3. Install Node.js, then add `npx --yes @elgato/mcp-server@latest` under mcpServers in claude_desktop_config.json.
4. Fully quit and reopen Claude, then check Settings → Developer shows elgato running.

Source: [Elgato vendor guide](https://www.elgato.com/us/en/explorer/products/stream-deck/sd-mcp-setup/)

## FAQ

### Can the AI see all my profiles?
No. Only actions on the MCP Actions profile are exposed.

### Does it work over HTTP?
Yes. `npx -y @elgato/mcp-server@latest --http` serves it on a local port for tools like G-Assist.
