---
title: "Describe a visual and have an agent build a playable TD node network"
slug: describe-a-visual-and-have-an-agent-build-a-playable-td-node-network
category: "TouchDesigner"
tools: ["TouchDesigner", "MCP", "Claude/Cursor/Codex"]
difficulty: Beginner
source_url: https://github.com/Pantani/tdmcp
summary: "Type a description of the look you want and tdmcp has the assistant assemble a working node network you can perform with."
---

## What it does

Type a description of the look you want and tdmcp has the assistant assemble a working node network you can perform with.

## How to set it up

1. Follow the no-terminal install guide on pantani.github.io/tdmcp (the npm package is @dpantani/tdmcp).
2. Run the TouchDesigner bridge in your project so the MCP server can reach TD.
3. Start with the "Your first visual" guide: describe a look in plain language and let the agent build the network.
4. Borrow prompts from the Prompt cookbook and Recipe gallery once the basics work.

Source project: [Pantani/tdmcp](https://github.com/Pantani/tdmcp)

## FAQ

### Does it need coding?
No. The project is designed so you describe the visual and the agent builds the node network.

### Can it run shows?
The docs describe an "AI-Controlled Party" pattern, but it is a rehearsal proof of concept and keeps hazardous effects operator-only.
