---
title: "Play and record a Blackmagic HyperDeck over Ethernet"
slug: play-and-record-a-blackmagic-hyperdeck-over-ethernet
category: "LED/Video"
tools: ["Blackmagic HyperDeck"]
difficulty: Intermediate
source_url: https://documents.blackmagicdesign.com/DeveloperManuals/HyperDeckEthernetProtocol.pdf
summary: "HyperDeck recorders with Ethernet take text commands on TCP 9993, so a client can list clips, arm a play range, and start playback or record once remote control is enabled."
---

## What it does

Blackmagic's HyperDeck Ethernet Protocol, in the December 2024 developer note, covers HyperDeck Extreme, Shuttle, and Studio models that have a built-in Ethernet port. The deck listens on TCP port 9993. The protocol is line oriented. The server ends lines with CR LF. The client may end lines with LF or CR LF. A command is a name alone, or a name, a colon, and one or more `{parameter}: {value}` pairs. Pairs can share a line. The note's combined example is `play: clip id: 3 speed: 200 loop: true single clip: true`. Authenticate, slate edits, and NAS bookmark changes are multiline and finish with a blank line.

On connect, the deck sends `500 connection info` with the protocol version and the model name. If too many clients are already connected, the new one receives `120 connection failed` and is disconnected. A plain success is `200 ok`. Success replies that carry parameters use 201 through 299. Failures use 100 through 199. Unsolicited updates use 500 through 599. Timecodes in the syntax section are non-drop-frame `HH:MM:SS:FF`.

Remote control can be off. A state change while it is off returns `111 remote control disabled`. `remote: enable: true` turns remote control on for the deck. `remote: override: true` lets this TCP session control the deck anyway. The note says the override lasts only for this client and only while the connection stays open. `remote` with no parameters returns `210 remote info` with `enabled` and `override`.

`play` starts at the current timecode. By default the deck plays the rest of the timeline at 100 percent and then stops. `single clip: true` limits playback to the current clip. `loop: true` repeats past the end. `speed` is a percent from -5000 to 5000. `play: clip id: {n}` starts at that clip. The note's walkthrough sends `playrange set: clip id: 5 count: 7`, then `play`, which rolls clips 5 through 11 on a timeline view, and `playrange clear` removes the range. A range can also be two timecodes or two timeline frame positions. `goto` moves inside the timeline. The note says to send `play` rather than `goto` when playback should roll from the new position, and that a `goto` past either end clamps to the first or last clip.

`record` captures the current input. `record: name: {name}` names the clip. `stop` ends playback or recording. `preview: enable: true` switches to preview and stops playback. The note says playback cannot be entered while a record is in progress, so `stop` comes first. `clips get` lists the timeline, and removing a clip invalidates the clip ids that follow it. `disk list` lists the active disk, or another slot or device. `notify` turns asynchronous updates on. The protocol-details section says they start disabled, and a bare `notify` returns the state of transport, slot, remote, configuration, clips, disk, and the other switches. `commands` returns the supported set as XML for the firmware on that deck. Formatting is two steps: a `format` prepare that names the filesystem and volume, then `format: confirm:` with the token from that prepare. `quit` closes the session.

## How to set it up

1. Open TCP to the deck's IP on port 9993. Read the `500 connection info` block before sending a command. Send `help` or `commands` to see what this firmware implements.
2. Send `remote` and read `enabled`. If it is false, send `remote: enable: true`, or `remote: override: true` when only this session should take control.
3. Send `clips get` or `disk list` before you choose a clip id. After `clips remove`, treat the following ids as stale. The command table says that remove invalidates them.
4. To play a run of clips, send `playrange set: clip id: {n} count: {m}` and then `play`. Add `speed`, `loop`, or `single clip` on the play line when you need them. `playrange clear` restores the default range.
5. To record, send `record` or `record: name: {name}`. Send `stop` before a preview change or a playback change. Send `format: confirm:` with the prepare token only when you mean to erase that slot.

Source: [HyperDeck Ethernet Protocol, December 2024](https://documents.blackmagicdesign.com/DeveloperManuals/HyperDeckEthernetProtocol.pdf).

## FAQ

### Why does play return 111?
The protocol assigns 111 to remote control disabled. Send `remote: enable: true`, or `remote: override: true` on this connection. The note says the override ends when the connection closes.

### Are notifications on by default?
The protocol-details section says asynchronous notifications are disabled until a `notify` command turns them on. A `notify` query with no parameters returns each switch, including transport, slot, clips, and disk.
