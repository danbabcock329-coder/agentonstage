---
title: "Recall PTZOptics camera presets over HTTP"
slug: recall-ptzoptics-camera-presets-over-http
category: "LED/Video"
tools: ["PTZOptics", "HTTP"]
difficulty: Intermediate
source_url: https://docs.ptzoptics.com/dev/guides/http-api-getting-started/
labels: ["Commercial product"]
summary: "PTZOptics documents camera CGI commands for home, pan, tilt, and presets. Digest auth applies when it is enabled, and a speed-qualified POST is the page that says it calls a preset."
---

## What it does

PTZOptics publishes an HTTP API of CGI paths and query strings. The getting-started guide says the examples are the request the camera receives, and that they are intentionally not a conventional REST API. If HTTP Authentication is enabled, the guide says to use HTTP Digest with the camera credentials. If it is disabled, omit the digest user. The guide also says to confirm the camera model supports the command, because the reference pages list different models.

The choosing-a-protocol guide offers this HTTP API for web requests, and VISCA bytes for serial, TCP, or UDP. It says network VISCA commonly uses TCP port 5678 or UDP port 1259, and that those ports are camera settings. This entry stays on the HTTP commands.

Home is a GET of `/cgi-bin/ptzctrl.cgi?ptzcmd&home`. The home page says that moves the camera to the home position. Its compatibility list is Move 4K, Link 4K, Move SE, and Studio Pro.

Pan and tilt are on `/cgi-bin/ptzctrl.cgi?ptzcmd&...`. The pan/tilt page's example for up and to the right at pan speed 15 and tilt speed 13 is `ptzcmd&rightup&15&13`. The same page shows `ptzcmd&rightup` with the speeds omitted, which it calls default speeds. Compatibility on that page is Move 4K, Link 4K, and Move SE. The page's examples start a direction. This entry does not have a separate stop command from that page, so a client should not send `rightup` and assume a later request will cancel it.

Stored presets are a different page. Preset Commands says the values are 0–89 and 100–254, lists Move 4K, Link 4K, Move SE, Studio Pro, and Studio 4K, and shows `ptzcmd&posset&1` under the sentence "Move camera to a designated position and enter posset for preset value 1." The function line on that page says the command sets or calls. The only example is `posset`.

The page that states a recall is Preset Commands with Speed. It says the function calls a camera position from a preset at specified pan, tilt, and zoom speeds. The example is a POST with an empty body and `Content-Length: 0`:

`/cgi-bin/ptzctrl.cgi?post_preset&poscallwithspeed=1&panspeed=10&tiltspeed=10&zoomspeed=5`

Compatibility matches the preset page, including Studio 4K. Absolute position is yet another command, `ptzcmd&abs&15&10&0200&0200`, and that page lists only Move 4K and Link 4K. The example text says pan position 0200 is right and tilt position 0200 is up.

Pan/Tilt Reset is `param.cgi?pan_tiltdrive_reset`. The page describes it as the command to send when the camera is not returning to the factory home position. That is a mechanism reset, not a preset recall.

## How to set it up

1. Read the camera's IP and whether HTTP Authentication is on. The [getting-started guide](https://docs.ptzoptics.com/dev/guides/http-api-getting-started/) uses Digest when authentication is enabled and says to omit `--digest` and `--user` when it is not.
2. On a camera in the home page's list, GET `http://<camera>/cgi-bin/ptzctrl.cgi?ptzcmd&home` and confirm the camera returns to the home position you stored. The reference says a succeeded request is HTTP 200.
3. Recall a known preset with the POST on the [Preset Commands with Speed](https://docs.ptzoptics.com/dev/http-api/movement/preset-commands-with-speed-post-preset-with-speed/) page, including `Content-Length: 0`. Start with a slow speed triple you have already watched, not with a guessed preset number.
4. Open the command's own compatibility list before you send it. Home, pan/tilt, presets, and absolute position do not name the same models.
5. Do not put `param.cgi?pan_tiltdrive_reset` or a bare direction such as `rightup` on an unattended client. Reset is the factory-home recovery command, and the pan/tilt examples start motion.

Source: [HTTP API getting started](https://docs.ptzoptics.com/dev/guides/http-api-getting-started/), [home](https://docs.ptzoptics.com/dev/http-api/movement/home-preset-command-get-home-command/), [pan/tilt](https://docs.ptzoptics.com/dev/http-api/movement/pan-tilt-routes-get-pan-tilt/), [presets](https://docs.ptzoptics.com/dev/http-api/movement/preset-commands-get-preset-command/), [preset recall with speed](https://docs.ptzoptics.com/dev/http-api/movement/preset-commands-with-speed-post-preset-with-speed/), and [VISCA or HTTP](https://docs.ptzoptics.com/dev/guides/choosing-a-control-protocol/).

## FAQ

### Does posset recall a preset?
The preset page says the command sets or calls, and its only example is `ptzcmd&posset&1` described as moving to a designated position. The page that says "calls camera position from preset" is the speed POST, `poscallwithspeed`. Use that POST when the goal is a recall.

### Will every PTZOptics body accept every URL?
No. The home list includes Studio Pro and leaves Studio 4K off. The pan/tilt list is Move 4K, Link 4K, and Move SE. Absolute position is Move 4K and Link 4K. Read the list on the command you are about to send.

### Is VISCA the same URL?
No. The protocol guide says VISCA is command bytes ending in `FF`, commonly TCP 5678 or UDP 1259, and that the port configured on the camera is the one that counts.
