---
title: "Patch and busk a Unilighter show from an AI assistant"
slug: patch-and-busk-a-unilighter-show-from-an-ai-assistant
category: "Lighting"
tools: ["Unilighter", "MCP", "Art-Net", "sACN"]
difficulty: Intermediate
source_url: https://unilighter.cc/info/docs/mcp
labels: ["Commercial product"]
summary: "Unilighter Desktop serves MCP only on 127.0.0.1:3847. With Pro, four tools patch fixtures, store scenes, and write a priority-100 manual look on the project that is open."
---

## What it does

Unilighter's MCP guide describes two ways an assistant reaches the console that is already open. Unilighter Desktop runs a Streamable HTTP server at `http://127.0.0.1:3847/mcp`. The guide says that socket binds only to IPv4 loopback and never to another interface. Every request needs the Bearer token stored for that install in `mcp-auth.json`. The web console does not open a socket. It registers the same tools with the browser through WebMCP, and only for an agent running in that browser. Both the local server and the full WebMCP tool set require an active Unilighter Pro subscription. Without Pro, or when nobody is signed in, WebMCP exposes `unilighter_help` alone, and that tool explains how to unlock the rest.

The guide keeps the surface to four tools. `unilighter_help` with no arguments lists modules. `{"path":"scenes"}` lists operations in that module, and `{"path":"scenes.create"}` returns the argument schema. `unilighter_invoke` runs one operation. The guide's example creates a scene named Warm Sunset Wash with `capture` true, `priority` 10, and `fadeTime` 1500. `unilighter_troubleshoot` returns repair steps when a call fails. `unilighter_feedback` records a documentation gap. Desktop also writes that note to `userData/mcp-feedback.jsonl`. The web console sends it to Unilighter instead.

The module table is the vocabulary. `devices.create` patches fixtures and can address a run of them automatically. `scenes.create` can capture the live look. `scenes.apply` and `scenes.unset` recall and release a static cue. `animations.create` takes `step` or `keyframe`, and `animations.play` / `animations.stop` run it. `universes.read` returns the 512 channel values for a universe plus the priority source that is winning each one. `device-control.set` writes a manual look at priority 100, and `device-control.release` clears it. `graphs.addNode` inherits the graph priority when `data.priority` is omitted. Supplying `data.priority`, including `0`, creates a custom override unless `data.customPriority` is set false. `context.navigate` and any `*.open` call ask the operator to confirm before the view changes. Cancel returns `user_declined`, and the guide says the agent stops instead of retrying. Tool calls use the same code path as a click in the app, and only one runs at a time. The desktop shell times a request out at 60 seconds.

A visual repair is separate from programming. `fixtures.previewVisualizer` checks a geometry patch and does not save it. `fixtures.updateVisualizer` writes it only with the `expectedRevision` from `fixtures.getVisualizer`. The guide says this does not need `fixtures.setChannels`, `devices.update`, scene playback, or live pan and tilt. Coordinates are local renderer meters with Y up. The spacing `0.22` in the guide's linear-layout example is an example, not a manufacturer measurement.

The web console cannot do Desktop's network output. The guide says an agent there cannot send Art-Net or sACN, use LAN remote control, or drive OSC control surfaces. USB DMX and MIDI still work if a person connects them in Setup. The agent cannot connect that hardware. `context.get` reports `host: "web"` and lists the features that are missing.

## How to set it up

1. Run Unilighter Desktop on a machine with an active Pro plan. The guide's prerequisites list Linux, macOS, and Windows. Open Settings, then Desktop, and turn on Enable local MCP server.
2. Use Copy agent prompt and paste it into the assistant, or point the client at `http://127.0.0.1:3847/mcp` with the Bearer token from that settings card. The guide's Cursor example puts the token in an `Authorization` header. Keep that token out of any file you commit or any chat you share.
3. Have the agent call `unilighter_help` before it writes. Read `context.get` or `universes.read` before `scenes.apply` or `device-control.set`. Those writes hit the open project immediately. Navigation still waits for the confirm dialog.
4. Restarting Desktop, reloading the console, or turning the server off ends the session. The guide says a later request with the old session returns HTTP 404, and the agent has to initialize again. Do not set a fixed `Mcp-Session-Id`. Clients that omit the header work only while one session exists. With more than one session those requests return HTTP 400.
5. On the web console, the switch is Settings, General, WebMCP. Expose tools to browser AI agents is on by default. The guide says this needs a recent Chrome and an agent in that browser. Signing out, or losing the sign-in token, removes the full tool set immediately.

Source: [Unilighter MCP guide](https://unilighter.cc/info/docs/mcp).

## FAQ

### Does the MCP port send Art-Net?
No. The guide says the server stays on `127.0.0.1` port 3847. Art-Net and sACN are output features of Unilighter Desktop, not of the MCP socket. The web console cannot send either.

### Will every change ask first?
Navigation and `*.open` raise a confirmation, and Cancel comes back as `user_declined`. The guide does not describe a confirm step for patch, scene, animation, or `device-control.set`. That last one is the priority-100 manual look.

### What happens to a leaked token?
The guide says the token is created per installation and required on every request. Turn the local server off, and do not paste the token into a shared chat or repository. The page stores it in `mcp-auth.json` and does not describe a separate rotate button.
