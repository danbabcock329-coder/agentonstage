---
title: "Generate console-aware cue lists with AI"
slug: generate-console-aware-cue-lists-with-ai
category: "Production Ops"
tools: ["Eos", "MA2/MA3", "AI"]
difficulty: Beginner
source_url: https://github.com/tannerharris0n/cue-list-generator
summary: "An open-source AI cue list generator that formats output for specific lighting console families."
---

## What it does

An open-source AI cue list generator that formats output for specific lighting console families.

## How to set it up

1. `npm install`, then run `npm run dev` and `node server.cjs` (or `npm run build` for production).
2. Set ANTHROPIC_API_KEY, or let users bring their own key; use AUTH_PASSWORD to gate access.
3. Enter the event timeline, rig description and look intent to get a starter cue stack.

Source project: [tannerharris0n/cue-list-generator](https://github.com/tannerharris0n/cue-list-generator)

## FAQ

### Which consoles?
Eos, MA2/MA3, Avolites, Hog 4, ChamSys and Onyx numbering conventions.

### Is it final programming?
No. It's a starter stack for a designer to refine.
