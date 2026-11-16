---
title: "Start a Falcon Player playlist over MQTT"
slug: start-a-falcon-player-playlist-over-mqtt
category: "Lighting"
tools: ["Falcon Player", "MQTT"]
difficulty: Intermediate
source_url: https://github.com/FalconChristmas/fpp/blob/master/docs/MQTT.md
summary: "FPP listens on falcon/player/{hostname}/set/playlist/{name}/start and ignores the payload. Except for start, playlist topics hit the one already running."
---

## What it does

Falcon Player's MQTT document says FPP publishes status and subscribes to command topics when MQTT is configured. The topic form is `{optional prefix}/falcon/player/{hostname}/{sub_topic}`. The prefix is set in advanced settings. The hostname is set on the Network Settings tab, and the document says it should be different for each FPP device on the network. The subscribe examples use no prefix and the hostname `FPP`, as in `falcon/player/FPP/#`.

Published playlist topics include `/status` (`idle` or `playing`), `/playlist/name/status` (the current playlist name, or `{null}`), `/playlist/repeat/status` (0 when the current playlist is not repeating, 1 when it is), and `/playlist/section/status` (`New`, `LeadIn`, `MainPlayList`, `LeadOut`, or `{null}` when nothing is playing). `/ready` is 1 when fppd starts and 0 when fppd goes down, with last will set to 0. `/command/run` is JSON with the command name and an arguments array. The document's example is a `Start Playlist` command whose `args` are `MyPlaylist` and `true`.

FPP listens for playlist topics under `set/playlist/`. `set/playlist/${PLAYLISTNAME}/start` starts the playlist of that name, and the payload is ignored. The document says `${PLAYLIST}` is ignored for every playlist topic except `/start`, and that those other topics affect the playlist that is already running. `next` and `prev` force the next or previous item, payload ignored. `repeat` takes a payload of 0 or 1. `startPosition` sets the zero-based item to play next and does not stop the current item. `stop/now` stops immediately. `stop/graceful` stops gracefully. `stop/afterloop` lets the current loop finish.

`set/playlist/ALLPLAYLISTS/stop/now` stops every running playlist immediately. `stop/graceful` on that same path stops them gracefully. The all-playlists after-loop topic is printed in the document with a trailing period: `set/playlist/ALLPLAYLISTS/stop/afterloop.` The per-playlist `stop/afterloop` topic is printed without that period.

`set/command/${command}` runs that command, and the document says any payload is passed as if it were a REST API call. `system/fppd/stop` stops fppd and, the document says, also kills the MQTT listener. `system/fppd/restart` is a fast restart that reloads settings. `system/shutdown` shuts down the OS. `system/restart` reboots the OS.

The FPP 10 manual's port table lists 1883 for the MQTT broker connection and says that port is configurable. The same appendix says FPP also exposes a REST API on HTTP port 80, with no authentication, and that requests act on the device immediately. The command chapter says Start Playlist, in the command editor, offers Playlist Name, Repeat, If Not Running, and Protected from Schedule Override. The MQTT start topic is the one that ignores its payload, so those editor fields are not extra arguments on that topic.

## How to set it up

1. In FPP, set a hostname on Network Settings that no other player on the network uses. Configure MQTT, including any prefix from advanced settings. The v10 manual's default broker port in the port table is 1883, and it says the port is configurable.
2. Subscribe to `falcon/player/` plus that hostname plus `/#`, and add the prefix if one is set. Read `/ready`, `/status`, and `/playlist/name/status` before you start anything. `{null}` means no current playlist name.
3. Publish to `set/playlist/` plus the playlist name plus `/start`. The MQTT document says the payload is ignored. Confirm `/playlist/name/status` and `/status` changed.
4. Stop that running playlist with `set/playlist/` plus the name plus `/stop/graceful`, or `/stop/now` when it has to end immediately. Remember the document's rule: except for `/start`, the playlist name in the topic is ignored and the running playlist is the one affected.
5. Do not publish `system/fppd/stop`, `system/shutdown`, or `system/restart` from an unattended client. Stopping fppd also stops the MQTT listener, and the other two take the machine down.

Source: [FPP MQTT](https://github.com/FalconChristmas/fpp/blob/master/docs/MQTT.md) and the [FPP 10 manual](https://manual.falconplayer.com/FPP_Manual_v10.pdf). [xSchedule](/use-cases/play-an-xschedule-playlist-over-the-web-api) is the xLights scheduler's own web API, not this player.

## FAQ

### Does the start message need a repeat flag?
Not on `set/playlist/{name}/start`. The MQTT document says that payload is ignored. Repeat for the playlist that is already running is a different topic, `set/playlist/{name}/repeat`, with payload 0 or 1. The `command/run` example elsewhere in the same document shows a Start Playlist command whose args are a name and `true`. That is a published event, not the start-topic payload.

### Which playlist does stop hit?
The document says the playlist name is ignored for every playlist topic except `/start`, and that those topics affect the current running playlist. `/start` is the topic that uses the name.

### Is the HTTP API the same topic?
No. The v10 manual documents a separate REST API on port 80 with no authentication, and an interactive explorer at `/api/` on the player. The MQTT document only says that a payload on `set/command/{command}` is passed as if it were a REST call. It does not print the HTTP path.
