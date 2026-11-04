---
title: "Start and stop Epiphan Pearl recordings over the REST API"
slug: start-and-stop-epiphan-pearl-recordings-over-the-rest-api
category: "LED/Video"
tools: ["Epiphan Pearl", "HTTP"]
difficulty: Intermediate
source_url: https://epiphan-video.github.io/pearl_api_swagger_ui/
labels: ["Commercial product"]
summary: "Pearl REST v2.0 starts recorder 1 with POST /api/v2.0/recorders/1/control/start. Stop uses /recorders/control/stop. Read status first. Basic auth is required."
---

## What it does

Epiphan's Pearl device REST API is published as OpenAPI 3.0, version v2.0, titled "Pearl device REST API". The Swagger UI at the documentation site loads that file from `/api/v2.0/openapi.yml`, and the spec's server URL is `/api/v2.0`. Every operation in the file is under HTTP Basic authentication. The security scheme's description shows an `Authorization: Basic` header.

A recorder in this spec is either a built-in channel recorder or a user-created multitrack recorder. `GET /api/v2.0/recorders` returns each recorder's id, name, and whether it is multi-source. `GET /api/v2.0/recorders/status` returns status for the recorders you ask about, and `GET /api/v2.0/recorders/{rid}/status` returns one. The state enum is `disabled`, `starting`, `started`, `stopped`, or `error`. An error state can include a description. A started example in the spec also carries `duration`, `active`, and `total`.

Starting one recorder is `POST /api/v2.0/recorders/{rid}/control/start`. The path example for the first recorder is `1`, so recorder 1 is `POST /api/v2.0/recorders/1/control/start`. Stopping that recorder is `POST /api/v2.0/recorders/1/control/stop`. A missing recorder is 404. Starting or stopping many at once is `POST /api/v2.0/recorders/control/start` and `POST /api/v2.0/recorders/control/stop`. An optional `ids` query filters them. The spec's example for the first two is `1,2`. Leave `ids` off and the call applies to every recorder. Both the single and the all-recorders forms say the method does not wait: the start or stop runs asynchronously, and a processed call returns `status: ok`. That body means the command was processed, not that the state is already `started` or `stopped`.

Epiphan's 18 February 2025 product note says the expanded REST API has a developer-access mode for copying device-specific commands, and it names Pearl Nano, Pearl Mini, Pearl-2, and Pearl Nexus. The Swagger page is the command list. The note's broader wording about pausing or extending streams is not a recorder path in this spec. Pause, resume, and extend in v2.0 are on `/api/v2.0/schedule/events/{eventId}/control/`, which is a different object from a recorder.

The legacy guide's start-here page says that guide is for the legacy API, recommends this REST API, and covers an RS-232 API and an HTTP/HTTPS API for Pearl-2, Pearl Mini, Pearl Nexus, and Pearl Nano. On the RS-232 page, `START.2` starts recording on channel 2 and `STOP.2` stops it. `START` with no index starts every channel and recorder. `STOP` with no index stops them. The page says a start issued while a recording is already active continues that recording, and that there is no RS-232 command to restart it. A recorder index uses the prefix `m`, so recorder 2 is `m2`. Each RS-232 command ends with a line feed, ASCII 10. The same page says the channel or recorder index is the preferred argument.

## How to set it up

1. Open the Swagger UI, or the `openapi.yml` it loads, for the firmware you are talking to. Send HTTP Basic on every call. Keep the Pearl on a trusted control network, and do not put the Basic credentials into a prompt that will be logged.
2. Read first. `GET /api/v2.0/recorders` lists ids and names. `GET /api/v2.0/recorders/1/status` returns the state. Confirm the id with the operator before a start or a stop. Id `1` is the spec's example of the first recorder, not a guess you should reuse on a different unit.
3. To roll that recorder, `POST /api/v2.0/recorders/1/control/start`. To stop it, `POST /api/v2.0/recorders/1/control/stop`. To stop every recorder, `POST /api/v2.0/recorders/control/stop`. Add `?ids=1,2` when the stop should be limited to those ids.
4. Treat `status: ok` as "the command was accepted." The spec says the call does not wait for the recorder to start or stop. Read `/recorders/{rid}/status` again and wait until `state` is the one you asked for. `starting` is not `started`. `error` carries a description.
5. Use the legacy RS-232 strings only on the serial API the start-here page still documents. `START.2` and `STOP.2` are channel 2. `m2` is recorder 2. `START` and `STOP` alone affect every channel and recorder. The start-here page points new work at the REST API.

Source: [Pearl device REST API Swagger UI](https://epiphan-video.github.io/pearl_api_swagger_ui/) (OpenAPI v2.0, loaded from `api/v2.0/openapi.yml`), [Epiphan's 18 February 2025 REST note](https://www.epiphan.com/product-news/copypaste-commands-for-rest-api-on-pearl/), and the legacy guide's [start here](https://www.epiphan.com/userguides/pearl-api/Content/startHere/startHere-about-apiGuide.htm) and [RS-232 commands](https://www.epiphan.com/userguides/pearl-api/Content/integrate/thirdPartyConfig/man_br_3rdParty_controlling_with_rs232.htm).

## FAQ

### Does status ok mean the file is recording?
The start and stop operations say they do not wait. `status: ok` means the command was processed. Read `GET /api/v2.0/recorders/{rid}/status` and use the `state` field. The enum is `disabled`, `starting`, `started`, `stopped`, and `error`.

### Can one call stop a single recorder?
Yes. `POST /api/v2.0/recorders/{rid}/control/stop` stops that id. `POST /api/v2.0/recorders/control/stop` stops every recorder, or the ids you pass in the `ids` query. A single-recorder call returns 404 when that id does not exist.

### What is START.2?
That string is on the legacy RS-232 page, not in the v2.0 REST paths. `START.2` starts channel 2. `STOP.2` stops it. A recorder uses the `m` prefix, so recorder 2 is `m2`. The start-here page recommends the REST API for new integrations.
