---
title: "Build an Ontime rundown with an agent that cannot run the timers"
slug: build-an-ontime-rundown-with-an-agent-that-cannot-run-the-timers
category: "Production Ops"
tools: ["Ontime", "MCP"]
difficulty: Intermediate
source_url: https://docs.getontime.no/features/mcp-server/
summary: "Ontime's MCP server turns an agenda, email, script or spreadsheet into a rundown and can flag gaps, overlaps and automation risks, while timer transport stays with the operator."
---

## What it does

Ontime, the open-source rundown and show timer, exposes an MCP server over Streamable HTTP. The docs say a connected agent is meant to build and maintain the rundown, starting from unstructured material: a pasted agenda, an email, a script or a spreadsheet. It is guided to follow Ontime's own habits, including grouping, colours, cue names, and keeping technical detail in custom fields so it stays out of the titles.

From there the agent can keep editing. The docs list creating and grouping events, filling custom fields, reordering entries, and flagging schedule gaps, overlaps or automation risks. Ontime 4.10.0, released 1 July 2026, is the version that added the server. The release note says the agent should manage projects, rundowns and custom fields, and that it is instructed to leave runtime alone.

The docs draw the same line in operational language: the MCP server has no transport controls. Starting, stopping and advancing the timers stays with the operator, which is what makes the server usable while a show file is being planned. A plain browser GET to `/mcp` returns 405 Method Not Allowed, and the docs say that response is expected.

## How to set it up

1. Run Ontime 4.10.0 or newer. In the editor, open Settings, then MCP Server, and copy the client configuration snippet into your agent with the other MCP servers.
2. The local endpoint in the docs is `http://localhost:4001/mcp`. If Ontime is on another host or port, use that address. The docs also show a cloud endpoint on `cloud.getontime.no`. The settings snippet is the URL to trust for the project you have open.
3. With no session password, the docs say the MCP endpoint needs no authentication. With a password, the snippet carries a pre-signed token in the query string. Clients that can set headers can send that same token as `Authorization: Bearer`. The raw session password is rejected. It is the same token Ontime already uses on authenticated share URLs.
4. Connect with a client that speaks Streamable HTTP and POSTs to `/mcp`. Use the agent to draft or tidy the rundown, and fire the timers from Ontime itself.

Source: [Ontime MCP server docs](https://docs.getontime.no/features/mcp-server/) and the [4.10.0 release](https://github.com/cpvalente/ontime/releases/tag/v4.10.0).

## FAQ

### Can the agent roll a cue or start the show timer?
The docs say it has no transport controls, so start, stop and advance stay outside the tool list. The 4.10.0 release describes the same boundary as an instruction to avoid runtime changes. Plan with the agent, and run the show from Ontime's own controls.

### What does a 405 mean?
A browser GET to `/mcp` returns 405 Method Not Allowed. Ontime's docs say that is the expected response, and that a real client initializes the server with MCP requests.

### Where do I get the token?
If the project has a session password, Settings, then MCP Server, copies a snippet whose URL already includes the pre-signed token. You can also send that token as a bearer header. Ontime does not accept the password itself as the bearer value.
