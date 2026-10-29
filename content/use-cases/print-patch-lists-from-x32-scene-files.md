---
title: "Print patch lists from X32 scene files"
slug: print-patch-lists-from-x32-scene-files
category: "Production Ops"
tools: ["Behringer X32"]
difficulty: Beginner
source_url: https://github.com/cstranex/x32-patch-list
summary: "Generates printable patch lists from an X32 scene file, a good input for agent-written show docs. The Flask app takes an uploaded scene file and prints the list."
---

## What it does

Generates printable patch lists from a scene file, a good input for agent-written show docs.

## How to set it up

1. Use the hosted version linked in the README, or run it yourself: `pip install -r requirements.txt`, then `python fe.py`.
2. Upload an X32 scene file.
3. Print the generated patch list.

Source project: [cstranex/x32-patch-list](https://github.com/cstranex/x32-patch-list)

## FAQ

### Dependencies?
Only Flask.

### Agent use?
An agent can produce the patch list as part of automated show docs.
