---
title: "Take an Analog Way Midra screen over AWJ"
slug: take-an-analog-way-midra-screen-over-awj
category: "LED/Video"
tools: ["Analog Way Midra 4K", "AWJ", "TCP"]
difficulty: Intermediate
source_url: https://dwn01.analogway.com/Site+Internet/Series/Midra+4k/Common/AWJ+Protocol/midra_4k_awj_programmers_guide_v3.2.pdf
labels: ["Commercial product"]
summary: "Midra 4K AWJ is JSON Patch on TCP port 10606, ended by byte 0x04. Up to five clients can connect. A screen take sets xTake true and returns no string."
---

## What it does

Analog Way's Midra 4K AWJ Programmer's Guide v3.2 is the JSON Patch protocol for the Midra 4K seamless switchers. The cover says firmware v2.0.20 or higher. Section 1.1 says firmware v2.0 or higher. The transport is TCP port 10606. Up to five TCP clients can be connected. The guide says to confirm that security on the Web RCS has not disabled the port, and that a firewall is not blocking it.

Each command is one JSON object and ends with ASCII byte `0x04`. It has exactly one `op`, which is `get` or `replace`, and exactly one `path`. A write also has exactly one `value`. The guide's shape is `{"op": "replace", "path": "/a/b/c", "value": "foo"}` plus `0x04`. A read answer has `path` and `value` and the same terminator. A failed command returns an `error` object. The codes the guide lists are E09 (unexpected JSON token), E10 (keywords other than `op`, `path`, and `value`), E11 (an operator other than `get` or `replace`), E12 (unexpected path), and E13 (unexpected value).

The device-type read is `{"op":"get","path":"DeviceObject/system/@props/dev"}` plus `0x04`. The worked answer value is `ZEN200`. The possible-values list printed under that answer is `EIKOS` for Eikos 4K, `PULSE` for Pulse 4K, `QMX` for QuickMatrix 4K, and `QVU` for QuickVu 4K. `ZEN200` is not in that list. The firmware read path is `DeviceObject/system/version/@props/updater`, and the example value is `3.0.17`.

Subscriptions start empty, so a client does not hear state changes until it replaces `Subscriptions` with a list of path prefixes. A direct `get` of a property is never filtered. The screen-1 take is `{"op":"replace","path":"DeviceObject/transition/$screen/@items/1/control/@props/xTake","value":true}` plus `0x04`, and the guide says the device returns no string. Auxiliary 1 uses `$auxiliaryScreen` in that take path. Recalling screen preset 33 to preview on screen 1 sets `xRequest` true at `DeviceObject/preset/bank/control/load/$slot/@items/33/$screen/@items/1/$preset/@items/PREVIEW/@props/xRequest`. Preset 13 to program on screen 2 uses slot 13, screen 2, and `PROGRAM`. Those recalls also return no string.

The auxiliary preset paths in section 3.4 are printed `$auxillaryScreen`, with that spelling, not the `$auxiliaryScreen` spelling used on the aux take. Master preset 15 to preview uses `$slot/@items/15` and `PREVIEW` under `DeviceObject/preset/masterBank/control/load`.

Layer source depends on the T-bar. Read `DeviceObject/transition/$screen/@items/1/status/@props/transition`. `AT_DOWN` means the program side is `DOWN` and the preview side is `UP`. `AT_UP` swaps those. With the bar down, live input 3 on screen 1 program layer 2 is a replace of `DeviceObject/$screen/@items/1/$preset/@items/DOWN/$liveLayer/@items/2/source/@props/input` to `INPUT_3`. The guide says a layer change needs a following replace of `DeviceObject/preset/control/@props/xUpdate` to true, especially for a foreground layer. That update returns no string.

Reboot sets `DeviceObject/system/shutdown/@props/xReboot` to true. Standby, switch-off, and wake use `DeviceObject/system/shutdown/standby/control/@props/xRequest` with `STANDBY`, `WAKE_UP`, or the switch-off value. Section 2.6 prints that switch-off value with a leading space, `" SWITCH_OFF"`. Those commands return no string.

## How to set it up

1. Open one TCP connection to port 10606. Confirm the Web RCS security setting has not disabled it. Stay within the five-client limit. End every object with byte `0x04`.
2. Send the device-type get for `DeviceObject/system/@props/dev` and read the `value` string. The example answer is `ZEN200`. The list under it is `EIKOS`, `PULSE`, `QMX`, and `QVU`. Read `DeviceObject/system/version/@props/updater` the same way. The example firmware value is `3.0.17`.
3. Take screen 1 by replacing `DeviceObject/transition/$screen/@items/1/control/@props/xTake` with true. Expect no reply string. Recall a known preset the same way: slot 33, screen 1, `PREVIEW` is the guide's preview example, and it also returns no string.
4. Before a layer source change, get `DeviceObject/transition/$screen/@items/1/status/@props/transition`. On `AT_DOWN`, program is `DOWN` and preview is `UP`. Then replace the layer `input` and replace `DeviceObject/preset/control/@props/xUpdate` with true.
5. Leave reboot, `STANDBY`, wake, and switch-off out of a cue client. Switch-off is the value printed with a leading space, and the guide says the unit must be restarted manually.

Source: [Midra 4K AWJ Programmer's Guide v3.2](https://dwn01.analogway.com/Site+Internet/Series/Midra+4k/Common/AWJ+Protocol/midra_4k_awj_programmers_guide_v3.2.pdf). [Recall Analog Way LivePremier memories over the REST API](/use-cases/recall-analog-way-livepremier-memories-over-the-rest-api) is HTTP under `/api/tpp/v1`. The LivePremier module note says Midra is not that API. This page is AWJ on TCP 10606.

## FAQ

### Is the reply HTTP?
No. AWJ is one JSON object per TCP send, ended by ASCII `0x04`, on port 10606. A successful take or preset recall returns no string. A read returns `path` and `value`, also ended by `0x04`. An error object uses E09 through E13.

### Why are there two spellings of the auxiliary path?
The auxiliary take uses `$auxiliaryScreen`. The auxiliary preset load in section 3.4 uses `$auxillaryScreen`. Send the spelling printed on the command you are using.

### What is ZEN200?
It is the value in the device-type example. The possible-values list immediately under that example is `EIKOS`, `PULSE`, `QMX`, and `QVU`. `ZEN200` is not one of those four strings.
