---
title: "Recall Barco Event Master presets over JSON-RPC"
slug: recall-barco-event-master-presets-over-json-rpc
category: "LED/Video"
tools: ["Barco Event Master", "Barco PDS-4K", "JSON-RPC"]
difficulty: Intermediate
source_url: https://www.barco.com/manuals/R5912621/fajn36fk5hkc.html
labels: ["Commercial product"]
summary: "Event Master processors and the PDS-4K take JSON-RPC POSTs on port 9999, so a client can list presets and recall one to preview or program by id, serial, or name."
---

## What it does

Barco's PDS-4K user guide documents JSON-RPC for the PDS-4K presentation switcher and, in the same chapter, for Event Master processors. A client sends a JSON-RPC 2.0 request to the processor's IP on port 9999, which the guide calls the processor web server. The request is an HTTP POST with `Content-Type: application/json`. The body needs `jsonrpc`, `method`, `params`, and `id`. Requests are case sensitive. On a host-plus-client Event Master system the guide says to send JSON to the host unit. `success` of 0 is success. Anything else is an error.

The same page's operator methods include `listPresets`, `activatePreset`, `recallNextPreset`, `allTrans`, and `cut`. `listPresets` takes `ScreenDest` and `AuxDest`. The guide's values include -1 for all presets and -2 to leave that destination type out. The example response rows include `id`, `Name`, `LockMode`, and `presetSno`. `activatePreset` recalls by `id`, `presetSno`, or `presetName`. `type` 0 recalls to preview and is the default. `type` 1 recalls to program. The guide says `type` is not mandatory, and that it should be sent when the recall is meant for program. `recallNextPreset` takes empty params. The guide says at least one preset has to have been recalled already, and that the web app steps forward from the last recalled preset. An error comes back if there is no previous preset or no next one. `allTrans` takes an optional `transTime` float, applied to all armed destinations, with a maximum of 12. `cut` takes empty params.

`resetFrameSettings` is on the same page. Its `reset` argument is 0 for a soft reset, 1 for a factory reset, 2 for a factory reset that saves the IP, and 3 for a factory reset that saves IP and EDID. `powerStatus` takes empty params and describes the power supply: module missing, present with no cable, cabled with no DC, or OK.

Barco's separate Event Master remote-control reference, R5919184 version v02, was released 12 February 2026. Its support page lists E2, E2 Gen 2, E2 Jr, S3-4K and the S3-4K Jr, EX, PDS-4K, ImagePRO-4K, and ENCORE3 among the frames it covers. The HTML edition splits JSON-RPC into Event Master Toolset 10.x commands and Toolset 9.x commands. The v02 release notes say `activatePreset` was updated in both toolsets. The parameter examples in this entry are the ones printed in the PDS-4K user-guide page. Check R5919184 for the toolset on the processor before treating an example body as the current contract.

## How to set it up

1. Put the client on the same network as the Event Master host or the PDS-4K. The guide's request URL is the processor IP with port 9999.
2. In the processor web app, open the Settings icon on the menu bar and select JSONRPC API. The guide shows that dashboard as the place the APIs are used from the web application.
3. For a test client, the guide uses Postman: POST, the URL with port 9999, header `Content-Type` set to `application/json`, and the JSON-RPC body as raw.
4. Read before you recall. The page says a `ScreenDest` or `AuxDest` of -1 means all presets, and -2 leaves that destination type out. The printed example uses `ScreenDest` 0. Recall with `activatePreset` and `type` 0 until preview is the one you wanted. `type` 1 is program.
5. Do not point an assistant at `resetFrameSettings`. Values 1, 2, and 3 on this page are factory resets. Keep `cut` and `allTrans` out of an unattended session.

Source: [PDS-4K JSON-RPC remote control](https://www.barco.com/manuals/R5912621/fajn36fk5hkc.html) and the [Event Master remote control protocol reference, R5919184 v02](https://www.barco.com/en/support/docs/R5919184) ([HTML contents](https://www.barco.com/manuals/R5919184/index.html)).

## FAQ

### Does a preset recall always go to program?
No. On the PDS-4K page, `type` 0 is preview and is the default. `type` 1 is program. The February 2026 reference says `activatePreset` was updated for toolset 9 and toolset 10, so confirm the body against R5919184 for that processor.

### Where do commands go in a multi-frame system?
The PDS-4K page says that in a host and client Event Master setup, JSON is sent to the host unit.

### Can the same API cut and transition?
Yes. `cut` takes an empty params object. `allTrans` can take a `transTime` up to 12, and the guide says that time is applied to all armed destinations.
