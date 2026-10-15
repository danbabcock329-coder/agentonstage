---
title: "Proxy X32 control over UDP and WebSockets for web tools and agents"
slug: proxy-x32-control-over-udp-and-websockets-for-web-tools-and-agents
category: "Audio"
tools: ["Behringer X32", "WebSocket", "UDP"]
difficulty: Intermediate
source_url: https://github.com/audiopump/x32-proxy
summary: "Relays console traffic so browser apps or remote agents can talk to an X32 without direct UDP access."
---

## What it does

Relays console traffic so browser apps or remote agents can talk to an X32 without direct UDP access.

## How to set it up

1. Install Node.js, then `npm install -g x32-proxy`.
2. Run `x32-proxy --udp <bind address> --target <mixer IP>`, for example bound to a VPN interface.
3. Point X32 Edit, a web app (WebSocket mode) or an agent tool at the proxy instead of the console.

Source project: [audiopump/x32-proxy](https://github.com/audiopump/x32-proxy)

## FAQ

### Which mixers?
X32/M32 series and X-Air/MR series (XR12, XR16, XR18, MR18 and others).

### Why use it?
For control over a VPN or IPv6, or from browser apps via WebSockets.
