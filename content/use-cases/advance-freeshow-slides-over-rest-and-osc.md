---
title: "Advance FreeShow slides over REST and OSC"
slug: advance-freeshow-slides-over-rest-and-osc
category: "Show Control"
tools: ["FreeShow", "HTTP", "OSC"]
difficulty: Intermediate
source_url: https://freeshow.app/api
summary: "FreeShow REST listens on port 5506. The current source also opens OSC on the WebSocket port, 5505 by default. /freeshow/next_slide advances a slide."
---

## What it does

FreeShow is the open-source presenter from Live Church Solutions. Its API page says the WebSocket and REST API have to be turned on under Connections. The examples on that page are a WebSocket at `http://localhost:5505` and REST at `http://localhost:5506`. If a password is set, a missing key comes back as 401.

REST is a POST to that port. The body is JSON with an `action` field plus the fields that action takes, and the password goes in an `Authorization: Bearer` header. The same page also shows a query form, `http://localhost:5506?action=` plus the action id. The current `main` source in `src/electron/utils/api.ts` answers an empty result with HTTP 204.

The action ids are on the API page. `next_slide` and `previous_slide` take no extra fields. `index_select_slide` takes an `index` and optional `showId` and `layoutId`. `start_show` takes an `id`. `clear_all` clears the output. `name_start_timer` takes a `value`. `get_shows`, `get_slide`, and `get_timers` are the read actions. In `src/frontend/components/actions/api.ts` the receiver subtracts one from `index` and the comment says the API starts at 1 while the code starts at 0, so the index you send is the slide's position starting at 1.

OSC is on the same API page: address `/freeshow/` plus the action id, and one argument that is `JSON.stringify` of the auth key and the data. The listener in current `main` is UDP, registered as `/freeshow/*`, and it is opened on the WebSocket port. `DEFAULT_PORTS` in that file is WebSocket 5505 and REST 5506. A custom Connections port is passed to the WebSocket and to OSC, and REST is opened on that port plus one. The first OSC argument is parsed as JSON. The address with `/freeshow` removed is handed to `oscToAPI`. That function, in `src/frontend/components/actions/apiOSC.ts`, accepts `/freeshow/next_slide` and the shorter paths its table lists under the prefix, including `/freeshow/slide/next`, `/freeshow/clear/all`, and `/freeshow/show/<id>/start`.

## How to set it up

1. In FreeShow, turn on the API under Connections. Leave the password empty while you test on one machine, then set it before the port is reachable from the show network. The API page says a missing key is 401 once a password is configured.
2. Read the project before you change the output. POST `{"action":"get_shows"}` to port 5506, with `Authorization: Bearer` set to the password when there is one. POST `{"action":"get_slide","showId":"active"}` for the slide that is up.
3. Advance with POST `{"action":"next_slide"}`. Go back with `previous_slide`. Start a show by id with `{"action":"start_show","id":"..."}`. Select a slide by position with `index_select_slide` and an `index` that starts at 1. Clear with `{"action":"clear_all"}`.
4. For OSC, send UDP to the WebSocket port, 5505 unless Connections changed it. The address is `/freeshow/next_slide`. The argument is a JSON string. With a password it includes `auth`. `/freeshow/slide/next` is the path the current `apiOSC.ts` table maps to the same action. A GET-style action such as `get_shows` is one of the calls the REST handler waits on and returns. An action with nothing to return is the 204 case.

Source: [FreeShow API](https://freeshow.app/api). Port and path details above are from [api.ts](https://github.com/ChurchApps/FreeShow/blob/main/src/electron/utils/api.ts) and [apiOSC.ts](https://github.com/ChurchApps/FreeShow/blob/main/src/frontend/components/actions/apiOSC.ts) on `main`.

## FAQ

### Which port is OSC?
The API page prints 5505 for the WebSocket and 5506 for REST, and it tells you to send OSC to "the UDP port" without printing a third number. In current `main`, `startOSC` uses the WebSocket port, and the default of that port is 5505. Change the port in Connections and OSC follows it. REST moves to that number plus one.

### Does /slide/next work without the /freeshow prefix?
The listener is registered as `/freeshow/*`. The addresses that match are `/freeshow/next_slide` and the table paths with that prefix, such as `/freeshow/slide/next`. A packet whose address does not start with `/freeshow/` does not enter that handler.

### Why did slide index 0 do nothing useful?
`triggerAction` subtracts one from `index` before it runs the action. The comment in that function says the API count starts at 1. Send 1 for the first slide.
