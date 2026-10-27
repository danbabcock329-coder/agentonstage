---
title: "Talk to disguise Designer's REST API from an agent"
slug: talk-to-disguise-designer-s-rest-api-from-an-agent
category: "LED/Video"
tools: ["disguise", "REST", "MCP"]
difficulty: Advanced
source_url: https://github.com/medcelerate/disguise-mcp
summary: "An MCP service for disguise Designer's REST API. An assistant can drive timeline transport, read show state, and call Designer endpoints. MCP listens on port 8090."
---

## What it does

An MCP service for querying and controlling disguise Designer through its REST API.

## How to set it up

1. Install the single binary (PowerShell one-liner on the disguise server, or the install.sh / Releases on macOS/Linux).
2. Copy config.example.yaml to config.yaml and set the disguise host.
3. Run `disguise-mcp --config config.yaml`; MCP is served on port 8090 and an admin console on 8091.

Source project: [medcelerate/disguise-mcp](https://github.com/medcelerate/disguise-mcp)

## FAQ

### What can the agent do?
Drive the timeline transport, read show state and call any Designer API endpoint.

### Security?
It listens on 0.0.0.0 by default, so keep it on an isolated show network.
