---
title: "Control ProPresenter 7 from an AI assistant"
slug: control-propresenter-7-from-an-ai-assistant
category: "Show Control"
tools: ["ProPresenter 7", "MCP", "Claude Desktop"]
difficulty: Intermediate
source_url: https://github.com/alxpark/propresenter-mcp
summary: "An MCP server that wraps ProPresenter 7's network API so an assistant can fire slides, playlists, timers, stage messages, looks and macros by name."
---

## What it does

An MCP server that wraps ProPresenter 7's network API so an assistant can fire slides, playlists, timers, stage messages, looks and macros by name. The README says it covers the full API, 231 endpoints in 27 groups, so it reaches almost everything a ProPresenter operator touches: presentations, announcements, audio and media playlists, props, masks, themes, capture and the stage display.

It's useful for churches, corporate sessions and conferences where one operator runs lyrics or slides alongside other gear. You can ask "what's on screen right now?", "start the sermon countdown" or "put 'five minutes' on the stage display" instead of hunting through menus.

## How to set it up

1. In ProPresenter 7, open Preferences, go to the Network tab, enable Network and note the port (50000 by default). Set an API password if you want one.
2. Install Node.js 18 or newer, then clone the repo and run `npm install` and `npm run build`.
3. Add the server to your MCP client's config, pointing `PROPRESENTER_URL` at the ProPresenter machine and setting `PROPRESENTER_PASSWORD` if you used one.
4. Start with read-only questions (status, active presentation, current slide) before you let it trigger anything on a live screen.

Source project: [alxpark/propresenter-mcp](https://github.com/alxpark/propresenter-mcp)

## FAQ

### Which ProPresenter versions does it support?
ProPresenter 7, with the network API turned on.

### Is it listed anywhere official?
Yes. The README links to its entry in the official MCP Registry.

### Can it start a recording or stream?
The capture tools can check status, start and stop capture, and list encodings such as RTMP.
