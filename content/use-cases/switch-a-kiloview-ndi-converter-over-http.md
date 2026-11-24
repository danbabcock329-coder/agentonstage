---
title: "Switch a Kiloview NDI converter over HTTP"
slug: switch-a-kiloview-ndi-converter-over-http
category: "LED/Video"
tools: ["Kiloview", "HTTP", "NDI"]
difficulty: Intermediate
source_url: https://www.kiloview.com/en/docs/ndi-device-http-apiversion-1-0/status-and-switching-of-encoding-and-decoding-modes/
labels: ["Commercial product"]
summary: "Kiloview's NDI HTTP API v1.0 switches a Connect Spark IO at /api/v1/mode/switch. HTTP 200 can still carry result error. Idle sessions expire in 10 minutes."
---

## What it does

Kiloview's NDI Device HTTP API version 1.0 is the HTTP control document for its embedded NDI encoders and decoders. The basic-rules page names N3, N4, N30, N40, and others, and says the firmware major version has to be 1.50 or higher. HTTP is port 80 and HTTPS is port 443. Paths start at `/api/v1/<module>/<method>`. The page says the API uses GET and POST only, and that success or failure is a JSON field rather than the HTTP status. A correct URL still returns HTTP 200 when the call fails. `"result": "ok"` is success. `"result": "error"` is failure. `"result": "auth-failed"` is the security failure. A 404 is the page's example of a wrong URL.

Every later call needs a session. POST or GET `/api/v1/user/authorize` with `username` and `password`. The sample data is `"session": "559dee0bd779a894618d6e044c35a3fc"` and `"token": "4345cd7b092d762bd4a646a98aa9f8ff"`. The security page says that pair expires within 10 minutes after you do not make any HTTP API call. The recommended pass-through is the headers `API-Session` and `API-Token`. Cookies named `session` and `token` are the second method. Query parameters `api-session` and `api-token` are marked not recommended. The page says not to authorize as the built-in user `admin`, and to use HTTPS for the authorize call.

Mode lives under `/api/v1/mode/`. The mode page says some devices can be both an encoder and a decoder, and its example is Connect Spark IO. It says Connect Spark Plus / TCMI4KUHD is encoder only, and that mode switching will not work on it. GET or POST `/api/v1/mode/get` returns `"mode": "encoder"` or `"decoder"`. `/api/v1/mode/switch` takes `mode` as `encoder` or `decoder`. The note says the switch can take up to 5 seconds because the device does an internal reboot, and that `/api/v1/mode/status` is how you confirm it. Ready looks like `"status": "ready"`. Not ready is `"result": "error"` and `"reason": "not-ready"`. The page says that reason can be absent during the reboot, and that the session and token stay valid across the switch. It says the wait from switch to working is usually 10 to 15 seconds.

Tally is separate and works in both modes. `/api/v1/tally/set?pgm=1&pvw=0` is the basic-rules example. The tally page says 1 is on and 0 is off, and that an omitted `pgm` or `pvw` keeps the previous value. In decoder mode it says the status is sent to the source currently being decoded, and that changing source clears the previous source's tally.

## How to set it up

1. Use a unit whose firmware major version is 1.50 or higher. Authorize at `https://<address>/api/v1/user/authorize` with a user that is not `admin`. Keep `session` and `token`. The security page says they expire after 10 minutes without an API call. Send them back as `API-Session` and `API-Token`.
2. Read mode with `/api/v1/mode/get`. The sample data field is `"mode": "encoder"` or `"decoder"`. Treat HTTP 200 as transport only. Read `result` before trusting `data`.
3. Switch a Connect Spark IO with `/api/v1/mode/switch` and `mode` set to `encoder` or `decoder`. Allow at least 5 seconds for that call. Then poll `/api/v1/mode/status` until `data.status` is `ready`. The page's usual wait is 10 to 15 seconds. A missing `reason` during reboot is what the mode page describes, not a second error code.
4. Do not send that switch to an encoder-only unit. The mode page names Connect Spark Plus / TCMI4KUHD and says switching will not work. Other models that lack the feature return the error message from the basic-rules section.
5. Set tally only after you know the mode. `/api/v1/tally/set` with `pgm=1` and `pvw=0` is the printed example. On a decoder, the tally page says a source change clears the tally that was sent to the previous source. Leave `/api/v1/sys/restore` alone. The timeout list names it as the factory-restore call.

Source: [Kiloview NDI HTTP API, mode](https://www.kiloview.com/en/docs/ndi-device-http-apiversion-1-0/status-and-switching-of-encoding-and-decoding-modes/), [basic rules](https://www.kiloview.com/en/docs/ndi-device-http-apiversion-1-0/basic-rules/), [security rules](https://www.kiloview.com/en/docs/ndi-device-http-apiversion-1-0/security-rules/), and [tally](https://www.kiloview.com/en/docs/ndi-device-http-apiversion-1-0/tally-status-and-control/).

## FAQ

### Does HTTP 200 mean the switch worked?
The basic-rules page says a correct URL returns 200 even when the API fails. Success is `"result": "ok"`. Failure is `"result": "error"` plus `msg`. `"auth-failed"` means the session or token was missing or illegal.

### Will every Kiloview NDI box switch modes?
The mode page's both-ways example is Connect Spark IO. It says Connect Spark Plus / TCMI4KUHD is encoder only and that mode switching will not work. The switch note says a model without the feature returns an error.

### Does the session die when the switch reboots the device?
The mode page says the session id and token stay valid through the internal reboot. The security page's 10-minute expiry is about having no HTTP API calls, not about that reboot.
