---
title: "Set NovaStar COEX brightness and presets over HTTP"
slug: set-novastar-coex-brightness-and-presets-over-http
category: "LED/Video"
tools: ["NovaStar COEX", "HTTP"]
difficulty: Intermediate
source_url: https://api.coex.novastar.tech/en/doc-7530630
labels: ["Commercial product"]
summary: "NovaStar's COEX HTTP reference reads screen and canvas IDs, then sets brightness, blackout or freeze, and applies a preset. VMP must not be holding the processor."
---

## What it does

NovaStar publishes a COEX HTTP API reference. The API Instructions page says the PC and the device have to be able to talk, and that the device must not be occupied by VMP. The release step it recommends is clicking a blank space in the VMP device tree. Methods on that page are GET, POST, PUT, and DELETE. Its worked examples are GET for screen information, PUT for brightness, blackout, or freeze, and POST to apply a preset.

The calls below are the ones on the live reference pages fetched for this entry. They are not the same paths as the February 2023 COEX Series Interface API User Manual. That PDF says only HTTP is supported, the port is 8001, the IP is on the controller LCD, and the products it covers are the CX80 Pro, CX40 Pro, MX40 Pro, and KU20. Its display-mode URL is `PUT /api/v1/device/screen/displaymode` with a body of `value` only. The current Set Blackout/Freeze page is a different path and also requires canvas IDs. Use the reference that matches the firmware on the processor. The OpenAPI `servers` entry on the current pages is the placeholder `http://prod-cn.your-api-server.com`. That host is not a NovaStar address. The `Device-Key` header example on those pages is `10.40.41.200:8001`. Content-Type `application/json` is marked required. `Device-Key` is shown as an example, not as a required parameter.

`GET /api/v1/screen` returns `code`, `data`, and `message`. `data.screens[]` includes `screenID`, `screenName`, and `canvases[]` with `canvasID`. The page says this call returns screen, cabinet, canvas, and layer information. Optional query `isNeedCabinetInfo` is documented as `0` for yes and `1` for no.

`PUT /api/v1/screen/brightness` sets brightness for all cabinets of the listed screens. The body needs `screenIdList` (strings, the `screenID` values from `GET /api/v1/screen`) and `brightness` (float, range 0 to 1). The page is tagged MX6000. A 200 body has `code`, `data`, and `message`. The error-code page says `0` is Success.

`PUT /api/v1/device/displaymode` controls the sending card on a canvas: `value` `0` normal, `1` blackout, `2` frozen, default normal, plus `canvasIDs` from `canvasID` on `GET /api/v1/screen`. The page's success example is `{"code": 0, "data": null, "message": "Success"}`.

`POST /api/v1/preset/current/update` applies a user-defined preset. The body needs `sequenceNumber` (int16) and `screenID`, both from `GET /api/v1/preset` under those key names.

The error-code page also lists `1` InvalidParam, `5` Busying, and `6` NotSupport, among others. `code` `0` is the success value to check. The 2023 manual's success example is the same shape: `code` 0, `data` null, `message` `Success`.

## How to set it up

1. Close VMP's hold on the processor, or click a blank spot in the device tree, which is the release step on the API Instructions page. Point HTTP at the controller IP. The 2023 manual says port 8001, and the current pages' `Device-Key` example uses that port.
2. `GET /api/v1/screen` and store `screenID` and each `canvasID`. Stop if `code` is not 0. The error-code page says 0 is Success and 5 is Busying.
3. Set brightness with `PUT /api/v1/screen/brightness` and a body of `screenIdList` plus `brightness` between 0 and 1. Read the screen again before you send a second write.
4. Blackout is `PUT /api/v1/device/displaymode` with `value` 1 and the canvas IDs you just read. `value` 0 is normal and `value` 2 is frozen. Do not send the 2023 path `/api/v1/device/screen/displaymode` to a processor that speaks the current page. That older body has no `canvasIDs`.
5. Apply a preset only after `GET /api/v1/preset`. POST `/api/v1/preset/current/update` with the `sequenceNumber` and `screenID` from that list.

Source: [COEX API Instructions](https://api.coex.novastar.tech/en/doc-7530630), [Retrieve Screen Information](https://api.coex.novastar.tech/en/api-363921203), [Set Screen Brightness](https://api.coex.novastar.tech/en/api-363921204), [Set Blackout/Freeze Screen](https://api.coex.novastar.tech/en/api-363921206), [Apply Preset](https://api.coex.novastar.tech/en/api-363921208), [Error Codes](https://api.coex.novastar.tech/en/doc-7530631), and the [COEX Series Interface API User Manual (PDF, February 2023)](https://oss.novastar.tech/uploads/2023/02/COEX-Series-Interface-API-User-Manual.pdf).

## FAQ

### Which processors does the 2023 PDF name?
The CX80 Pro, CX40 Pro, MX40 Pro, and KU20. The current brightness page is tagged MX6000. Treat the PDF's model list as the list in that document, and check the live page's tags against the processor you have.

### What does code 5 mean?
The error-code page names 5 as Busying, "Device busy". The instructions page says a processor occupied by VMP should be released before you call the API.

### Is brightness a percent from 0 to 100?
On the current Set Screen Brightness page it is a float from 0 to 1, not 0 to 100. `screenIdList` comes from `screenID` on `GET /api/v1/screen`.
