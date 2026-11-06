---
title: "Drive WATCHOUT 7 timelines and inputs over HTTP"
slug: drive-watchout-7-timelines-and-inputs-over-http
category: "LED/Video"
tools: ["Dataton WATCHOUT", "HTTP", "REST"]
difficulty: Intermediate
source_url: https://docs.dataton.com/guide/watchout/external-control/http-rest-api.html
summary: "WATCHOUT 7's REST API on port 3019 plays, pauses, and jumps timelines, and sets inputs. No authentication by default."
---

## What it does

WATCHOUT 7's user guide documents an HTTP API for show control on `http://{host}:3019`. This is the REST surface, separate from WATCHOUT's OSC protocol. Each node also runs a Process Manager on port 3017. The HTTP API is off until you enable it under Nodes, Node Info, Protocols. The guide says the Web UI toggle is the Asset Manager browser, not this API.

Playback state for every timeline is `GET /v0/state`. `POST /v0/play/{timeline_id}` starts one timeline. `POST /v0/pause/{timeline_id}` pauses it. `POST /v0/stop/{timeline_id}` stops it and resets to the start. The timeline id is a number. `POST /v0/jump-to-time/{timeline_id}` takes `time` in milliseconds, and an optional `state` of `play` or `pause`. The guide says the default state on that jump is `pause`. `POST /v0/jump-to-cue/{timeline_id}/{cue_id}` jumps to that cue's start, with the same optional state. `GET /v0/timelines` lists ids and names. `GET /v0/cues/{timeline_id}` lists the cues on one timeline. The guide says to copy those ids from the timeline or cue context menu in Producer.

`GET /v0/show` returns the current show as JSON. `POST /v0/show` replaces the show from a JSON body. One input is `POST /v0/input/{key}?value=` with an optional `duration` in milliseconds. Several inputs go in one call: `POST /v0/inputs` with a JSON array of `key`, `value`, and optional `duration`. Cue-set state is readable and settable by id or by name, under `/v0/cue-group-state/by-id` and `/v0/cue-group-state/by-name`.

Live updates are server-sent events at `/v0/sse`, `/v1/sse`, and `/v2/sse`, and NDJSON at the matching `/ndjson` paths. The guide says v2 is the diff-based stream. Interactive docs, rendered with RapiDoc, are at `http://{host}:3019/test`. The OpenAPI document is `/api-docs/openapi.json` on the same port.

The guide says the API does not require authentication by default. Any client that can reach the port can call it. Keep 3019 and 3017 on a trusted network.

## How to set it up

1. On the node, open Nodes, then Node Info, then Protocols, and enable the HTTP API. Confirm something answers on port 3019. Open `http://{host}:3019/test` if you want the built-in console before you script a client.
2. `GET /v0/timelines` and `GET /v0/state`. Take the numeric id from Producer's Copy ID, or from that timeline list. `GET /v0/cues/{timeline_id}` is the cue list for one timeline.
3. `POST /v0/play/{timeline_id}` runs it. `POST /v0/pause/{timeline_id}` holds it. `POST /v0/stop/{timeline_id}` stops it and resets to the start. To land at a time and keep playing, `POST /v0/jump-to-time/{timeline_id}?time=6000&state=play`. Time is milliseconds. Omit `state` and the guide says the jump stays paused.
4. Read `GET /v0/inputs` before you write a variable. Set one with `POST /v0/input/{key}?value=0.8&duration=500`. Set several with `POST /v0/inputs` and a JSON array. Cue sets use `/v0/cue-group-state/by-id` or `/v0/cue-group-state/by-name`.
5. Leave port 3017 out of a show client. The guide puts shutdown, reboot, and a WATCHOUT service restart on that Process Manager port, aimed at one node. Read live updates from `/v2/sse` or `/v2/ndjson`. Keep 3019 and 3017 on a trusted network. The guide says the API has no authentication by default.

Source: [WATCHOUT 7 HTTP REST API](https://docs.dataton.com/guide/watchout/external-control/http-rest-api.html)

## FAQ

### Where do the timeline and cue numbers come from?
The guide says to use Copy ID on the timeline or cue context menu in Producer. `GET /v0/timelines` and `GET /v0/cues/{timeline_id}` return those ids with names.

### Does a jump start playback?
`POST /v0/jump-to-time/{timeline_id}` and `POST /v0/jump-to-cue/{timeline_id}/{cue_id}` take an optional `state` of `play` or `pause`. The guide says the default is `pause`. Add `state=play` when the timeline should run from the new point.

### Is there a login?
The guide says no authentication by default. Any client that can reach port 3019 can play a timeline, load a show, or set an input. Keep 3019 and the per-node Process Manager on 3017 on a trusted network.
