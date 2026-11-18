---
title: "Recall a Canon PTZ preset over XC"
slug: recall-a-canon-ptz-preset-over-xc
category: "LED/Video"
tools: ["Canon PTZ", "XC Protocol", "HTTP"]
difficulty: Intermediate
source_url: https://output.nl/u/images/canon-xc-control-protocol-specifications-005.pdf
labels: ["Commercial product"]
summary: "Canon XC spec BPE-7216-005 recalls preset 1 with control.cgi?p=1. Preset numbers run from 1 to 100. A success reply is HTTP 200 and Livescope-Status 0."
---

## What it does

Canon XC is the HTTP control protocol for Canon remote and cinema cameras. This page follows specification BPE-7216-005, dated 1 September 2023. GET or POST both work. The URI starts with `/-wvhttp-01-/`. Aside from that `wvhttp` prefix, the URI and body are not case sensitive. The spec's example host is `192.168.100.1`. Parameters are `name=value`, joined with `&`, and URL-encoded. If the same parameter is repeated, the last value is the one used, unless that parameter is allowed more than once. XC does not support HTTP pipelining.

`info.cgi` and `control.cgi` are the two commands the spec marks mandatory. Everything else in the command list is optional and depends on the model. There is no separate "recall preset" command. The preset chapter says execution and stop go through `control.cgi` by setting the preset parameters. Preset numbers in this revision run from 1 to 100. `p.count` in the parameter table is 100.

Recall preset 1 with:

`http://<camera>/-wvhttp-01-/control.cgi?p=1`

The success example is HTTP 200, `Content-Type: text/plain;charset=utf-8`, `Livescope-Status: 0`, and a body that contains `p=1` and `p.ptztime=10000`. `p.ptztime` is the move time in milliseconds. The common range in the parameter table is 2000 to 99000. When `p.ptztime` is set, the stored pan, tilt, and zoom speeds are ignored. If both `p.ptztime` and `p.ptzspeed` are sent, `p.ptztime` wins. `p.ptzspeed` is listed for CR-N500, CR-N300, CR-X300, CR-N700, XF605, and CR-N100, from 1 to 100. `p.action=stop` stops a preset that is already moving. `p.action.list` contains `stop`.

A sessionless request is one HTTP call with no session id. The camera-control chapter says that on a remote camera, sessionless access covers almost all controls, with some exceptions, and that those controls can be performed without control privileges. `control.cgi` still returns Livescope status 301 when a sessionless request cannot obtain control privileges immediately. HTTP 401 is failed user authentication. Livescope 403 is a value of the wrong type or out of range. Livescope 406 is a missing control item. The spec recommends at least 30 ms between requests that move a mechanism, because pan, tilt, and zoom take time to finish. The position you asked for may not be the position the camera reaches. Read it back with `info.cgi`.

`p.status` is 0 while stopped and 1 while moving. `p` with no index is the preset number last controlled, and it stays 0 until the first recall after boot. `p.<n>.content` is `enabled` when that preset has something stored. `p.<n>.name.utf8` is the name, on the models where the table lists it, and only when a name is set.

## How to set it up

1. Put the controller on the camera's network. The spec's example address is `192.168.100.1`. Confirm the camera answers HTTP. This write-up is BPE-7216-005, so check the camera's own model table before relying on an optional command.
2. Recall preset 1 with GET or POST to `/-wvhttp-01-/control.cgi?p=1`. Look for HTTP 200 and `Livescope-Status: 0`. A body like the spec's example includes `p=1`.
3. To set the move time, add `p.ptztime` between 2000 and 99000. That unit is milliseconds. Leave `p.ptzspeed` off when you send `p.ptztime`, because the table says the time wins when both are present.
4. Stop a move with `/-wvhttp-01-/control.cgi?p.action=stop`. Wait at least 30 ms before the next pan, tilt, or zoom request. The spec says XC will not pipeline HTTP/1.1 requests.
5. Read `/-wvhttp-01-/info.cgi` and check `p.status`. 0 is stopped and 1 is moving. `p.<n>.content=enabled` means that preset number has stored parameters. A 301 means this sessionless call did not get control privileges.

Source: [Canon XC Control Protocol Specifications, BPE-7216-005](https://output.nl/u/images/canon-xc-control-protocol-specifications-005.pdf).

## FAQ

### Is this the Sony CGI preset call?
[Recall Sony BRC and SRG presets over CGI](/use-cases/recall-sony-brc-and-srg-presets-over-cgi) is Sony's CGI interface. [Recall PTZOptics camera presets over HTTP](/use-cases/recall-ptzoptics-camera-presets-over-http) is PTZOptics. Canon XC in this revision uses `/-wvhttp-01-/control.cgi` and the `p` parameter.

### Do I have to open a session first?
Sessionless XC is one request and one response, with no session id. The camera-control chapter says a remote camera allows sessionless access for almost all controls. `control.cgi` returns Livescope 301 when that request cannot get control privileges immediately. `claim.cgi` and `yield.cgi` are the privilege commands, and the spec says those require a session.

### What is Livescope-Status 0?
On the success example it is the status line next to HTTP 200. The body then reports each item as changed (`:=`), unchanged (`==`), or disabled for the current mode (`==?`). A missing control item is Livescope 406, not a transport failure.
