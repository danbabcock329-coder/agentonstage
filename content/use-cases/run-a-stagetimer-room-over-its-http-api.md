---
title: "Run a stagetimer.io room over its HTTP API"
slug: run-a-stagetimer-room-over-its-http-api
category: "Production Ops"
tools: ["stagetimer.io", "HTTP"]
difficulty: Intermediate
source_url: https://stagetimer.io/docs/api-v1/
labels: ["Commercial product"]
summary: "Stagetimer v1 is GET-only HTTPS. /start runs the selected timer and /start_timer can target an index. A paid license or the desktop app is required."
---

## What it does

stagetimer.io documents an RPC-style HTTP API for remote control of a room from scripts, Bitfocus Companion, or vMix. The introduction says every endpoint, including changes, uses GET, and that most endpoints act on the selected timer, the one with the blue background on the controller page. The API is available with any paid license and on the desktop app. The documented base is `https://api.stagetimer.io/v1/`.

A room API key is generated on the room controller page and is scoped to that room, one key per room. A team API key is created on the dashboard and works for every room the team owns. Send the key as the `api_key` query parameter, or as a bearer token in the `Authorization` header. `room_id` is required on the calls below. The docs' `test_auth` example returns `"ok": true` and a message that names the room.

`GET /v1/` takes no query parameters. The printed body says `"ok": true`, `"message": "This is the stagetimer.io Web API v1"`, and lists routes under `data`, including `/start`, `/stop`, `/next`, and `/previous`.

`get_status` returns timestamps for the selected timer, not a live countdown. `start`, `finish`, and `pause` are milliseconds since the Unix epoch. If `running` is true, remaining time is `finish` minus `Date.now()`. If `running` is false, remaining time is `finish` minus `pause`. Duration is `finish` minus `start`. `get_all_timers` returns the timer list. Match `playback_status.timer_id` from the status call to `_id` in that list.

Transport calls on the selected timer are `/start`, `/stop`, `/start_or_stop`, `/reset`, `/next`, and `/previous`. The `/start` section is titled as start or resume of the selected timer. A later section says the API always starts a timer from the beginning, and that `from_memory=true` on `/start_timer`, `/start_or_stop_timer`, `/next`, or `/previous` picks up a timer that already ran. That flag defaults to false, is per call, and does not read the room's Resume timers setting. `/start` is not in that list.

`/start_timer` and `/stop_timer` take an optional `timer_id` or `index`. `index` is the number the controller shows, sent as a string: `2`, or `2.1` for the first timer in group 2. A group number targets the first timer of the group. `/next` selects the next timer and does nothing on the last one. The list does not wrap. `autostart` defaults to false. Set it to true to start the timer after the selection. `/reset` moves the playhead of the selected timer and leaves recorded times and undo history. `/start_fresh` resets every timer, selects the first, and clears elapsed times, recorded start and finish times, and undo history. The rundown stays.

`/add_time` and `/subtract_time` take `amount` or `milliseconds`. The page's examples of `amount` are `5s` for 5 seconds and `10m` for 10 minutes. The page allows 100 requests per minute. A room key has its own budget per room. A team key shares one budget across the team's rooms. `RateLimit-*` headers report what remains. Rejected requests, such as a wrong key or room id, count against a second limit of 100 per minute per IP address. After that, every request from that IP gets `429`.

The same introduction offers a socket.io endpoint. Connect with `room_id` and `api_key`. The page says the current state arrives on connection, and names the events `current_timer`, `next_timer`, and `playback_status`. It says `current_timer` and `next_timer` carry the full timer object, including `speaker`. It also says the `playback_status` socket event uses the same data as `get_status` and is emitted on connect.

## How to set it up

1. Use a paid license or the desktop app. Create a room key on the controller page, or a team key on the dashboard. Keep the key out of a shared button label.
2. Call `https://api.stagetimer.io/v1/test_auth` with `room_id` and `api_key`. The documented success body has `"ok": true`.
3. Call `get_status`, then `get_all_timers`. Match `playback_status.timer_id` to `_id` before you decide which timer is selected.
4. Call `/start` for the selected timer, or `/start_timer` with `index` set to the controller's number. Add `from_memory=true` on `/start_timer` when the timer should continue from where it stopped. `/next` without `autostart` only changes the selection.
5. Compute the countdown locally from `finish`, `pause`, and `running`. The status page says the HTTP call does not return a live countdown.
6. Stay inside 100 requests a minute. Read `RateLimit-*`. A `429` can also mean the IP has used up the separate budget for rejected calls.

Source: [Stagetimer API v1](https://stagetimer.io/docs/api-v1/). [Ontime](/use-cases/build-an-ontime-rundown-with-an-agent-that-cannot-run-the-timers) is a different rundown program.

## FAQ

### Does /start continue a timer that already finished?
The `/start` heading says it starts or resumes the selected timer. The resume section says the API starts a timer from the beginning unless you pass `from_memory=true`, and it lists that flag on `/start_timer`, `/start_or_stop_timer`, `/next`, and `/previous`. It does not list `/start`.

### What is index 2.1?
The start-timer section says `index` is the number the controller shows, sent as a string. `2.1` is the first timer in group 2. A group number alone targets the first timer of that group.

### Will /reset wipe the rehearsal record?
No. The reset section says `/reset` moves the playhead and leaves recorded times and the undo history. `/start_fresh` clears that record, selects the first timer, and leaves the rundown itself in place.
