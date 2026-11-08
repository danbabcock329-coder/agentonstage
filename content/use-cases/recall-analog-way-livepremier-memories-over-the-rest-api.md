---
title: "Recall Analog Way LivePremier memories over the REST API"
slug: recall-analog-way-livepremier-memories-over-the-rest-api
category: "LED/Video"
tools: ["Analog Way LivePremier", "HTTP"]
difficulty: Intermediate
source_url: https://github.com/bitfocus/companion-module-analogway-livepremier
labels: ["Commercial product"]
summary: "LivePremier REST on port 80 recalls a screen memory, sets a layer source, and takes preview to program. Companion sends them and does not read them back."
---

## What it does

Analog Way's LivePremier processors (Aquilon and the rest of that series) expose a REST API on HTTP. The Bitfocus Companion module for it builds requests as `http://` plus the device address plus a path under `/api/tpp/v1`. The module's own note says this API does not offer feedback: a call is sent, and the module does not poll the processor to confirm the result. The same note says the module is not for Midra or Alta, and that many actions will not apply there. For a bidirectional connection the module points you at Analog Way's newer AWJ module instead.

The screen-memory action is `POST /api/tpp/v1/screens/{screenId}/load-memory`. In the module, `screenId` runs from 1 to 24 and `memoryId` runs from 1 to 1000. `target` is `preview` or `program`, and the action defaults to preview. A master memory is a separate call, `POST /api/tpp/v1/load-master-memory`, and that action caps `memoryId` at 500. Taking one screen is `POST /api/tpp/v1/screens/{screenId}/take`. Taking several at once is `POST /api/tpp/v1/take` with a JSON body of `screenIds` and `auxiliaryScreenIds`.

A layer source is `POST /api/tpp/v1/screens/{screenId}/layers/{layerId}/presets/{target}/source`. The module allows layers 1 to 48. `sourceType` in that action is `none`, `input`, `image`, `screen`, or `color`, plus a `sourceId`. Analog Way's LivePremier REST API Programmer's Guide, version 2.01 (March 2021), uses the same paths. Its example for screen 2, layer 3, preview, live input 3 is `{"sourceType": "input", "sourceId": 3}`. That guide also says GET requests are read-only, and `GET /api/tpp/v1/system` returns the device type, label, and firmware version object.

If Web RCS access is password protected, the same guide says any API call over HTTP returns 401 until you authenticate. The login call is `POST /auth/login?identifier={id}&password={pwd}`. The response sets an `auth-jwt` cookie, and later calls have to send that cookie back. The guide's success codes are 200 (with a body) and 204 (no body). It lists 400, 404, and 405 for a bad request, a missing resource, and a method the path does not allow, and it lists 409 as an error reported by the server.

The LivePremier user manual (the v2.4 edition) puts the switch in the Web RCS: Dashboard, Remote Control, Application Programming Interfaces, where AWJ and the REST API are enabled separately. The Companion module's host field is an IPv4 address, optionally with a port. A hardware unit uses port 80. A note on the module's issue tracker says the LivePremier simulator is not on port 80; it defaults to 3000, and the address you enter should match the Web RCS URL.

## How to set it up

1. In the Web RCS, open Dashboard, then Remote Control, then Application Programming Interfaces, and enable the REST API. The v2.4 user manual is the page that names that switch.
2. Read first. `GET http://<processor-ip>/api/tpp/v1/system` should return JSON with `type`, `label`, and `version`. If that call is 401, Web RCS is password protected: `POST /auth/login` with the `identifier` and `password` query parameters, keep the `auth-jwt` cookie, and send it on the next call.
3. Load memory 30 onto screen 2's preview with `POST /api/tpp/v1/screens/2/load-memory` and the body `{"memoryId": 30, "target": "preview"}`. Leave `target` off only if preview is what you want; the module and the guide both default to preview.
4. Put live input 3 on screen 2, layer 3, preview with `POST /api/tpp/v1/screens/2/layers/3/presets/preview/source` and `{"sourceType": "input", "sourceId": 3}`. Then `POST /api/tpp/v1/screens/2/take` with an empty body to transition that screen. For more than one screen, `POST /api/tpp/v1/take` with `{"screenIds": [1, 3], "auxiliaryScreenIds": [5]}`.
5. Treat a 200 or 204 as "the processor accepted the call," not as proof of what is on the output. The Companion module documents the REST API as fire-and-forget. Use AWJ when the assistant has to read the processor back.

Source: [bitfocus/companion-module-analogway-livepremier](https://github.com/bitfocus/companion-module-analogway-livepremier) and the [LivePremier user manual, v2.4](https://prlive.co/wp-content/uploads/2022/02/user-manual-livepremier-v2.4.pdf). The path list and the 1–1000 / 1–500 memory ranges are the actions in `livepremier.js`. The login cookie and `GET /api/tpp/v1/system` are from Analog Way's REST API Programmer's Guide, version 2.01 (March 2021).

## FAQ

### Does a successful POST mean the layer is on program?
No. The Companion module says the REST API does not provide feedback. A 200 or 204 means the call was accepted. Look at the multiviewer, or use the AWJ module, before you treat the output as changed.

### Will these paths drive a Midra or Alta?
The module's connection note says no. It says the REST module is kept for LivePremier compatibility, and that Midra and Alta belong on the AWJ module.

### What if the simulator refuses port 80?
The module's issue tracker says the simulator does not listen on port 80. Its default is port 3000, and the host you enter should be the same address you use for Web RCS, such as `127.0.0.1:3000`.
