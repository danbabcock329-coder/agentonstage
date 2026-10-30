---
title: "Cut mimoLive layers over the HTTP API"
slug: cut-mimolive-layers-over-the-http-api
category: "LED/Video"
tools: ["mimoLive", "HTTP"]
difficulty: Intermediate
source_url: https://mimolive.com/user-manual/remote-control-automation/http-api/
labels: ["Commercial product"]
summary: "mimoLive's HTTP API on port 8989 lists the open document and its layers, then setLive, setOff, or a layer-set recall changes what is on air."
---

## What it does

Boinx documents a JSON:API HTTP server inside mimoLive, separate from the Remote Control web UI. Turn it on with Allow Remote Control Access in the Remote Control preferences. The server listens on port 8989, on `localhost` and on the machine's `.local` name. Every call is under `/api/v1/`. `GET http://localhost:8989/api/v1/documents` lists the open documents.

Document, layer, source, and output-destination IDs are stored with the document. The examples page says hard-coding them is safe while you keep that same document. Removing a layer and adding it again assigns a new layer ID. Reordering layers, or adding variants, leaves the layer ID alone.

`POST` or `GET` `.../documents/(DocumentID)/setLive` starts the show and triggers the associated events. The same path with `setOff` stops it, and `toggleLive` flips it. Calling `setLive` on a show that is already running is not an error. `setOff` on an already stopped show is not an error either. A document can keep running after `setOff`, and the returned state can be `shutdown` rather than `off`.

A layer uses the same three verbs. `.../layers/(LayerID)/setLive` activates the layer on its last selected variant. `setOff` deactivates it. The layer may answer `shutdown` while an exit animation plays. `toggleLive` flips between live and off. Calling `setLive` on a layer that is already live is not an error. From mimoLive 5.5, a right-click on the layer copies the API endpoint, and a right-click on the Live button copies the full URL that sets the layer live.

Layer sets, added in mimoLive 5.0, store a live, off, or force-off action per layer. `POST .../layer-sets/(LayerSetID)/recall` runs that set. The response is the layer set with `active` true.

Since mimoLive 3.1, a password in preferences has to travel as the SHA-256 hex of the UTF-8 password. Send it in the header `X-MimoLive-Password-SHA256`, or as the query `pwSHA256`. The Remote Controls pane shows that API key so you can copy it. The older cleartext header `X-MimoLive-Password` and the `pw` query still work, and the manual says they are discouraged because they send the password in the clear.

The manual says putting this server on a public IP is a bad idea, because the API is not very well protected, and points at a tunnel such as ngrok when you need to reach it from outside the venue LAN.

A `PUT` to the layer URL can change a name, a volume, or `input-values`. Volume arrived in mimoLive 5.6. It is clipped to `0..1` and ignored on older versions or on a layer with no volume control. The examples page sets a lower-third title with `{"input-values":{"tvGroup_Content__Title":"My new title"}}`.

## How to set it up

1. Open Remote Control preferences, enable Allow Remote Control Access, and copy the base URL. The examples page shows `http://172.28.30.202:8989` with no trailing backslash. The API access section serves port 8989.
2. `GET http://127.0.0.1:8989/api/v1/documents` and note the document ID of the show that is actually open. Right-click the layer and copy its API endpoint. Paste that path after the base URL.
3. If a password is set, hash it the way the preferences pane already did, and send `X-MimoLive-Password-SHA256` with that hex string. Leave the cleartext `pw` query unused.
4. Take the layer live with the manual's shape of request. One published example is `curl http://172.28.30.202:8989/api/v1/documents/458706932/layers/BA868701-8131-49CB-8EDD-8C7E6E7CD60B/setLive`. `setOff` and `toggleLive` sit on the same URL. Read the returned state. `shutdown` means an exit animation is still running. Start the document itself with `.../documents/(DocumentID)/setLive` when the show should be on air.
5. Recall a saved layer set with `POST .../layer-sets/(LayerSetID)/recall`. Copy that ID from the layer set in the document. A layer you deleted and recreated has a new ID, so a stored URL from the old layer will miss.

Source: [mimoLive HTTP API](https://mimolive.com/user-manual/remote-control-automation/http-api/), [examples of API usage](https://mimolive.com/user-manual/remote-control-automation/http-api/examples-of-api-usage/), and [endpoints](https://mimolive.com/user-manual/remote-control-automation/http-api/endpoints/).

## FAQ

### Does setLive fail when the layer is already on?
The endpoints page says calling `setLive` on an already active layer does not return an error. The same is true of `setLive` on a document that is already running.

### Can this port face the public internet?
The HTTP API page says exposing it with a public IP is a bad idea, because the API is not very well protected. It points at a tunnel such as ngrok for access from outside the local network.

### Does a rebuilt layer keep its ID?
The examples page says removing a layer and adding it again gives that layer a different ID. Reordering layers, or adding variants, leaves the ID in place.
