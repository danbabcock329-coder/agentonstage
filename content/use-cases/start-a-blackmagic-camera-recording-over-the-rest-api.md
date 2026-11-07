---
title: "Start a Blackmagic camera recording over the REST API"
slug: start-a-blackmagic-camera-recording-over-the-rest-api
category: "LED/Video"
tools: ["Blackmagic Camera", "REST"]
difficulty: Intermediate
source_url: https://documents.blackmagicdesign.com/DeveloperManuals/RESTAPIforBlackmagicCameras.pdf
summary: "Blackmagic's August 2025 camera REST API records with POST /transports/0/record after the web media manager is enabled. HTTP 204 means it started."
---

## What it does

Blackmagic's REST API for Blackmagic Cameras, dated August 2025, is the developer note for controlling a compatible camera over the network. The note says the web media manager has to be enabled on each camera, in Blackmagic Camera Setup under network access. Commands are sent to `/control/api/v1/` on the camera's web media manager URL or IP address. The note's example is `https://ursa-broadcast-g2.local/control/api/v1/`. The URL and IP are shown in Camera Setup. Adding `/control/documentation.html` to that host downloads the REST YAML from the camera. The note says changing the camera name in Camera Setup also changes the web media manager URL.

The compatible list in the note is URSA Cine 12K LF, URSA Cine 17K 65, URSA Cine Immersive, PYXIS 6K, Cinema Camera 6K, URSA Broadcast G2, Micro Studio Camera 4K G2, Studio Camera 4K Plus, Studio Camera 4K Pro, Studio Camera 6K Pro, Studio Camera 4K Plus G2, and Studio Camera 4K Pro G2.

Transport is under `/transports/0`. `GET /transports/0` returns JSON with `mode`. The note's possible values are InputPreview, InputRecord, and Output. `GET /transports/0/record` returns `recording`, true when the transport is in InputRecord. `POST /transports/0/record` starts recording. An optional `clipName` string names the clip. Success is 204. Failure is 400. `PUT /transports/0/record` is marked deprecated in favor of that POST. The PUT body uses a required `recording` boolean, true to start and otherwise stop, plus an optional `clipName` when recording is true.

`POST /transports/0/stop` stops the transport and returns 204. The matching PUT is deprecated. `POST /transports/0/play` starts playback and returns 204, or 400 if it failed. `GET /transports/0/playback` returns `type` (Play, Jog, Shuttle, or Var), `loop`, `singleClip`, `speed` (1.0 for normal forward playback), and `position` in video frames, where 0 is the first frame of the timeline. `GET /transports/0/clipIndex` returns the 0-based index of the clip playing on the timeline, or null when there is no timeline or the timeline is empty. `GET /clips` lists clips on the active disk, including `filePath`, `codec`, `container`, frame rate, and start and duration timecode. No active disk is 404.

Livestream control is separate. `GET /livestreams/0` returns `status`. The note's values are Idle, Connecting, Streaming, Flushing, and Interrupted. It also returns `bitrate` in bits per second, `effectiveVideoFormat`, and, when the stream is not idle, `duration` in seconds. `PUT /livestreams/0/start` starts the livestream and returns 204. `PUT /livestreams/0/stop` stops it and returns 204.

## How to set it up

1. In Blackmagic Camera Setup, enable the web media manager under network access. Read the web media manager URL from that screen. If you rename the camera later, read the URL again.
2. `GET https://<camera>/control/api/v1/transports/0` and read `mode` before you change anything. `GET /transports/0/record` is the recording boolean. `GET /clips` lists what is already on the active disk. A 404 there means there is no active disk.
3. Start a recording with `POST /control/api/v1/transports/0/record`. Add `clipName` when the clip needs a specific name. Treat 204 as started and 400 as failed. Read `/transports/0` again and wait until `mode` is InputRecord.
4. Stop with `POST /transports/0/stop` and expect 204. Use `POST /transports/0/play` for playback. The note marks the PUT forms of record, stop, and play as deprecated.
5. For a livestream, `GET /livestreams/0` first. `PUT /livestreams/0/start` returns 204 when the stream starts, and `PUT /livestreams/0/stop` returns 204 when it stops. The same GET shows Idle, Connecting, Streaming, Flushing, or Interrupted.

Source: [REST API for Blackmagic Cameras, August 2025](https://documents.blackmagicdesign.com/DeveloperManuals/RESTAPIforBlackmagicCameras.pdf).

## FAQ

### Which cameras are in this note?
The note lists URSA Cine 12K LF, URSA Cine 17K 65, and URSA Cine Immersive, PYXIS 6K, Cinema Camera 6K, URSA Broadcast G2, Micro Studio Camera 4K G2, and the Studio Camera 4K Plus, 4K Pro, 6K Pro, 4K Plus G2, and 4K Pro G2.

### What is the difference between POST and PUT for record?
`POST /transports/0/record` is the call the note says to use. It starts a recording, with an optional `clipName`, and returns 204 or 400. `PUT /transports/0/record` is marked deprecated. That PUT takes a required `recording` boolean.

### Where is the full route list for this camera?
The note says to add `/control/documentation.html` to the camera's web media manager URL. That page is the YAML documentation downloaded from the camera.
