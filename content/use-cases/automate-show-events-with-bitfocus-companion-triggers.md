---
title: "Automate show events with Bitfocus Companion triggers"
slug: automate-show-events-with-bitfocus-companion-triggers
category: "Show Control"
tools: ["Bitfocus Companion"]
difficulty: Beginner
source_url: https://companion.free/user-guide/v4.1/config/triggers/
summary: "Companion triggers run any button action automatically when an event happens, such as a time interval, a variable change or startup. They're the simplest automation layer to put under an agent."
---

## What it does

Companion triggers run any button action automatically when an event happens, such as a time interval, a variable change or startup. They're the simplest automation layer to put under an agent.

## How to set it up

1. Open the Triggers tab and click Add Trigger (new triggers start disabled).
2. Add Events such as Time interval or On variable change; any one event fires the trigger.
3. Add a Condition to filter, e.g. only when a variable equals 1.
4. Add Actions (anything a button can do, including pressing another button) and enable it.

Source: [Bitfocus Companion user guide](https://companion.free/user-guide/v4.1/config/triggers/)

## FAQ

### Are multiple events AND or OR?
OR: any event runs the trigger. Put AND logic in the Condition.

### How does this help AI workflows?
An agent can set a Companion variable or press a button, and tested triggers handle the rest.
