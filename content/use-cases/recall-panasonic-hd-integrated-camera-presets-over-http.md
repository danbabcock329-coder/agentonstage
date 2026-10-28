---
title: "Recall Panasonic HD integrated camera presets over HTTP"
slug: recall-panasonic-hd-integrated-camera-presets-over-http
category: "LED/Video"
tools: ["Panasonic AW-HE", "Panasonic AW-UE70", "HTTP"]
difficulty: Intermediate
source_url: https://ap.connect.panasonic.com/sites/default/files/media/document/2019-02/HDIntegratedCamera_InterfaceSpecifications-V1.07E.pdf
labels: ["Commercial product"]
summary: "Panasonic's HD integrated-camera spec v1.07 recalls presets over HTTP. Leave 130 ms between commands, and do not poll settings that write the EEPROM."
---

## What it does

Panasonic's HD Integrated Camera Interface Specifications, version 1.07, dated January 10, 2017, is the Ethernet command set for the cameras named in its introduction. The applicable models are the AW-HE50 series (Ver.2 functions need the AW-HEF5 upgrade), AW-HE120 series, AW-HE60 series, AW-HE130 series, AW-HE40 series, AW-HE65 series, AW-HE70 series, AW-UE70 series, and AK-UB300 series. AW-SFU01 features apply when that software is activated. The spec does not list later bodies such as the AW-UE150. Many preset and power commands are marked not supported by the AK-UB300.

Pan-tilt commands are HTTP/1.1:

`http://[IP Address]/cgi-bin/aw_ptz?cmd=[Command]&res=1`

The response is HTTP 200 with the command value in the body. A `#` in the command has to be percent-encoded as `%23` for some clients. The stop example is `http://192.168.0.10/cgi-bin/aw_ptz?cmd=%23PTS5050&res=1`, and the body is `pTS5050`.

Camera commands use `http://[IP Address]/cgi-bin/aw_cam?cmd=[Command]&res=1`. `res` is normally 1. The spec says it is 0 for the AWB command `OWS` and the ABB command `OAS`, and that those two then have no HTTP body. Their result arrives as an update notification.

Restrictions in the pan-tilt section: leave at least 130 ms between commands. At most 72 HTTP sessions at once. At most 5 terminals can receive update notifications at once, and a connected AW-RP50 counts as one. Keep-Alive cannot be set. Connect and disconnect happen on every command. The camera-control section repeats the 130 ms gap. Both sections say not to send setting changes on a timer. The models store settings in EEPROM, each change writes it, and the spec says the camera will stop operating normally once the write limit is reached.

Preset playback is `#R` plus two digits. The table maps `00` to Preset 001 and `99` to Preset 100. The response is `s` plus those digits. The printed example for playing Preset 12 is `http://192.168.0.10/cgi-bin/aw_ptz?cmd=%23R11&res=1` with body `s11`. Registering Preset 08 is `%23M07` and body `s07`. `#S` asks for the preset number last played. The table says that after presets have been played back, completion is notified in the `q**` form. Power on, which the spec marks unsupported on the AK-UB300, is `%23O1` and the example body is `p1`. `#O0` is standby. A power query can return `3`, "Transferring from Standby to ON", on the AW-HE120, AW-HE130, AW-HE40, AW-HE65, AW-HE70, and AW-UE70.

Errors are ER1, ER2, or ER3. The introduction says one of those is returned when a command fails, and also when an AWB result contains an error.

## How to set it up

1. Use a camera on the v1.07 applicable list. Put the client on the camera network. Do not point this command set at an AW-UE150 and assume the same CGI. That model is not in this document.
2. Send one read, then wait at least 130 ms before the next command. The power query uses the same `aw_ptz` URL with `cmd=%23O`. The table's response is `p0` for standby, `p1` for power on, and `p3` while some models are transferring from standby to on.
3. Ask which preset played last: `cmd=%23S&res=1`. The response is `s` and two digits, `00` through `99`.
4. Recall a known preset with `%23R` and those two digits. Preset 12 in the spec's example is `%23R11`. Wait for the `s` response, then for the `q**` completion notification the table describes. Stop a move with `%23PTS5050`.
5. Do not poll `#M` (store preset), installation, or other setting writes. The spec says each one writes EEPROM. Leave `%23O0` and `%23O1` to a person standing at the camera. Power is marked unsupported on the AK-UB300, and so is preset playback.

Source: [HD Integrated Camera Interface Specifications, version 1.07 (January 10, 2017)](https://ap.connect.panasonic.com/sites/default/files/media/document/2019-02/HDIntegratedCamera_InterfaceSpecifications-V1.07E.pdf).

## FAQ

### Which number is Preset 1?
The table says data `00` is Preset 001 and data `99` is Preset 100. The playback example for Preset 12 sends `#R11`. Subtract one from the preset number and write two digits.

### Can I hold the HTTP connection open?
The pan-tilt restrictions say Keep-Alive cannot be set, and that connect and disconnect happen for every command. They also cap the camera at 72 simultaneous HTTP sessions.

### Does this cover the AW-UE150?
Not this document. Version 1.07 names the HE50, HE120, HE60, HE130, HE40, HE65, HE70, UE70, and UB300 series. Check a later interface spec before you send these commands to a newer body.
