---
title: "grandMA3 toolkit with a verified knowledge corpus"
slug: grandma3-toolkit-with-a-verified-knowledge-corpus
category: "Lighting"
tools: ["grandMA3", "MCP"]
difficulty: Advanced
source_url: https://github.com/DD-cLD/The3-MCP
summary: "Built by a lighting director against a live console, pairing MA3 tooling with reference knowledge for agents."
---

## What it does

Built by a lighting director against a live console, pairing MA3 tooling with reference knowledge for agents.

## How to set it up

1. Without MCP: open concepts/INDEX.md and search it for terms like "timecode" or "import failed".
2. For agents: follow docs/AGENT_QUICKSTART.md to install the local MCP server (Python 3.12+) and run its offline protocol check.
3. Set up the console side per server/README.md, then register the server in Codex or Claude Desktop.

Source project: [DD-cLD/The3-MCP](https://github.com/DD-cLD/The3-MCP)

## FAQ

### What makes the corpus different?
Every console claim was observed on a live grandMA3 and version-stamped by a working lighting director.

### Can I reuse the skills?
Start with skills/ma3-assistant. The README warns that the show-specific skills need your own project data.
