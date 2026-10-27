---
title: "Cue CasparCG channels over AMCP"
slug: cue-casparcg-channels-over-amcp
category: "LED/Video"
tools: ["CasparCG", "AMCP"]
difficulty: Intermediate
source_url: https://casparcg.com/docs/wiki/protocols/amcp-protocol
summary: "CasparCG Server takes AMCP text on TCP 5250 in the sample config, so a client can list media, load a clip in the background, and play or clear a channel after VERSION and INFO."
---

## What it does

CasparCG Server's Advanced Media Control Protocol is a UTF-8 text protocol. The protocol page says every command ends with a carriage return and a line feed, the command string is case insensitive, and a parameter that contains a space has to be quoted. A quote inside a parameter is written `\"`.

The sample `casparcg.config` in the server repository puts an AMCP controller on TCP port 5250. That port is a setting in the file, so a show machine may not be on 5250. The protocol page opens with a note that all commands may not be valid for versions newer than 2.0.x. The `VERSION` example printed on that same page returns `2.1.0.f207a33 STABLE`. Read `VERSION` and `HELP PLAY` on the server in front of you before treating the wiki examples as the contract.

A success with no extra data is `202 [command] OK`. `201` returns one line of data. `200` returns several lines and a blank line after them. `402` is a missing parameter, `403` is an illegal parameter, and `404` is media file not found.

`CLS` lists files in the media folder: name, type (`STILL`, `MOVIE`, or `AUDIO`), size, modified time, frame count, and frame rate. `CINF` with a quoted name returns the same columns for one file, and the page says every match is returned if that name exists in more than one directory. `INFO` with no arguments lists channels. The printed example is `1 720p5000 PLAYING` and `2 PAL PLAYING`.

`LOADBG 1-1 MY_FILE` prepares a producer on channel 1, layer 1, and leaves it in the background. The page's transition names are `CUT`, `MIX`, `PUSH`, `WIPE`, and `SLIDE`, followed by a duration in frames. `LOOP` loops. `SEEK` and `LENGTH` are frame counts. `AUTO` starts that background clip when the foreground clip ends, and only one clip can be queued that way on a layer. `LOAD` puts a clip on the foreground, shows the first frame, and pauses. `PLAY` with no clip name moves the background clip to the foreground and runs a transition that was prepared with `LOADBG`. `PLAY` with a clip name loads that clip to the background first. `PAUSE` and `RESUME` hold and continue the foreground clip. `STOP` removes the foreground clip on that layer. `CLEAR 1` removes every layer on channel 1. `CLEAR 1-3` removes only layer 3.

`CG ADD` prepares a template. It stays hidden unless play-on-load is `1` or you send `CG PLAY`. `CG STOP` lets the template animate out. `CG INFO` reports the template layer.

## How to set it up

1. Install CasparCG Server and confirm the AMCP port in `casparcg.config`. The sample file in the [server repository](https://github.com/CasparCG/server/blob/master/src/shell/casparcg.config) uses TCP 5250 and the protocol name `AMCP`.
2. From a machine on that network, open a TCP connection and send `VERSION` followed by `\r\n`. Then send `INFO` and `CLS`. A `202`, `201`, or `200` is success. Anything in the 400 or 500 range is a failure.
3. Pick a name from `CLS` and send `LOADBG 1-1` plus that name. Send `PLAY 1-1` with no clip name to take the background to air. Send `INFO 1-1` before assuming the layer is the clip you wanted.
4. Leave `KILL` and `RESTART` out of the client's tool list. `KILL` shuts the server down. `RESTART` shuts it down with exit code 5 so `casparcg_auto_restart.bat` can bring it back. `BYE` disconnects a remote client, and the page says that on the server's own console it does the same thing as `KILL`.
5. `GL GC` releases pooled OpenGL resources and the page says it may pause every video channel. Keep that, and `CLEAR` of a whole channel, off an unattended session.

Source: [AMCP protocol](https://casparcg.com/docs/wiki/protocols/amcp-protocol) and the sample [casparcg.config](https://github.com/CasparCG/server/blob/master/src/shell/casparcg.config).

## FAQ

### Does the wiki match every current server?
The page says commands may not all be valid on versions newer than 2.0.x. Send `VERSION` and `HELP PLAY` to the server you have. The `VERSION` example on the page itself is a 2.1.0 build.

### Is 5250 always the port?
It is the port in the sample config. The `<port>` element is editable, so read the config on that machine.

### Will PLAY always cut?
`PLAY` runs a transition if one was stored with `LOADBG`. A bare `PLAY 1-1` takes the prepared background. `PLAY` with a clip name loads that clip first, which replaces a background clip that was already prepared.
