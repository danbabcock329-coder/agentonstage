---
title: "Animate Singular.live overlays over the control API"
slug: animate-singular-live-overlays-over-the-control-api
category: "LED/Video"
tools: ["Singular.live", "HTTP"]
difficulty: Intermediate
source_url: https://developer.singular.live/rest-api/api-reference/send-data-to-a-control-app/update-a-control-apps-animation-state
labels: ["Commercial product"]
summary: "PATCH app.singular.live/apiv2/controlapps/{token}/control sets one sub-composition to In, Out1, or Out2. POST the same app's /command path with TakeOutAllOutput animates every overlay to Out."
---

## What it does

Singular's developer portal controls a published control app with the shared app token in the URL. The authorization page says these tokens are path variables, and that requests using them require no authentication. The token page says every API request needs that token because it refers to one instance of a control app. It replaces `:appToken` in `https://app.singular.live/apiv2/controlapps/:appToken/control`.

The token page says where to copy it. In the Dashboard, select the app, press the i button, and read the shared app token under URLs and Token. In UNO, press the </> icon. In Studio, open the three-dot menu, choose Manage Access, and copy the App Token.

`GET https://app.singular.live/apiv2/controlapps/:appToken/model` returns the control parameters. The how-to says to do this so you can see field types before you integrate. The sample body is a JSON array. A composition object has `id`, `name`, and `model`. Nested overlays are in `subcompositions`, and each of those has its own `id`, `name`, `state`, and `model`. In the published sample, one nested overlay is named `Lower - Header` and a text field inside it has the id `Header`. Field `type` values in that sample include `text` and `color`. `state` in the sample is `Out` on some overlays and `In` on another.

Animation uses `PATCH` on `https://app.singular.live/apiv2/controlapps/:appToken/control`. The body is a JSON array. Each object includes `subCompositionId` or `subCompositionName`, plus `state`. The request table lists `In`, `Out1`, and `Out2`. The same page's animation-state table also describes `Out` as the default Out animation, `Out1` as an out that reverses the In animation when there are multiple timelines, and `Out2` as an independent Out. A success body is `{"success": true}`.

Content uses that same PATCH URL. The body is an array of objects with `subCompositionId` or `subCompositionName`, plus `payload`. The page says one of those two identity fields is required. Payload keys are control node ids. The page's single-line text example is a string such as `"John Doe"`. Its multi-line example is written `Title/nSubtitle`. A timer payload is an object whose `command` is `play`, `pause`, `reset`, or `start`. The string `execute` triggers a button. Success is again `{"success": true}`.

`POST https://app.singular.live/apiv2/controlapps/:appToken/command` with `{"action":"TakeOutAllOutput"}` animates every overlay in the control app to its Out state. Success is `{"success": true}`.

## How to set it up

1. Copy the shared app token from the Dashboard inspector, the UNO </> icon, or Studio's Manage Access menu. Put it only in the path. The authorization page says token requests do not add another authentication step.
2. `GET https://app.singular.live/apiv2/controlapps/APP_TOKEN/model` and read `name`, `id`, and `state` for the overlay you mean to run. Use a control-node `id` from that overlay's `model` array, such as the sample field id `Header`, when you need to change text.
3. Animate one overlay with `PATCH` `.../control` and a JSON array. One object is enough: `subCompositionName` set to the name you just read, and `state` set to `In`. The documented success body is `{"success": true}`.
4. Change text with another PATCH to the same URL. Send `payload` whose keys are the control-node ids from the model. Send a string for a text field. Leave the token out of logs and out of a query string. It belongs in the path.
5. Clear the app with `POST` `.../command` and `{"action":"TakeOutAllOutput"}`. That call animates every overlay out. Use it when the safe end state is a clear output, and use a single `state` of `Out1` or `Out2` when only one overlay should leave.

Source: [animation state](https://developer.singular.live/rest-api/api-reference/send-data-to-a-control-app/update-a-control-apps-animation-state), [update content](https://developer.singular.live/rest-api/api-reference/send-data-to-a-control-app/update-a-control-apps-content), [get the model](https://developer.singular.live/rest-api/how-to-guides/get-a-control-apps-model), [app token](https://developer.singular.live/rest-api/how-to-guides/get-a-control-apps-api-token), [authorization](https://developer.singular.live/rest-api/authorization), and [take out all output](https://developer.singular.live/rest-api/api-reference/take-out-all-of-an-apps-output).

## FAQ

### Where does the token go?
The authorization page says tokens are path variables and that those requests require no authentication. The token page says the token replaces `:appToken` in the control URL and that it refers to one control-app instance.

### Which state string animates out?
The animation request table lists `In`, `Out1`, and `Out2`. The same page describes `Out` as the default Out animation, `Out1` as a reverse of In when there are multiple timelines, and `Out2` as a separate Out. `TakeOutAllOutput` animates every overlay to Out.

### What does a good call return?
The animation page, the content page, and the take-out page each show a 200 body of `{"success": true}`. Names and control-node ids come from the model response, not from a fixed list.
