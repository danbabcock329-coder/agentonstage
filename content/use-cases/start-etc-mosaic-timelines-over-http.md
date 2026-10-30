---
title: "Start ETC Mosaic timelines over HTTP"
slug: start-etc-mosaic-timelines-over-http
category: "Lighting"
tools: ["ETC Mosaic", "HTTP"]
difficulty: Intermediate
source_url: https://etc-mosaic-controller-api.readthedocs.io/en/latest/http-api/timeline.html
labels: ["Commercial product"]
summary: "ETC Mosaic Designer API v12 starts, pauses, and releases timelines with POST /api/timeline. With security on, the client uses a Bearer token from /authenticate."
---

## What it does

ETC's Mosaic Designer API v12 HTTP reference controls the project loaded on a Mosaic controller. The timeline page says its endpoints require a project to be loaded, and that an action propagates to every controller in the project.

`POST /api/timeline` takes a JSON object. `action` is one of `start`, `start_release_others`, `release`, `toggle`, `pause`, `resume`, `set_rate`, or `set_position`. `num` is the timeline number. The page says omitting `num` is valid for `release`, `pause`, and `resume`, and its examples of those three with no `num` affect every timeline. `fade` is seconds, used on `release` and on the release that a `toggle` performs when the timeline is running. Leave it out to use the default release time.

The page's start example is `{"action":"start","num":2}`. Pause timeline 4 with `{"action":"pause","num":4}`. Resume it with `{"action":"resume","num":4}`. Release timeline 2 over 3.5 seconds with `{"action":"release","num":2,"fade":3.5}`. `{"action":"pause"}` pauses all timelines. `{"action":"release","fade":2.0}` releases all of them over 2 seconds. A `group` of `"!B"` on that release keeps group B and releases the rest. The leading `!` means every group except the one named.

`set_rate` needs `rate`, a string such as `"0.5"` for half the default rate. `set_position` needs one of `position` (a fraction of the timeline, `"0.5"` or `"1:3"`), `time` (seconds, such as `180`), or `flag` (the flag name, such as `Start sparkle`).

`GET /api/timeline` returns a `timelines` array. `num` filters it. A string such as `1,2,5-9` is accepted. Each timeline includes `name`, playback `group`, `length` in milliseconds, and `state`: `none`, `running`, `paused`, `holding_at_end`, or `released`. `position` is in thousandths of a second. `onstage` says whether the timeline is affecting fixture output.

`GET /api/config` reports `http_port` and `https_port`. The v12 example values are `80` and `443`. Read the live values from the controller. `POST /api/config` can change the address and those ports. A `200` body includes `restart`. When that boolean is true, the controller resets itself to apply the change.

When security is set up, some HTTP API calls require a login. `POST /authenticate` accepts JSON or form data with `username` and `password`. Omit `original_url` when you want the JWT in a JSON `token` field. Sending `original_url` makes the response set a `token` cookie and redirect, which is the browser login path. Put the JSON token on later requests as `Authorization: Bearer {token}`. The authentication guide says each authenticated response returns a new token valid for 5 minutes, and that 5 minutes with no authenticated request expires it. A wrong username or password redirects to the `Referer` header. A missing field or a bad type is a `400`.

The same guide's sample HTML form posts an input named `user`. The authenticate reference names the JSON field `username`. An agent sending JSON should use `username`.

## How to set it up

1. `GET /api/config` and read `http_port`. The v12 example is `80`. Use the port the controller returns. `GET /api/timeline` next, and confirm a project is loaded. Note `num`, `name`, and `state` for the timeline you mean to run.
2. If security is on, `POST /authenticate` with `{"username":"...","password":"..."}` and no `original_url`. Store the JSON `token`. Send `Authorization: Bearer` plus that token. Replace the token from each authenticated response. A client that sits quiet for 5 minutes has to log in again.
3. Start one timeline with `POST /api/timeline` and `{"action":"start","num":2}`, using the `num` you just read. `GET /api/timeline?num=2` and check `state` is `running`.
4. Pause that timeline with `{"action":"pause","num":2}`. Resume it with `{"action":"resume","num":2}`. Leave `num` off only when you mean every timeline. `{"action":"pause"}` pauses all of them.
5. Release with a fade you choose, such as `{"action":"release","num":2,"fade":3.5}`. Keep `POST /api/config` off the show client. A `restart` value of true resets the controller.

Source: [Mosaic timeline HTTP API](https://etc-mosaic-controller-api.readthedocs.io/en/latest/http-api/timeline.html), [authenticate](https://etc-mosaic-controller-api.readthedocs.io/en/latest/http-api/authentication/authenticate.html), [web API authentication](https://etc-mosaic-controller-api.readthedocs.io/en/latest/guide/web-api-authentication.html), and [config](https://etc-mosaic-controller-api.readthedocs.io/en/latest/http-api/config.html).

## FAQ

### Does a start stay on one controller?
The timeline page says the action propagates to all controllers in the project.

### What if no project is loaded?
The timeline page says those endpoints require a project to be loaded on the controller. `GET /api/timeline` is the check before a start.

### How long does the token last?
The authentication guide says the token is valid for 5 minutes, and that each authenticated response includes a new one. Five minutes without an authenticated request means calling `/authenticate` again. `/authenticate` itself is outside the `/api` prefix. Timeline and config are under `/api`.
