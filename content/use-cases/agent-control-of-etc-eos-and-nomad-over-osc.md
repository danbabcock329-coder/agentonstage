---
title: "Agent control of ETC Eos and Nomad over OSC"
slug: agent-control-of-etc-eos-and-nomad-over-osc
category: "Lighting"
tools: ["ETC Eos", "OSC", "MCP"]
difficulty: Advanced
source_url: https://github.com/Nairolf138/Eos_MCP
summary: "An MCP server with a large Eos tool set so assistants can query and drive the console. Start read-only and strict, and run eos_readiness_check before programming or playback."
---

## What it does

An MCP server with a large Eos tool set so assistants can query and drive the console.

## How to set it up

1. Clone, `npm install`, and copy .env.example to .env.
2. On Eos or Nomad enable OSC RX and TX under Setup → System → Show Control → OSC, and match the ports in .env.
3. Start in observation mode: `EOS_READ_ONLY=true EOS_STRICT_MODE=true npm run start:dev`.
4. Run eos_readiness_check before any programming or playback.

Source project: [Nairolf138/Eos_MCP](https://github.com/Nairolf138/Eos_MCP)

## FAQ

### How safe is it?
It has read-only and strict modes, tool allow-list profiles and an audit log.

### What can it reach?
Over 100 tools: cues, channels, groups, palettes, effects, faders, patch, Magic Sheets and more.
