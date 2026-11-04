---
title: "Set Lightjams LED Mapper stages over HTTP and OSC"
slug: set-lightjams-led-mapper-stages-over-http-and-osc
category: "Lighting"
tools: ["Lightjams LED Mapper", "HTTP", "OSC"]
difficulty: Intermediate
source_url: https://www.lightjams.com/ljlm/ljlm-user-manual.html
labels: ["Commercial product"]
summary: "Lightjams LED Mapper serves http://HOST:port/ljlm. Read GET /ljlm/stages?includeState=1, then POST live intensity from 0 to 1. OSC uses /live/intensity."
---

## What it does

Lightjams LED Mapper (LJLM) can be driven over HTTP and over OSC. The user manual calls HTTP the most reliable way to integrate LJLM with control systems such as Crestron and Pharos, or with a custom web page. LJLM listens for HTTP on all network adapters. The base URL is `http://YOUR-COMPUTER-NAME:port/ljlm`. The computer name can be replaced with its IP address, or with `localhost` when the client is on the same machine. The manual says the port can be omitted when it is 80, which it calls the default for HTTP.

The manual says the full OpenAPI file ships in the install folder and can be copied with the Export OpenAPI JSON button. Responses are JSON, and the HTTP status code is how you detect errors. Names are case-insensitive. Parameters can be sent as a query string or as form data. Media id 0 is an empty slot.

Reads to take before a change:

- `GET /ljlm/heartbeat` returns `200 OK` when the server is running.
- `GET /ljlm/status` returns the status of every sub-system, as on Settings, Project.
- `GET /ljlm/stages?includeState=1` returns ids and additional info. `includeState=0` returns names only.
- `GET /ljlm/stages/{stage name or id}` returns one stage, including its id and merge mode.
- `GET /ljlm/stages/{stage name or id}/live` returns the live state.
- `GET /ljlm/stages/transitionFxNames` returns the legal transition-effect names.

`POST /ljlm/stages/{stage name or id}/live` sets the live parameters. The manual's ranges are `intensity` 0 to 1, `media` 0 to 999, `speed` 0 to 10, `transitionFx` as a name, `transitionDuration` 0 to 9999, `red`, `green`, and `blue` each 0 to 255, plus `audioMixControlled` and `remotelyControlled` as 0 or 1. A `*` in the stage name on a POST targets every matching stage. The manual's own sequence example is a different path: `POST /ljlm/groups/background/performer?active=1&sequenceId=1`.

OSC uses the same idea with different scales. LJLM listens for OSC on all network adapters. The manual's stage table includes `/ljlm/stages/{stage name}/live/intensity` from 0 to 1, `/ljlm/stages/{stage name}/live/media` from 0 to 999, `/ljlm/stages/{stage name}/live/speed` from 0 to 10, and `/ljlm/stages/{stage name}/live/transitionFx` from 0 to 43. Color on OSC is `/ljlm/stages/{stage name}/live/rgb`, or separate `/r`, `/g`, and `/b`, each 0 to 1. HTTP red, green, and blue are 0 to 255. The OSC section does not print a port number next to those addresses. Addresses and names are case-insensitive, media index 0 is an empty slot, and `*` in the stage name targets more than one stage.

Basic Auth is optional. The manual says you can restrict the API by turning Basic Auth on, and it points at the usual Basic access-authentication scheme. Until that is on, the HTTP API is open to anything that can reach the port. HTTP and OSC both listen on every network adapter.

## How to set it up

1. On the LJLM machine, confirm the HTTP base. With the default port it is `http://<ip>/ljlm`. From another machine, use the computer name or the IP, and include the port when it is not 80. Turn on Basic Auth if this port can be reached by more than the control machines. Keep it on a trusted control network either way.
2. Read first. `GET /ljlm/heartbeat` should be `200 OK`. `GET /ljlm/status` should look like the Project page. `GET /ljlm/stages?includeState=1` lists the stage names and ids. `GET /ljlm/stages/<name>/live` is the live state you are about to change.
3. Confirm the stage and the values with the operator, then `POST /ljlm/stages/<name>/live` with the fields you mean to change. Intensity is 0 to 1. Red, green, and blue are 0 to 255. `transitionFx` is a name from `GET /ljlm/stages/transitionFxNames`, not the OSC integer. Read `/live` again and check the HTTP status.
4. For OSC, send `/ljlm/stages/<stage>/live/intensity` as a float from 0 to 1. Send color as 0 to 1 on `/rgb` or on `/r`, `/g`, and `/b`. `transitionFx` on OSC is an integer from 0 to 43. Use the port the OSC settings in the app are actually listening on. The address table does not print one.
5. Leave `*` out of an unattended command. It matches multiple stages on both HTTP POST and OSC. The manual's group example, `POST /ljlm/groups/background/performer?active=1&sequenceId=1`, starts a sequence. Treat that as a separate confirm.

Source: [Lightjams LED Mapper user manual](https://www.lightjams.com/ljlm/ljlm-user-manual.html), HTTP and OSC remote-control sections.

## FAQ

### Are HTTP color values and OSC color values the same scale?
No. The HTTP live POST documents `red`, `green`, and `blue` as 0 to 255. The OSC addresses `/rgb`, `/r`, `/g`, and `/b` are each 0 to 1. Intensity is 0 to 1 on both.

### What does includeState=1 change?
`GET /ljlm/stages` with `includeState` 0 returns names only. `includeState` 1 returns ids and additional info. The manual says the parameter can be a query string.

### Is the API open if Basic Auth is off?
The manual says Basic Auth is how you restrict access, and that HTTP listens on all network adapters. With Basic Auth off, a client that can reach the port can POST. Keep the port on a trusted control network, and confirm a live POST before it is sent.
