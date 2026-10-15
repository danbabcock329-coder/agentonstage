---
title: "Use QLab 5's OSC dictionary as an agent's control vocabulary"
slug: use-qlab-5-s-osc-dictionary-as-an-agent-s-control-vocabulary
category: "Show Control"
tools: ["QLab 5", "OSC"]
difficulty: Intermediate
source_url: https://qlab.app/docs/v5/scripting/osc-dictionary-v5/
summary: "Figure 53's official dictionary lists every OSC message QLab 5 accepts, so it's the reference an agent or script should use to target workspaces and cues."
---

## What it does

Figure 53's official dictionary lists every OSC message QLab 5 accepts, so it's the reference an agent or script should use to target workspaces and cues.

## How to set it up

1. Enable OSC access in QLab's workspace settings and set a passcode if you need one.
2. Use workspace-level messages like /go, /panic and /save, or address cues as /cue/{number}/{command}.
3. Paste the relevant dictionary sections into your agent's context or tool descriptions so it only sends documented messages.
4. Check each message's permissions (view, edit, control) before giving an agent write access.

Source: [Figure 53 QLab 5 documentation](https://qlab.app/docs/v5/scripting/osc-dictionary-v5/)

## FAQ

### How do I target a specific workspace?
Use /workspace/{id}/..., where {id} is the workspace's display name (e.g. hamlet.qlab5) or its unique ID.

### Why give this to an agent?
Agents work better with an authoritative command list than guessing OSC paths.
