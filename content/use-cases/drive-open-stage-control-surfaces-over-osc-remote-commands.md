---
title: "Drive Open Stage Control surfaces over OSC remote commands"
slug: drive-open-stage-control-surfaces-over-osc-remote-commands
category: "Show Control"
tools: ["Open Stage Control", "OSC"]
difficulty: Intermediate
source_url: https://openstagecontrol.ammd.net/docs/remote-control/
summary: "Open Stage Control clients take OSC /SET, /GET, and session commands, so show control can move widgets and open a session file."
---

## What it does

Open Stage Control is an open-source control surface. Its introduction describes three pieces: a server that sends and receives OSC and MIDI and also serves the client, a launcher, and a client that is the page in the browser. Any compatible browser that opens the server's address becomes another client and can open and edit sessions.

Ordinary OSC that arrives updates every widget whose address and preArgs match. On top of that, each client answers a set of remote commands, which is how an assistant or a show-control system can press a virtual fader or button and swap session or state files without a Stream Deck on the table.

`/SET` with a widget id and a value, or with an address, that widget's preArgs, and a value, sets the widget as if someone had touched it. The remote-control page says this is likely to make the widget send its value. `/GET` with a target `ip:port` and an id, or a target, an address, and preArgs, sends the current value back to that target. `/GET/#` is the same query, and the reply uses the widget's own address instead of `/GET`.

State commands are `/STATE/GET`, `/STATE/SET`, `/STATE/STORE`, `/STATE/RECALL`, `/STATE/SEND`, `/STATE/OPEN`, and `/STATE/SAVE`. `/STATE/SET` takes a JSON string of widget-id and value pairs, and an optional boolean. The page says set that boolean to false to apply the state without making widgets send. `/STATE/STORE` and `/STATE/RECALL` use a temporary slot. `/STATE/OPEN` and `/STATE/SAVE` use a `path.state` file. `/STATE/SEND` makes every widget send its current value.

Session commands are `/SESSION/CREATE`, `/SESSION/OPEN`, and `/SESSION/SAVE`. Create starts an empty session and drops unsaved changes. Open and save take a `path.json`. If the path is left off `/SESSION/SAVE`, the page says the current session path is used.

`/EDIT` replaces widget properties from a JSON5 string and ignores the widget's lock. `/EDIT/MERGE` merges those properties into the widget's options. The same page also documents `/EDIT/UNDO`, `/EDIT/REDO`, and `/EDIT/GET`. `/NOTIFY` shows a notification, `/LOG` prints to the client console, `/TABS` opens tabs by id, and `/SCRIPT` runs code the way a script widget would. The page also lists `/RELOAD`.

The page's multi-client note is the catch. These commands are interpreted by each client connected to the server, so more than one client may reply. A custom module is how the docs say to address a single client.

## How to set it up

1. Install Open Stage Control, start the server, and open a client with a session loaded. The remote-control page applies to OSC messages that reach a connected client.
2. From the assistant or the show controller, send `/GET` to a widget id, with your listener's `ip:port` as the target, and confirm one reply comes back before you send `/SET`.
3. Move a fader or press a button with `/SET`, the widget id, and the new value. Expect the widget to transmit, because the page says a `/SET` is treated like a touch. Use `/STATE/SET` with the send flag false when you need to restore values without a burst of outgoing OSC.
4. Swap a layout with `/SESSION/OPEN` and the `path.json` of a session you have already saved. `/SESSION/CREATE` throws away unsaved edits. Use `/STATE/OPEN` and a `path.state` file when you only want widget values, not a different session.
5. If more than one browser is connected, assume every client will run the command and that `/GET` can return more than one reply. The remote-control page says a custom module is the way to target one client.

Source: [Open Stage Control remote control](https://openstagecontrol.ammd.net/docs/remote-control/) and the [introduction](https://openstagecontrol.ammd.net/docs/getting-started/introduction/).

## FAQ

### Will `/SET` also transmit the widget's OSC?
The remote-control page says `/SET` sets the value as if the widget had been used from the interface, and that this is likely to make it send its value. `/STATE/SET` can take a false send flag when the apply should stay local.

### What happens with two browsers open?
The page says each connected client interprets these commands, so there may be more than one reply. Targeting a single client is done with a custom module.

### Which commands change the file on disk?
`/SESSION/SAVE` writes `path.json`, or the current session path if you omit the path. `/STATE/SAVE` writes `path.state`. `/STATE/STORE` only fills the temporary slot. `/SESSION/CREATE` drops unsaved changes.
