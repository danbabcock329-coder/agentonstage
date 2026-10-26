---
title: "Author a Chataigne show from an assistant over MCP"
slug: author-a-chataigne-show-from-an-assistant-over-mcp
category: "Show Control"
tools: ["Chataigne", "MCP", "Claude Code"]
difficulty: Advanced
source_url: https://benjamin.kuperberg.fr/chataigne/releases/changelog.html
labels: ["Experimental"]
summary: "Chataigne 1.10.5b5 adds opt-in MCP connections and a dockable assistant so Claude Code or Codex can author modules, states, presets, and timeline content, then control playback."
---

## What it does

Chataigne is Benjamin Kuperberg's show-control hub for linear shows and realtime installations. The README describes it as the conductor between protocols and software, not a player by itself. Protocols listed there include OSC, OSCQuery, MIDI, DMX (Enttec Open DMX, DMX Pro, and DMX-MkII, plus Art-Net and sACN/E1.31), serial, UDP, TCP, HTTP, MQTT, WebSockets, PJLink, Ableton Link, and PosiStageNet. Premade modules include Resolume, MadMapper, Millumin, TouchDesigner, Unity, QLab, HeavyM, D::Light, Reaper, Ableton Live through a Max for Live patch, PowerPoint, and WATCHOUT. Community modules on that list include EOS-OSC, OBS, a d&b DS100 module, Blackmagic ATEM-OSC, and a Midas M32 module.

The MCP notes are in the changelog under 1.10.5b5. Connections are opt-in, with per-client access controls, a native bridge, and client bundles for Codex, Claude Code, and other MCP clients. That version adds project discovery, diagnostics, observations, and undoable authoring for modules, states, custom variables, presets, and timeline content, plus playback and command controls. The same notes add a dockable assistant preview: ChatGPT plan sign-in, or an installed Claude Code account. Each provider keeps its own settings and conversation history. The assistant can be steered during a request, can queue follow-ups, can save a progress summary, and has Resume unfinished. Later headings on the changelog page I opened (1.10.5b6, b7, and b9) are fixes and do not withdraw the MCP notes. 1.10.5b5 also fixed scoped target bindings for custom-variable groups and presets, and added resolved-target inspection so an authored connection can be checked after it is written.

## How to set it up

1. The README says compiled builds for Windows, macOS, and Linux are at the [download section](https://benjamin.kuperberg.fr/chataigne/#download), and that beta versions show on that page when they are available. The MCP notes start at 1.10.5b5, so a stable build from before that series will not have them.
2. Treat the connection as opt-in. The changelog describes per-client access controls, a native bridge, and client bundles for Codex, Claude Code, and other MCP clients. Use the bundle that matches the client instead of guessing a port.
3. The dockable assistant preview signs in with a ChatGPT plan or uses an installed Claude Code account. The changelog says each provider keeps its own settings and conversation history.
4. Ask for discovery or diagnostics before authoring. Authoring covers modules, states, custom variables, presets, and timeline content, and the changelog calls that authoring undoable. Playback and command controls are listed separately.
5. Use resolved-target inspection after an edit that binds a custom-variable group or a preset. Keep the first session off a show that is in front of an audience. This is a beta series.

Source: [Chataigne changelog](https://benjamin.kuperberg.fr/chataigne/releases/changelog.html) and the [project README](https://github.com/benkuper/Chataigne/blob/master/README.md).

## FAQ

### Is the MCP in a numbered stable release?
The notes sit under 1.10.5b5. The README says beta builds appear on the download page when they are available. The later 1.10.5 beta headings on the changelog do not describe a stable 1.10.5 release.

### Does the MCP client speak DMX or OSC by itself?
The changelog's MCP surface is the Chataigne project: discovery, diagnostics, observations, undoable authoring, playback, and command controls. OSC, MIDI, DMX, and the other protocols are what Chataigne modules speak once those modules are in the project.

### Do ChatGPT and Claude Code share one transcript?
No. The changelog says each provider keeps its own settings and conversation history.
