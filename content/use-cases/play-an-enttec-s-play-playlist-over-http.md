---
title: "Play an ENTTEC S-PLAY playlist over HTTP"
slug: play-an-enttec-s-play-playlist-over-http
category: "Lighting"
tools: ["ENTTEC S-PLAY", "HTTP"]
difficulty: Intermediate
source_url: https://github.com/ENTTEC/SplayApi
labels: ["Commercial product"]
summary: "The S-PLAY HTTP API, from software v2.2, POSTs JSON to /api. Command 0 with playlist_id 1 plays that playlist. The sample reply is result true."
---

## What it does

ENTTEC's SplayApi README is the HTTP API for the S-PLAY playback engine, SKU 70092. It says to record cues and make playlists in the built-in web interface first, to set the unit's IP to static before using the API, and to run software at least v2.2. Playback commands are HTTP POST requests to `/api` with `Content-Type: application/json`. The README's example URL is `http://192.168.1.13/api`. Its curl example posts to `http://192.168.0.10/api`.

Play is command 0. The printed body is `{"command": 0, "playlist_id": 1}` and the printed response is `{"result": true}`. Pause is command 1 with the same `playlist_id`. Stop is command 2. The stop section says that if the playlist's fade-out time is not 0, the status becomes `PLAYLIST_STATUS_STOPPING`, and a repeated stop command stops the playlist immediately. Otherwise it stops. The status enum prints 0 idle, 1 playing, 2 paused, 3 stopped, 4 stopping, and 5 error. Command 3 reads one playlist. The sample for playlist 1 includes `"status": 3`, `"intensity": 100`, and `"name": "One"`. Command 8 reads every playlist's id, status, and playing time.

Playlist intensity is command 9. The section sets playlist 2 to `"intensity": 50` and says that value persists until power cycle. Master intensity is command 56. That section sets `"intensity": 50` and says it does not persist after power cycle. Command 55 reads the master. The enum comment on command 55 says the overall intensity persists until power cycle. The later GET_MASTER_INTENSITY heading says it does not. An error body is `"result": false` plus an `"error"` string. The README's example of an unsupported command is `"Unsupported command id: 100"`. The enum also numbers `GET_BACKUP` as 100.

[Tested: Claude drives an RGBW par through ENTTEC](/use-cases/tested-drive-an-rgbw-par-from-claude-through-an-enttec-dmx-usb-pro) is the DMX USB Pro on a bench. This README is the S-PLAY show recorder and its `/api` path.

## How to set it up

1. Build the playlist in the S-PLAY web interface and set a static IP. The README says the API is meant to run against software v2.2 or later. POST JSON to `http://<address>/api`.
2. Read before you play. Command 8 returns each playlist id with its status. Command 3 with `"playlist_id": 1` returns that playlist, including `"status"` and `"intensity"`. Status 1 is playing. Status 3 is stopped.
3. Play playlist 1 with `{"command": 0, "playlist_id": 1}`. The printed success body is `{"result": true}`. Pause that id with command 1. The README says some fields accept only integers or only floats, so keep `playlist_id` and `command` as JSON numbers.
4. Stop with command 2. If the fade-out time is not 0, the README says the status becomes stopping, which is 4, and a second command 2 stops it immediately. Set one playlist's intensity with command 9. The sample uses playlist 2 and intensity 50, and that section says the value persists until power cycle.
5. Do not send command 87 or command 222 from a show cue. The enum names 87 factory reset and 222 a graceful shutdown. Read `"result"` on every reply. `"result": false` is the error shape, and the printed unsupported-id example is 100 even though the enum also assigns 100 to `GET_BACKUP`.

Source: [ENTTEC SplayApi README](https://github.com/ENTTEC/SplayApi).

## FAQ

### Does command 9 move the master fader?
The command 9 heading calls it the output intensity of the given playlist and says it persists until power cycle. The sample body includes `"playlist_id": 2`. Command 56 is the separate overall intensity, and that section says the value does not persist after power cycle.

### Why do the master-intensity lines disagree?
The enum comment on command 55 says the overall intensity persists until power cycle. The GET_MASTER_INTENSITY section, which sends `{"command": 55}`, says it does not persist after power cycle. Command 56 is the set, and its heading says the same.

### What is status 4?
The enum names 4 `PLAYLIST_STATUS_STOPPING`. The stop section says a playlist with a non-zero fade-out time enters that status, and that sending stop again stops it immediately.
