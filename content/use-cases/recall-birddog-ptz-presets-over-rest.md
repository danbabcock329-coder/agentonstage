---
title: "Recall BirdDog PTZ presets over REST"
slug: recall-birddog-ptz-presets-over-rest
category: "LED/Video"
tools: ["BirdDog", "HTTP"]
difficulty: Intermediate
source_url: https://birddog.tv/AV/API/
labels: ["Commercial product"]
summary: "BirdDog REST API 2.0 recalls a preset with a JSON POST to port 8080. The documented names run from Preset-1 through Preset-9 on the P and A camera columns."
---

## What it does

BirdDog's published page is titled BirdDog RESTful API 2.0. The PTZ section documents preset recall, preset save, and pan, tilt, and zoom speed. The recall sample is an HTTP POST to `http://192.168.2.197:8080/recall` with `Content-Type: application/json` and the body `{"Preset":"Preset-1"}`. The page's one-line description is "This command will recall preset." The JavaScript sample treats HTTP 200 as the success check and logs the response text. The example status body on that same section is `{"Preset":"Preset-1"}`.

The parameter note says `Preset` is a string of the form `Preset-1`, with a range from 1 to 9. Save uses the same JSON on `http://<address>:8080/save`. The page's description of that call is "This command will save preset."

The device-support table on the recall and save rows marks YES for BirdDog P200 A2/A3, P200 A4/A5, A200 Gen1, A200 Gen2, A300 Gen1, A300 Gen2, P100, PF120, P400, P4k, P110, P120, and P240. The same row does not mark YES for Studio, Mini, Flex Encode, Flex Decode, WP Encode, WP Decode, 4K HDMI/SDI, or QUAD.

Speed is a different call, `/birddogptzsetup`. The POST sample sends `{"PanSpeed":"8","TiltSpeed":"8","ZoomSpeed":"4"}` to port 8080, and the example status body is that same object. On the camera columns that list numbers, pan is 0 to 21, tilt is 0 to 18, and zoom is 0 to 7. PF120 is the exception: its pan and tilt cells say `none`, and its zoom cell says 0 to 8. The GET sample is `http://192.168.2.197:8080/birddogptzsetup` and reads the three speeds back.

The same API page documents `/reboot` and `/restart`. This entry does not call them.

## How to set it up

1. Use a camera column the recall row marks YES. Open `http://<camera>:8080/birddogptzsetup` with GET and read `PanSpeed`, `TiltSpeed`, and `ZoomSpeed` before you change motion.
2. Recall a stored shot with POST `http://<camera>:8080/recall`, header `Content-Type: application/json`, and body `{"Preset":"Preset-N"}`. Keep N inside 1 to 9. The page's own example is `Preset-1`.
3. Treat HTTP 200, and a body that echoes the preset you named, as the call the sample shows. The page does not document a separate position readout on this call.
4. Change speed only after the GET. POST `/birddogptzsetup` with all three fields as strings. Stay inside the table: pan 0-21, tilt 0-18, and zoom 0-7, except PF120, where pan and tilt say `none` and zoom is 0-8.
5. Do not POST `/save` from an unattended session. The page describes that call as saving the preset. Leave `/reboot` and `/restart` unused.

Source: [BirdDog RESTful API 2.0](https://birddog.tv/AV/API/).

## FAQ

### What preset names are in the API page?
The recall parameter is the string `Preset-1`, and the note says the range is 1 to 9. The curl sample posts `{"Preset":"Preset-1"}` to port 8080.

### Which BirdDog units does the table mark?
The recall and save rows mark YES on the P200, A200, A300, P100, PF120, P400, P4k, P110, P120, and P240 columns. Studio, Mini, Flex, WP, 4K HDMI/SDI, and QUAD are not marked YES on that row.

### Are the speed numbers sent as integers?
The POST sample sends them as JSON strings, for example `"PanSpeed":"8"`. The GET sample reads the same three fields back. PF120's pan and tilt cells say `none`, and its zoom cell says 0 to 8.
