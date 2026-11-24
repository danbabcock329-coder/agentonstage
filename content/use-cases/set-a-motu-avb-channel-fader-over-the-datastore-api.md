---
title: "Set a MOTU AVB channel fader over the datastore API"
slug: set-a-motu-avb-channel-fader-over-the-datastore-api
category: "Audio"
tools: ["MOTU AVB", "HTTP"]
difficulty: Intermediate
source_url: https://cdn-data.motu.com/downloads/audio/AVB/docs/MOTU%20AVB%20Web%20API.pdf
labels: ["Commercial product"]
summary: "MOTU's AVB datastore sets mix/chan/0/matrix/fader with a form field named json. The fader is a real from 0 to 4, and index 0 is the first channel."
---

## What it does

MOTU's AVB Datastore API, which the PDF says covers API version 0.0.0, exposes the interface as a key-value store over HTTP. A GET of `/datastore` returns the whole store as JSON. A GET of a subtree returns that subtree. The worked example for the gate on channel 17 is `/datastore/mix/chan/16/gate`, and the text says every index is 0-based. A single key comes back as `{"value": ...}`. The name example is `/datastore/ext/obank/2/name` returning `{"value":"ADAT A"}`.

Writes use PATCH. POST is also accepted, and the PDF says it behaves the same for clients that do not support PATCH. The body is form-encoded. The form field is named `json`, and its contents are a JSON object. A single key uses one field, `value`. The PDF's single-key example sets `ext/obank/2/ch/0/name`. A multi-key example on `/datastore` includes `"mix/chan/0/gate/enable":1`.

The channel fader path is `mix/chan/<index>/matrix/fader`. Its type is real, permission rw, available since mixer version 1.0.0, minimum 0, maximum 4, unit linear. Mute on that channel is `mix/chan/<index>/matrix/mute`, type real_bool. The type section says the bool modifier uses 0 for false and any other value for true. Pan on the same matrix is a real from -1 to 1. The PDF says mixer and I/O paths can differ by model, including across minor versions, and that a client should GET the full datastore first and use the paths that exist on that device. `ext/caps/mixer` is the mixer section's version. If that path is absent, the PDF says the device does not have the mixer paths.

`GET /apiversion` is outside the datastore. The printed curl result is `0.0.0`. The PDF says this text applies to global API versions at or above 0.0.0 and below 1.0.0. The store's ETag counts changes since boot. A GET with `If-None-Match` equal to the current ETag waits up to 15 seconds and then returns 304 if nothing changed. A query parameter `client` is a 32-bit unsigned integer. Changes made with that client id are left out of long-poll GETs that send the same id.

## How to set it up

1. GET `http://<device>/apiversion` and `http://<device>/datastore/ext/caps/mixer`. The document's version example is 0.0.0. If `ext/caps/mixer` is missing, the PDF says the mixer paths are not on that device.
2. GET `/datastore` once and find the channel keys that this model actually has. The channel-17 gate example is `mix/chan/16`. Index 0 is the first channel.
3. Read the fader before writing it: GET `/datastore/mix/chan/0/matrix/fader`. The value is a real. The path's printed range is 0 to 4, unit linear. The PDF does not print a dB table for that range.
4. Set one key with PATCH or POST. The body is form data, field name `json`, and the object is `{"value": ...}` with a real inside 0 to 4. Mute uses `mix/chan/<index>/matrix/mute`. The bool rule in the type section is 0 for false and any other value for true. The gate example writes enable as `1`.
5. Only write paths marked rw. The PDF says clients can change rw parameters. Pass a stable `client` number on the query string if a long poll should ignore this client's own writes. An `If-None-Match` that matches the current ETag is the 15-second wait, then 304.

Source: [MOTU AVB Datastore API](https://cdn-data.motu.com/downloads/audio/AVB/docs/MOTU%20AVB%20Web%20API.pdf).

## FAQ

### Is mix/chan/0 the first channel or channel 0 on the silk?
The PDF says all indices are 0-based, and its gate example calls `mix/chan/16` the gate on channel 17. The first channel is index 0. GET `/datastore` before assuming every index exists on that model.

### Does the fader value 1 mean unity?
The path is typed as a real, unit linear, minimum 0, maximum 4. The PDF does not print a dB equivalent for a point inside that range. The name and gate examples are the ones with literal JSON values.

### Why would a write seem to vanish from a long poll?
The client-id section says PATCH and POST changes made with a given `client` value are filtered out of long-poll GETs that send the same `client`. A GET without that parameter is not described as filtered.
