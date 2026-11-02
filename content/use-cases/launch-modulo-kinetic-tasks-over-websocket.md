---
title: "Launch Modulo Kinetic tasks over WebSocket"
slug: launch-modulo-kinetic-tasks-over-websocket
category: "LED/Video"
tools: ["Modulo Kinetic", "WebSocket", "JSON-RPC"]
difficulty: Intermediate
source_url: https://support.modulo-pi.com/modulo-kinetic-manual/v6/en/topic/websocket-external-control-protocol
labels: ["Commercial product"]
summary: "Modulo Kinetic Designer can host a JSON-RPC WebSocket. An assistant lists tasks, enables one by UUID, and launches it with doaction.task."
---

## What it does

Modulo Kinetic Designer can act as a WebSocket server that speaks JSON-RPC 2.0. The V6 manual puts the switch in the Project menu: Project settings, then the external control tab. Turn on WebSocket server enable, pick the port, and turn on SSL there if you want it. The manual's test client is a browser WebSocket extension pointed at that port.

The first documented call lists every task:

`{"jsonrpc":"2.0","method":"get.list.tasks","id": 1}`

The example result is an array. Each item has `keyword`, `name`, `objectType` (`task`), `taskEnable`, `triggerEnable`, `uiColor`, and `uuid`. One sample row is named Task6 with uuid `{45c8566e-435d-4abb-ad3a-2800cb1ce1c5}`. The manual also lists a `triggered` property on the task page, meaning the task was recently launched.

`get.object.task` returns one task. Pass `uuid`, or pass `name`. The manual says a name lookup returns the first task when several share that name. `set.property.task` writes `keyword`, `name`, `taskEnable`, `triggerEnable`, or `uiColor`. The example turns a task on:

`{"jsonrpc":"2.0","method":"set.property.task", "params":{"uuid":"{45c8566e-435d-4abb-ad3a-2800cb1ce1c5}","property":"taskEnable","value":true}}`

`doaction.task` runs an action on that task. The manual says the `launch` action triggers it:

`{"jsonrpc":"2.0","method":"doaction.task", "params":{"uuid":"{45c8566e-435d-4abb-ad3a-2800cb1ce1c5}","action":"launch"}}`

That is the control surface the manual prints on the task page. The intro page says the rest of the commands are on the following pages, so an assistant should list tasks and launch the ones already built in the show, rather than invent method names. A task in Kinetic is the show's own action: the cue, the timeline start, the vnode online, whatever that task was programmed to do.

## How to set it up

1. On the Designer machine, open the Project menu, then Project settings, then the external control tab. Enable the WebSocket server and set the port. Enable SSL only if the client is going to use it.
2. Connect a WebSocket client to `ws://<designer-ip>:<port>` (or `wss://` when SSL is on). Send `{"jsonrpc":"2.0","method":"get.list.tasks","id": 1}` and keep the `uuid` and `name` of the task you mean to fire.
3. If `taskEnable` is false, send `set.property.task` with that uuid, `"property":"taskEnable"`, and `"value":true`. If two tasks share a name, look up by uuid. The manual says a name lookup returns the first match.
4. Launch with `doaction.task`, the same uuid, and `"action":"launch"`. Confirm on the Designer UI that the task shows as triggered before you depend on it in a show.
5. Leave transport, vnode power, and file commands inside tasks you have already reviewed. The task page documents launch, not a general "play any timeline" method.

Source: [Modulo Kinetic V6 WebSocket external control](https://support.modulo-pi.com/modulo-kinetic-manual/v6/en/topic/websocket-external-control-protocol) and the [task methods](https://support.modulo-pi.com/modulo-kinetic-manual/v6/en/topic/websocket-tasks).

## FAQ

### Can the assistant address a task by name?
Yes. `get.object.task` accepts `name` or `uuid`. The manual says that if several tasks share a name, the name lookup returns the first one. Launch with the uuid from that object.

### Does launch also enable the task?
The manual lists them as separate calls. `set.property.task` with `taskEnable` changes whether the task is enabled. `doaction.task` with `launch` triggers it. Enable it first when `taskEnable` comes back false.

### Is there one method that plays a timeline by name?
Not on the task page. That page's action is `launch` on a task uuid. Build the timeline play into a task in Designer, list the tasks, and launch that task.
