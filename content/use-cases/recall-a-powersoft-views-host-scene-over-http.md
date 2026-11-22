---
title: "Recall a Powersoft Views Host scene over HTTP"
slug: recall-a-powersoft-views-host-scene-over-http
category: "Audio"
tools: ["Powersoft Views Host", "ArmoniaPlus", "HTTP"]
difficulty: Intermediate
source_url: https://audiobrains.com/data/powersoft/others/views-host_api_1.13.pdf
labels: ["Commercial product"]
summary: "Powersoft Views Host Rev 1.13 recalls a scene with PUT /scene/active/{id}. ArmoniaPlus serves that API on port 40469. Zone gain is linear, from 0 to 1."
---

## What it does

Powersoft's Views Host API, revision 1.13, dated 19 March 2021, describes the HTTP API of the Views Host server for the Dynamic Music Distribution system. The server talks to Powersoft amplifiers with DSP+D. The models named are Mezzo, Otto, Quattro, Duecanali, X, and T series. The client sends commands. The server forwards them to the amplifiers.

The port depends on which program is the host. ArmoniaPlusService uses port 40469. ViewsHostService on a PC uses port 80. WM Touch uses port 80. A busy server answers HTTP 503 until it is free. A normal result is HTTP 200 and a JSON body with `Code`, `Message`, and, on the GETs that read a value, `Result`. `Code` 0 is status OK. `Code` 1 is DOWN, meaning at least one device is offline or unreachable. `Code` 2 is DIFFERENT CONFIGURATION, meaning at least one device has been reset. The document does not print an authentication scheme.

`GET /scene/active` returns the active scene id in `Result`. `PUT /scene/active/SceneID` makes that id the active scene. The printed message is `Current scene ID is SceneID`. `GET /scene/list` returns scene records with `Id`, `Name`, and `Index`. The sample index is 1 and the sample name is `Scene Name`. `GET /scene` reads the current scene parameters and requires an `Accept` header of `application/json`.

Zone level is separate from the scene recall. `GET /zone/gain/ZoneID` reads it. `PUT /zone/gain/ZoneID/ZoneLevel` sets it. `ZoneLevel` is a linear value from 0 to 1. The printed message is `For zone ZoneID is set gain to ZoneLevel`. Mute is `GET /zone/mute/ZoneID`, with `Result` false for unmuted and true for muted, and `PUT /zone/mute/ZoneID/MuteStatus` with 0 unmuted and 1 muted. System power is `GET /power`, where `Result` true means the system is on, and `PUT /power/PowerState` with 0 for off and 1 for on.

A websocket is on a second port. ArmoniaPlusService uses 40470. ViewsHostService and WM Touch use 80. The connection URL has to include `clientId` and at least one protocol, or the document says the connection is refused. The printed example is `ws://<server_ip>:<websocket_port>/?clientId=<guid_client>&protocols=StateUpdate&protocols=PingPong`. `PINGPONG` uses the payload `__ping__` and the server replies `__pong__`. `STATEREQUEST` with the payload `request` returns the full current state. `STATEUPDATE` pushes changes, and a client that connects with it receives a full state first.

## How to set it up

1. Confirm which host is running. Use port 40469 when the system is on ArmoniaPlus. Use port 80 when the host is ViewsHostService or WM Touch. If the answer is HTTP 503, the document says to wait and send the request again.
2. Send `GET /scene/list` and `GET /scene/active`. Keep the `Id` and `Name` of the scene you mean to recall. Read `Code` before treating `Result` as the scene. Code 1 means a device is down. Code 2 means a device configuration differs.
3. Recall with `PUT /scene/active/` plus that id. Read `/scene/active` again. The printed success message is `Current scene ID is SceneID`.
4. Set a zone only after reading `/zone/gain/ZoneID`. Write a linear value from 0 to 1 with `PUT /zone/gain/ZoneID/ZoneLevel`. Mute with `PUT /zone/mute/ZoneID/1` and unmute with `/0`. The GET reports mute as a boolean. The PUT takes 0 or 1.
5. Leave `PUT /power/0` off an unattended client. The document defines 0 as system off and 1 as system on. Read `GET /power` first. `Result` true is on.

Source: [Powersoft Views Host API, Rev 1.13, March 2021](https://audiobrains.com/data/powersoft/others/views-host_api_1.13.pdf).

## FAQ

### Does every host use port 40469?
ArmoniaPlusService does. The document assigns port 80 to ViewsHostService and to WM Touch. The websocket port for ArmoniaPlusService is 40470, and the other two hosts use 80 for the websocket as well.

### What does Code 2 mean?
DIFFERENT CONFIGURATION. The document says at least one device has been reset. Code 0 is OK. Code 1 is DOWN, at least one device offline or unreachable. HTTP 503 is the separate busy reply and is not one of those JSON codes.

### Is zone gain in decibels?
The zone-level section says `ZoneLevel` is a linear value between 0 and 1. It does not print a dB scale for that field. Mute is a different endpoint, `/zone/mute/ZoneID`.
