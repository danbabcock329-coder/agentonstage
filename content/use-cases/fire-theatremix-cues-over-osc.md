---
title: "Fire TheatreMix cues over OSC"
slug: fire-theatremix-cues-over-osc
category: "Audio"
tools: ["TheatreMix", "OSC"]
difficulty: Intermediate
source_url: https://theatremix.com/features
labels: ["Commercial product"]
summary: "TheatreMix listens on UDP 32000. /go fires the next cue and /jump takes a cue number. /subscribe reports cue fires to at most five clients."
---

## What it does

TheatreMix's features page says the app keeps a cue list of DCA assignments and, when it is connected to a console, highlights the active cue in blue. Channels it controls that are not assigned to a DCA in a cue are muted. Cues stay in numerical order, so changing a number moves the cue. Double-clicking a cue number or its text jumps to that cue while a console is connected. If editing is unlocked, the jump is a double-click while holding Command or Ctrl.

The same page documents an OSC server for operators who want a master cue list in playback software, or hardware buttons for rehearsal edits such as a Stream Deck through Bitfocus Companion. The server accepts cue-fire requests and can notify up to five OSC clients of cue-fire events. It runs on UDP port 32000.

`/go` fires the next cue. `/back` fires the previous cue. `/jump` takes `{number}` as a string, an int32, or a float32. `/jump selected` jumps to the selected cue. `/unlock` and `/lock` open and close editing. `/select` takes the string `up`, `down`, or `current`. `/markcue` takes `current` or `selected`, plus an optional notes string. `/insertcue` inserts a cue after the selected cue. `/clonecue` clones the selected cue. `/deletecue` deletes it. `/recordoffsets` records level offsets into the current cue. `/cloneoffsets` clones level offsets from the previous cue. `/undo` and `/redo` walk those edits.

`/togglebackup` takes `{channel}` as an int32 or a string, and the page says to prefix aux inputs with A. `/allocatespare` uses the same channel form. `/togglespare` toggles the spare backup. `/removespare` removes that allocation.

`/theatremix` asks for session information. TheatreMix replies with `/theatremix`, then `{version}` as a string, then `{show name}` as an optional string that is omitted when no show file is open. `/thump` is the heartbeat, and the reply is `/thump`. `/subscribe` subscribes to events. On success the reply is `/subscribeok` and `{expires}`, an int32 count of seconds. The page says the client should renew at half that interval. `/subscribefail` means the maximum number of clients is already subscribed. After a subscription, `/cuefired` carries `{number}` and `{text}` as strings, and an optional colour string of red, yellow, green, blue, or purple, omitted when the cue has no colour. `/ganglr` is `on` or `off`: the page says minus infinity is off, and any other LR fader gang level is on. `/recordoffsets` as a status message is also `on` or `off`.

## How to set it up

1. Open a show and connect TheatreMix to the console before treating `/go` as a live DCA change. The cue-list section says the active cue is highlighted in blue only while a console is connected.
2. Send OSC to the TheatreMix machine on UDP port 32000. Start with `/theatremix` and check that the reply includes a version string.
3. Send `/subscribe`. Renew when half of the `{expires}` interval has passed. `/subscribefail` means the maximum number of clients is already subscribed. The page caps notifications at five clients.
4. Fire with `/go`, `/back`, or `/jump` and a cue number. Read `/cuefired` if you subscribed, and do not assume the number is an integer. The page types it as a string.
5. Leave `/unlock`, `/deletecue`, `/insertcue`, and `/removespare` off an unattended button. Those edit the open show.

Source: [TheatreMix features](https://theatremix.com/features).

## FAQ

### What does /go change on the console?
The OSC section says `/go` fires the next cue. The cue-list section says each cue holds DCA assignments, and that controlled channels left off a DCA in that cue are muted. The page does not print the console OSC that TheatreMix sends onward.

### How do I hear cue fires without polling?
Send `/subscribe`. The page says the server notifies up to five clients. `/subscribeok` includes an expiry in seconds, and the client should renew at half of that. `/cuefired` then carries the cue number, the cue text, and a colour only when one is set.

### Can the same page drive REAPER?
Yes, as a separate link, and the page says it needs REAPER 6 or higher. In REAPER preferences, Control/OSC/web, add an OSC control surface named TheatreMix, pattern config Default, mode "Configure device IP+local port", device port 32101, local listen port 32102, and the device IP of the TheatreMix computer. Put REAPER's local IP into TheatreMix show setup. On one computer, use 127.0.0.1 in both places. While REAPER is recording, TheatreMix places a marker the first time a cue is fired and does not move that marker if the cue fires again. While REAPER is stopped, firing a cue jumps the playhead to that marker. TheatreMix takes no action while REAPER is playing or paused.
