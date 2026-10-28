---
title: "Start Pharos Designer timelines over HTTP"
slug: start-pharos-designer-timelines-over-http
category: "Lighting"
tools: ["Pharos Designer", "HTTP"]
difficulty: Intermediate
source_url: https://pharos-designer-controller-api.readthedocs.io/en/latest/http-api/index.html
labels: ["Commercial product"]
summary: "Pharos Designer controllers serve an HTTP API for the loaded project, so an assistant can list timelines, start one, and fire a numbered trigger."
---

## What it does

The Pharos Designer controller API (the published set is Designer API v12) says the controllers offer HTTP and Lua APIs for system information, playback, and triggers. A JavaScript library on the controller wraps the HTTP calls and can subscribe to WebSocket channels. This entry stays on the HTTP timeline and trigger calls.

`GET /api/api_version` returns a JSON object with an integer `version`. The index page's example is `{ "version": 12 }`. The same page says asking for the API version works only in Designer 2.12 and above, and that the current API version is a property of the project.

If security is set up, some HTTP endpoints require authentication. The authenticate page says `POST /authenticate` takes form data or JSON with `username` and `password`. Leave `original_url` unset when you want a JSON object whose `token` attribute is a JWT. Sending `original_url` (as a cookie or a query parameter) makes the response set a `token` cookie and redirect instead. Use the JSON token as `Authorization: Bearer {token}`. A missing or wrong-typed field is HTTP 400. A wrong username or password is a redirect to the request's `Referer` header. The Web API Authentication chapter of the same manual says each authenticated response includes a new token, valid for 5 minutes, and that `/authenticate` has to be called again after 5 minutes without an authenticated request.

Timeline and trigger endpoints require a project to be loaded. `GET /api/timeline` returns `timelines`. An optional `num` filters them: one number, or a string such as `1,2,5-9`. Each timeline object includes `num`, `name`, `length` in milliseconds, `state` (`none`, `running`, `paused`, `holding_at_end`, or `released`), `onstage`, and `position` in thousandths of a second.

`POST /api/timeline` runs an action, and the page says the action propagates to every controller in the project. `action` is one of `start`, `start_release_others`, `release`, `toggle`, `pause`, `resume`, `set_rate`, or `set_position`. The documented body for starting timeline 2 is `{"action": "start", "num": 2}`. Omitting `num` is valid for `release`, `pause`, and `resume`, and then the action applies to every timeline. `fade` on a release is seconds. `set_rate` needs `rate` as a string. The page's half-speed example is `"0.5"`, and it says 1.0 means the timeline's default rate. `set_position` needs one of `position` (a fraction, such as `"0.5"` or `"1:3"`), `time` (seconds), or `flag` (the flag's name).

`GET /api/trigger` lists triggers. `type` can filter them. The example filter `"Timeline Started"` returns only that type. Each trigger includes `num`, `name`, `trigger_text`, and `actions` whose `text` is a generated description such as `"Start Timeline 1"`. `POST /api/trigger` fires one. The body needs integer `num`. Optional `var` is a comma-separated string passed into the trigger. Optional `conditions` defaults to `true`, which tests the trigger's conditions before the actions run.

The HTTP index also lists factory reset and hardware reset. This entry does not call them.

## How to set it up

1. Confirm a project is loaded. If the controller has security enabled, POST JSON or form fields `username` and `password` to `/authenticate`, and do not send `original_url`. Put the JSON `token` in `Authorization: Bearer`. The authenticate page says a bad password redirects to the Referer, and a missing field is HTTP 400.
2. `GET /api/api_version` on Designer 2.12 or newer. Then `GET /api/timeline` and read `num`, `name`, and `state` before you start anything.
3. Start one timeline with `POST /api/timeline` and `{"action": "start", "num": N}`. Read the timeline again and check `state` and `onstage`.
4. To fire a show trigger instead of a raw timeline action, `GET /api/trigger`, match `num` to the `name` and `actions` text you expect, then `POST /api/trigger` with that `num`. Leave `conditions` at its default unless you mean to skip the trigger's own conditions.
5. Do not send `release` without `num` until you have read the list. The timeline page says a missing `num` releases, pauses, or resumes every timeline in the project.

Source: [Pharos Designer HTTP API](https://pharos-designer-controller-api.readthedocs.io/en/latest/http-api/index.html), [Authenticate](https://pharos-designer-controller-api.readthedocs.io/en/latest/http-api/authentication/authenticate.html), [Timeline](https://pharos-designer-controller-api.readthedocs.io/en/latest/http-api/timeline.html), [Trigger](https://pharos-designer-controller-api.readthedocs.io/en/latest/http-api/trigger.html), and the [same manual as PDF](https://pharos-designer-controller-api.readthedocs.io/_/downloads/en/latest/pdf/).

## FAQ

### Does every controller need a login?
The introduction to authentication says some endpoints require a login when security is set up. It does not say every controller ships with security already on. If a call is refused, POST `/authenticate` without `original_url` and send the Bearer token.

### Will start affect only this controller?
The timeline page says the action propagates to all controllers in the project. Read the timeline state back after the POST.

### What is position measured in?
`length` is milliseconds. `position` is thousandths of a second. `time` on `set_position` is seconds. The page's example sets timeline 3 to 180 seconds with `{"action": "set_position", "num": 3, "time": 180}`.
