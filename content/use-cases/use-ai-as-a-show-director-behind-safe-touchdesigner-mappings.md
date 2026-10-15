---
title: "Use AI as a show director behind safe TouchDesigner mappings"
slug: use-ai-as-a-show-director-behind-safe-touchdesigner-mappings
category: "Show Control"
tools: ["TouchDesigner", "tdmcp", "LLM"]
difficulty: Advanced
source_url: https://forum.derivative.ca/t/ai-controlled-parties-with-touchdesigner-tdmcp-concept-feedback-welcome/993426
labels: ["Experimental"]
summary: "A Derivative forum thread proposing an AI layer that picks pre-approved cues and moods. Hazardous effects stay operator-only, and changes go through dry runs and approval queues."
---

## What it does

A Derivative forum thread proposing an AI layer that picks pre-approved cues and moods. Hazardous effects stay operator-only, and changes go through dry runs and approval queues.

## How to set it up

1. Define a list of pre-approved cues and moods in TouchDesigner; this is all the AI may request.
2. Route AI output through a policy step: show intent, then a policy decision, then an approval queue or dry run.
3. Keep lasers, moving heads, blackout, PA and audio routing blocked or operator-only.
4. Rehearse with a simulated DMX output before connecting any real fixtures.

Source: [Derivative forum](https://forum.derivative.ca/t/ai-controlled-parties-with-touchdesigner-tdmcp-concept-feedback-welcome/993426)

## FAQ

### Is this a finished product?
No. It's a concept thread, and the related tdmcp docs call the implementation a rehearsal proof of concept.

### Who is it for?
Small clubs and parties without a pre-produced show, where an operator wants help adapting visuals live.
