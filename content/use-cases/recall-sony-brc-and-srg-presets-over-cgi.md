---
title: "Recall Sony BRC and SRG presets over CGI"
slug: recall-sony-brc-and-srg-presets-over-cgi
category: "LED/Video"
tools: ["Sony BRC-X400", "Sony SRG", "HTTP"]
difficulty: Intermediate
source_url: https://pro.sony/support/res/manuals/E776/ba2eb983d7ce445ab18afc783c068418/E7761001M.pdf
labels: ["Commercial product"]
summary: "Sony's CGI command list, software version 3.10, recalls a BRC or SRG preset over HTTP Digest after HTTP/RTSP is enabled and the admin password is changed."
---

## What it does

Sony's CGI command list, software version 3.10, document E-776-100-14 (1), covers the BRC-X400, BRC-X401, SRG-X400, SRG-X402, SRG-201M2, SRG-X120, and SRG-HD1M2. CGI and RTSP stay off until HTTP/RTSP is enabled. The list gives two ways. Set CAMERA SETUP switch 3 on the back of the camera to ON, then power the camera off and on. Or, on the OSD SYSTEM menu reached from HDMI or SDI, set HTTP/RTSP to ON and power-cycle. If switch 3 is ON, the list says HTTP/RTSP works regardless of the OSD setting.

The default IP address in the list is 192.168.0.100. RM-IP Setup Tool sets the address for the network. The same note says the tool cannot turn DHCP on, and that the camera ignores the tool when `IPSetupSetEnable` is off. The web admin page can also set the address.

The first browser login uses the default admin username `admin` and password `Admin_1234`. The list says that password has to be changed before the camera will continue, by typing the default into Current password and confirming the new one. CGI uses HTTP Digest authentication as defined in IETF RFC 2617. A request without credentials is answered HTTP 401, and the client is supposed to retry with the header. The list says repeated authentication errors from the same computer can be treated as a brute-force attack.

Referer check is on by default, and it limits CGI to the camera's own web page. With the check left on, the list says to send `Referer: http://<camera_address>/` when the HTTP port is 80. The check can be changed under Security, Referer check.

A set is GET or POST to `http://<camera_address>/command/<name>.cgi`, with parameters as `name=value` joined by `&`. An inquiry is `http://<camera_address>/command/inquiry.cgi?inq=<name>`. The standard inquiry response is HTTP/1.0 200, `Content-Type: text/plain`, then `name=value` pairs joined by `&`.

`presetposition.cgi` stores and recalls positions. `PresetNum` is an inquiry and the list's value is 256. `PresetName` on inquiry returns every registered preset as number, name pairs. A name is 32 characters or fewer and alphanumeric. `PresetCall` takes the preset number, 1 to 256, and an optional pan/tilt speed, 1 to 25. The list says a larger speed number is faster, and that an omitted speed uses 25. That second value applies when `SpeedSelect` is `compatible`. `SpeedSelect` can instead be `separate`, which uses the per-preset `SeparateSpeed`, or `common`, which uses `CommonSpeed`. `CallMode` is `freeze` or `normal`: freeze holds a still while the preset runs, normal does not.

`HomePos=recall` moves pan and tilt to the home coordinate, pan `0000` and tilt `0000`. The list says that coordinate cannot be changed. `PresetSet` writes the current pan, tilt, focus, zoom, and camera settings into a preset number. `PresetClear` deletes one. On the BRC-X400 and BRC-X401, `PresetMode` is `std` (position plus camera settings), `ptzfonly` (position only), or `trace` (PTZ trace driven by the same preset commands).

`ptzf.cgi` inquiry `PtzfStatus` returns four words, for pan, tilt, zoom, and focus. Each word is `idle`, `moving`, or `unknown`. The list calls `unknown` an abnormal status.

## How to set it up

1. Enable HTTP/RTSP with CAMERA SETUP switch 3 or the OSD SYSTEM menu, then power-cycle the camera. Confirm the address. The list's default is 192.168.0.100. Change `admin` / `Admin_1234` on the first web login before any CGI.
2. Send Digest credentials on the 401. If Referer check is still on, add `Referer: http://<camera_address>/`. Do not repeat a failed login. The list says repeated failures can be treated as a brute-force attack.
3. GET `inquiry.cgi?inq=presetposition` and read `PresetName` and `PresetNum`. Match the shot you want to a number that is actually registered.
4. GET or POST `presetposition.cgi?PresetCall=<number>` to recall it. Add a speed, such as `PresetCall=4,8`, only when `SpeedSelect` is `compatible`. A larger second number is faster. The list says an omitted speed uses 25.
5. Poll `inquiry.cgi?inq=ptzf` until `PtzfStatus` is `idle` for pan, tilt, zoom, and focus. Leave `PresetSet`, `PresetClear`, and trace recording out of an unattended pass. `HomePos=recall` is the documented return to pan `0000`, tilt `0000`.

Source: [BRC-X400/X401 and SRG CGI Command List, software version 3.10](https://pro.sony/support/res/manuals/E776/ba2eb983d7ce445ab18afc783c068418/E7761001M.pdf), document E-776-100-14 (1).

## FAQ

### Which cameras does this list cover?
The overview names the BRC-X400, BRC-X401, SRG-X400, SRG-X402, SRG-201M2, SRG-X120, and SRG-HD1M2. `PresetMode` and PTZ trace are marked for the BRC-X400 and BRC-X401.

### What is the preset speed range?
`PresetCall`'s optional second value is 1 to 25, and the list says a bigger number is faster. It is used when `SpeedSelect` is `compatible`. `separate` uses `SeparateSpeed` for that preset number. `common` uses `CommonSpeed` for every preset.

### Does the camera answer CGI before the password change?
The preparation section says the first web access, while the default admin password is unchanged, has to set a new admin password. CGI then uses Digest authentication, and a missing credential is HTTP 401.
