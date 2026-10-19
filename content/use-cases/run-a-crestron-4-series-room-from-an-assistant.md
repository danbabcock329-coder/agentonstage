---
title: "Run a Crestron 4-Series room from an assistant"
slug: run-a-crestron-4-series-room-from-an-assistant
category: "Show Control"
tools: ["Crestron 4-Series", "MCP"]
difficulty: Intermediate
source_url: https://github.com/SolutionAVAutomation/mcp-for-crestron-client
labels: ["Commercial product"]
summary: "MCP for Crestron's free client connects an assistant to a licensed 4-Series processor so it can discover rooms and set, pulse or ramp the devices the program exposes."
---

## What it does

MCP for Crestron is a two-part product from Solution AV Automation. Modules on a Crestron 4-Series processor expose the AV system, and a free MCP client connects Claude Desktop or Claude Code to that processor over TCP. The client speaks a text protocol with a secure key and TLS. The assistant can discover rooms and devices, read state, set values, pulse digitals, ramp analog levels, and apply a scene as one call. The client repo's agent guide says the assistant operates what the installer exposed: it cannot add or remove devices, change wiring, or configure the processor.

The client is free and MIT-licensed. Control and query commands are refused until the processor is licensed or on a trial. The README lists one processor license at AUD $249 (inc GST), with three free one-week trials per processor. The license is stored on the processor and bound to its MAC. The project states it is not affiliated with or endorsed by Crestron.

## How to set it up

1. The processor has to be running the MCP for Crestron modules. The client README does not ship those modules. Licensing and the download linked from the repo are at https://solutionav.com.au/crestron-mcp/.
2. In Claude Desktop, install the `mcp-for-crestron.mcpb` from that page. Enter the processor address and the secure key shown on the MCP Server Config module's Key output. The port defaults to 50794.
3. From Claude Code or another host, `npx -y mcp-for-crestron` with `CRESTRON_HOST` and `CRESTRON_KEY` does the same job. `CRESTRON_KEY` is the recommended mode and turns on TLS. `CRESTRON_AUTH` is the password mode. Leaving both unset is open mode.
4. If the processor is unlicensed, the README says every tool returns guidance that includes the processor's MAC as its activation code. `start_crestron_trial` begins a free week when a trial is still available. `activate_crestron_license` takes a key you paste for that MAC.
5. Ask for a room discovery before the first level change. The tool list in the client README covers discovery, device queries, sets, pulses, ramps, room status and the license calls.

Source project: [SolutionAVAutomation/mcp-for-crestron-client](https://github.com/SolutionAVAutomation/mcp-for-crestron-client)

## FAQ

### Does the assistant replace the Crestron program?
No. The client is a natural-language layer in front of modules already loaded on the processor. The README's tool list has no call for editing the SIMPL program.

### Is the free client enough on its own?
No. The README says the processor must be running the MCP for Crestron modules, and that control calls need a license or an active trial. The secure key comes from the module's Key output.
