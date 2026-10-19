---
title: "Draft BrightSign player apps with BrightSign's documentation MCP"
slug: draft-brightsign-player-apps-with-brightsign-s-documentation-mcp
category: "LED/Video"
tools: ["BrightSign", "BSN.cloud", "MCP"]
difficulty: Intermediate
source_url: https://github.com/BrightDevelopers/BrightDev
summary: "BrightSign's BrightDeveloper MCP server feeds player and cloud docs to a coding assistant so it can draft BrightScript or HTML apps you then test on a real player."
---

## What it does

BrightDev is BrightSign's developer starting point, and the README's first install step is an MCP server written for coding assistants. It does not drive a player by itself. It gives Claude Code, Cursor, VS Code and other MCP clients the technical docs so they can draft BrightScript, HTML and JavaScript, or Node.js player code. The same README tells you the generated code will not be perfect: debug it, test it on BrightSign hardware, and check docs.brightsign.biz when an API name looks wrong.

The BrightDev README registers that server at `https://brightdeveloper.bsn.cloud/mcp`. docs.brightsign.biz/develop/brightdev says its pasted copy of the README may not be current and sends you to the GitHub file. An older setup guide in BrightDevelopers/technical-documentation still lists `https://brightdeveloper-mcp.bsn.cloud/mcp` and describes the server as access to BrightSign technical documentation, including player APIs, BrightSign Control and BrightScript. A plain GET to both hosts on 19 October 2026 was refused as an incomplete MCP request (one asked for a session id, the other for an event-stream Accept header), which is how a live Streamable HTTP endpoint answers when you do not open a session.

For someone who only needs presentations and player management, the technical-documentation README points at BrightAuthor:connected and BSN.cloud instead of this SDK.

## How to set it up

1. In Claude Code, add the server over HTTP with the command in the BrightDev README: `claude mcp add brightdeveloper-docs --transport http https://brightdeveloper.bsn.cloud/mcp`.
2. In Cursor or VS Code, add an HTTP MCP server named `brightdeveloper` with that same URL.
3. Ask for a player app and name the platform (BrightScript, HTML and JavaScript, or Node.js), the resolution, and whether the player is on Ethernet, Wi-Fi or both. The README's own prompt template also asks for local setup, trace logging and deploy steps.
4. Put the result on hardware before you trust it. The README's FAQ lists ways to find the player: boot with no storage so the IP is shown on screen, check the DHCP list, open Local DWS at `brightsign-<serial>.local` if it is enabled, run `ifconfig` on the serial shell, or look the player up in BrightAuthor:connected or BSN.cloud.
5. If Local DWS is off, the same FAQ says to enable it in a BrightAuthor:connected setup, from BrightScript or JavaScript, or from the serial shell with `registry write networking http_server 80`, then `registry flush` and `reboot`.

Source: [BrightDevelopers/BrightDev](https://github.com/BrightDevelopers/BrightDev)

## FAQ

### Will this change what is playing on the player?
No. This MCP server is a documentation source for the assistant. The README tells you to test generated code on a player, and it documents how to find that player and how to turn on Local DWS. It does not list player-control tools.

### Which URL should I add?
Use the one in the BrightDev README: `https://brightdeveloper.bsn.cloud/mcp`. If a client rejects it, the older setup guide still documents `https://brightdeveloper-mcp.bsn.cloud/mcp`.
