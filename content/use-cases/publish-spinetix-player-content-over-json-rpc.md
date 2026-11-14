---
title: "Publish SpinetiX player content over JSON-RPC"
slug: publish-spinetix-player-content-over-json-rpc
category: "LED/Video"
tools: ["SpinetiX", "JSON-RPC"]
difficulty: Intermediate
source_url: https://support.spinetix.com/wiki/RPC_API
labels: ["Commercial product"]
summary: "POST one JSON-RPC call to a SpinetiX player's /rpc path. get_info returns model and firmware. add_pull_action publishes a project listing."
---

## What it does

SpinetiX documents an RPC API on its players, added in firmware 2.2.1. A direct call is an HTTP POST to `http(s)://Player_address/rpc`. The body is one JSON-RPC 1.0 object: `method`, `params` (an array, or `[]`), and `id`. Content-Type is `application/json`, UTF-8. One command per request. The response is `result`, `error` (null on success), and the same `id`. From firmware 4.7.1 an error may also include `errorDetails`.

The endpoint is protected by default. The wiki says to send the credentials of a user with the rights the method needs, over HTTP Basic or TLS-SRP. Most methods require admin. A missing login is HTTP 401. A GET of `/rpc`, a Content-Type that is not `application/json`, an empty body, or a body that is not JSON is HTTP 400.

`get_info` reads the player. The wiki's list is serial number, name, model, operation mode, firmware version, firmware status, up time, temperature, storage, and related fields. It was added in 2.2.1 and last modified in the table at 4.8.2. The restart example on the same page is `{"method":"restart","params":[],"id":1}`. A success body is `{"result":{},"error":null,"id":1}`. The command table says `restart` initiates a clean restart one minute after the call. `shutdown` uses the same one-minute delay.

`add_pull_action` sends a Pull Mode action. The wiki's worked example publishes a demo project:

`{"method":"add_pull_action","params":[{"type":"publish","uri":"http://demo.spinetix.com/sample_projects/Office/spx-listing.xml"}],"id":"get office content"}`

The page says that call updates the player with that demo. `pull_status` is not the HTTP response. It is a notification the player sends to an RPC concentrator when a Pull Mode action completes.

## How to set it up

1. POST to `http(s)://Player_address/rpc` with Content-Type `application/json`. Send HTTP Basic or TLS-SRP for an admin user. Do not open `/rpc` in a browser. The wiki says a GET returns 400.
2. Send `{"method":"get_info","params":[],"id":1}` first. Read `error`. It is null on success. The result carries the serial, name, model, mode, and firmware fields the wiki lists. Keep the `id` so you can match the reply.
3. Publish with `add_pull_action`. The documented example uses `"type":"publish"` and the Office demo listing URI above, and the wiki says that URI is what gets published. Replace `uri` with the listing of the project you mean to put on the screen.
4. Treat a null `error` as acceptance of the call, not as proof the new content is already on the output. Completion is the `pull_status` notification to a concentrator, which a direct POST response does not include.
5. Do not send `restart` or `shutdown` to test the connection. Both wait one minute, then restart or shut the player down. `get_info` is the read.

Source: [SpinetiX RPC API](https://support.spinetix.com/wiki/RPC_API).

## FAQ

### Why does `/rpc` fail in a browser?
The errors section says a GET of `/rpc` returns 400. The call has to be POST, Content-Type `application/json`, one JSON object. A login that lacks rights returns 401.

### Which firmware has `get_info`?
The command table says `get_info` was added in firmware 2.2.1. The wiki says the last document revision that applies to legacy players is 2.3. This page's examples are the current RPC API.

### Does `add_pull_action` wait until the project is on screen?
The direct response is the JSON-RPC result for the call. The wiki describes `pull_status` as a later notification to the RPC concentrator, sent when the Pull Mode action completes. The example `uri` is SpinetiX's Office demo. That is the project the documented call publishes.
