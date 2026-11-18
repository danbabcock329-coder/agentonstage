---
title: "Set a LedFx effect over the v2 API"
slug: set-a-ledfx-effect-over-the-v2-api
category: "LED/Video"
tools: ["LedFx", "HTTP", "WLED"]
difficulty: Intermediate
source_url: https://docs.ledfx.app/en/latest/api_v2.html
summary: "LedFx's HTTP port defaults to 8888. PUT /api/v2/virtuals/{id}/effect starts an effect. The v2 reference uses type rainbow as the start example."
---

## What it does

LedFx is a browser-controlled effect engine for addressable LED strips. The launch options page says the HTTP port defaults to 8888 and the host defaults to localhost, `127.0.0.1`. Change the port with `-p`. A controller on another machine cannot use that default host until you pass `--host` with an address it can reach.

The current contract is the v2 REST API, under `/api/v2`. The reference says v1 keeps working and new work goes into v2. A running instance serves the OpenAPI document at `/api/v2/openapi.json` and the same reference at `/api/v2/docs`. The page's example of that docs URL is `http://localhost:8888/api/v2/docs`.

Virtual ids go in the path, percent-encoded. The reference's example name `Küche` becomes the id `k-che`, so the path is `/api/v2/virtuals/k-che`. An id is made from the name and is at most 128 characters. `GET /api/v2/virtuals` lists them. `GET /api/v2/virtuals/{virtual_id}` reads one, including settings, segments, state, and the running effect.

Starting an effect is `PUT /api/v2/virtuals/{virtual_id}/effect`. The reference's start example is `{"type": "rainbow", "config": {…}}`. Adjusting the running effect is a `PATCH` of `{"config": {"speed": 2}}`. `PUT` without a `config` restores the settings that virtual last used for that type. `DELETE` clears the effect. `POST .../effect/randomize` and `POST .../effect/reset` randomize or restore defaults for the effect that is already running.

Request bodies are JSON and are checked strictly. An unknown key, a string where a number is required, or a value outside range is a 422 problem whose `errors` name the field. The page's example path is `["body", "config", "max_brightness"]`. A non-JSON body on a mutating route is 415. A body over the size limit is 413. `PATCH` is all-or-nothing: if any part is refused, nothing changes.

Safe mode refuses every change that would be saved with 409 and `urn:ledfx:problem:safe-mode`. Reads still work. So do the runtime tools the page says save nothing: clear-effects, flashes, force-color, calibration, highlight, and fallback.

## How to set it up

1. Start LedFx and open `http://127.0.0.1:8888` on that machine. The launch page says 8888 and localhost are the defaults. Use `-p` for another HTTP port, and `--host` when a show controller on another computer has to reach the API.
2. `GET /api/v2/virtuals` and copy the id of the strip or group you want. If the name has a space or a non-ASCII character, percent-encode it in the path. The reference's `Küche` id is `k-che`.
3. Start an effect with `PUT /api/v2/virtuals/{virtual_id}/effect` and a JSON body. The documented start shape is `{"type": "rainbow", "config": {…}}`. A 422 names the field that failed. A 409 with `urn:ledfx:problem:safe-mode` means that instance will not save the change.
4. Change one setting on the running effect with `PATCH` and `{"config": {"speed": 2}}`, which is the reference's adjust example. `DELETE` the same effect path to clear it.
5. For several virtuals, the reference lists `POST /api/v2/virtuals/set-effect`. Without a `config`, that call starts the effect type's defaults. An unknown id in `virtual_ids` is a 404 that names each unknown id, and nothing changes.

Source: [LedFx API v2 reference](https://docs.ledfx.app/en/latest/api_v2.html), [LedFx command line options](https://docs.ledfx.app/en/latest/launch.html), and the [v1 REST API](https://docs.ledfx.app/en/stable/apis/api.html) for `POST /api/find_devices`.

## FAQ

### Is this the WLED JSON API?
[Set WLED pixel props over the JSON API](/use-cases/set-wled-pixel-props-over-the-json-api) talks to a WLED controller. This page is LedFx's own `/api/v2` effect API. The v1 `POST /api/find_devices` call finds WLED devices on the LAN. For an unregistered WLED device it defaults the remote protocol to DDP, or to UDP when that WLED build predates DDP.

### What does a 409 mean?
The v2 reference uses 409 for more than one refusal. Safe mode answers 409 with `urn:ledfx:problem:safe-mode` when the change would be saved. Starting an effect whose stored settings no longer pass is also a 409, and that response names the field.

### Does v1 still answer?
The v2 page says v1 keeps working and that new work goes into v2. Paths on this page all start with `/api/v2`.
