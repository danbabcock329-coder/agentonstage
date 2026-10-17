---
title: "Inspect and control a Q-SYS Core from an AI agent"
slug: inspect-and-control-a-q-sys-core-from-an-ai-agent
category: "Audio"
tools: ["Q-SYS", "QRC", "MCP"]
difficulty: Intermediate
source_url: https://github.com/reowens/qsys-tools/tree/main/packages/qsys-mcp
labels: ["Experimental"]
summary: "qsys-mcp speaks Q-SYS QRC so an agent can read meters, set gains and mutes, recall snapshots and watch controls on a Core or on Q-SYS Designer's emulator."
---

## What it does

qsys-mcp speaks Q-SYS QRC so an agent can read meters, set gains and mutes, recall snapshots and watch controls on a Core or on Q-SYS Designer's emulator.

## How to set it up

1. Add `npx -y qsys-mcp` to your MCP client (Node.js 18 or newer). The package name is `qsys-mcp` as of 0.3.0; the old name `q-sys-mcp` was unpublished. The MCP Registry id in the README is `io.github.reowens/qsys-mcp`.
2. Call `qsys_connect` before anything else. QRC listens on port 1710. For Designer, open a design and press F6 (Save to Design & Run), then connect to `127.0.0.1`. F5 deploys to a physical Core.
3. A component stays invisible to these tools until it has a Code Name and Script Access set to External or All. The README says the Designer default is None.
4. Writes to a live Core, or when engine status is unknown, are refused unless that connect used `allow_live_writes: true`. Permitted live writes still carry a warning.

Source project: [reowens/qsys-tools packages/qsys-mcp](https://github.com/reowens/qsys-tools/tree/main/packages/qsys-mcp)

## FAQ

### Is it a QSC product?
No. The README calls it an independent client, not affiliated with or endorsed by QSC, and says it ships no QSC code.

### Has it run on a physical Core?
The README says the tests so far run against Designer's emulator, and that a physical Core run is what would move the project to 1.0.0. It lists 25 tools, including mixer crosspoints, Loop Player transport, snapshots and change groups.
