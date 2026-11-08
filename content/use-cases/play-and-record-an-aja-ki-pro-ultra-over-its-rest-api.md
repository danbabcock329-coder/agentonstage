---
title: "Play and record an AJA Ki Pro Ultra over its REST API"
slug: play-and-record-an-aja-ki-pro-ultra-over-its-rest-api
category: "LED/Video"
tools: ["AJA Ki Pro Ultra", "HTTP"]
difficulty: Intermediate
source_url: https://gitlab.aja.com/pub/rest_api/-/blob/master/KiProUltra/05_Ki-Pro-Ultra_Commands.md
labels: ["Commercial product"]
summary: "Ki Pro Ultra takes HTTP at /config. Set eParamID_TransportCommand to 1 to play, 3 to record, and 4 to pause on the first stop. Examples use 192.168.0.2."
---

## What it does

AJA's REST API developer guide controls a Ki Pro Ultra by setting parameters on the recorder's own web server. Chapter 1 says the calls are HTTP POST and GET. The interface is the unit's IP address plus `/config`. Every example in that chapter uses `192.168.0.2`, and the chapter says that is the default IP address of the device. A hidden developer page is at `/rest.tmpl`. The full parameter list is `desc.json` and the readable form is `descriptors.html`.

A command is a query string. `action` is `get`, `set`, `connect`, or `wait_for_config_events`. `paramid` names the parameter. `value` is the value for a set. A get or set answers with JSON of four fields. The chapter's example for a video-input get is `{"paramid":"33619978","name":"eParamID_VideoInSelect","value":"1","value_name":"HDMI"}`. `value_name` is the descriptor text for an enum, or a copy of `value` for an integer. Chapter 1 also shows the same set as a browser URL, as `curl`, and as a one-line telnet `GET` to port 80.

Chapter 5 is the Ki Pro Ultra command list. Transport is the parameter `eParamID_TransportCommand`. The descriptor is an enum from 0 to 18, default 0, and the description string is "Transport command." The values used for a normal roll are:

- 0, No Command
- 1, Play Command
- 3, Record Command
- 4, Stop Command
- 5, Fast Forward
- 6, Fast Reverse
- 9, Next Clip
- 10, Previous Clip
- 11, Variable Speed Play

The play URL in the chapter is `http://192.168.0.2/config?action=set&paramid=eParamID_TransportCommand&value=1`. Record is the same URL with `value=3`. Stop is `value=4`. The chapter says the first stop pauses the unit, and the second stop makes it stop, which it also calls idle. Fast forward is `value=5`.

Playback speed is a different parameter, `eParamID_TransportRequestedSpeed`, and the chapter limits it to firmware v3.1.1 and above. The descriptor types it as a string, default `0.0`, maximum length 20, and its description says it is only used with the `eTCVarPlay` transport command. The chapter's examples are `1` for normal speed, `16` for 16x, `-1.5` for 1.5x reverse, `0` for pause, and `0.5` for half speed. The normal-speed URL is `http://192.168.0.2/config?action=set&paramid=eParamID_TransportRequestedSpeed&value=1`.

The README of the same repository says the guide's methods also cover Ki Pro Ultra Plus and Ki Pro Ultra 12G, in a separate chapter. This entry stays on the Ki Pro Ultra commands in chapter 5. The transport parameter is marked ephemeral, so a reboot clears it. The published transport URLs do not include an Authorization header.

## How to set it up

1. Open `http://192.168.0.2/rest.tmpl` in a browser, or substitute the address the recorder is actually using. The guide's examples call `192.168.0.2` the default. Use `/descriptors.html` or `/desc.json` when you need a parameter that chapter 5 does not print.
2. Play with the chapter 5 URL: `http://192.168.0.2/config?action=set&paramid=eParamID_TransportCommand&value=1`. Chapter 1's curl form of a set is `curl "http://192.168.0.2/config?action=set&paramid=eParamID_TransportCommand&value=1"`.
3. Record with `value=3`. Stop with `value=4`. Send stop once to pause and a second time to idle. Read the state back with `action=get` and the same `paramid`. The JSON `value` is the enum number, and `value_name` is the label.
4. On firmware v3.1.1 or newer, set `eParamID_TransportRequestedSpeed` before a variable-speed roll. The descriptor says that string is only used with the `eTCVarPlay` transport command. Value `0` is the chapter's pause speed. Value `1` is normal play speed.

Source: [Ki Pro Ultra commands, chapter 5](https://gitlab.aja.com/pub/rest_api/-/blob/master/KiProUltra/05_Ki-Pro-Ultra_Commands.md), [Generic REST framework, chapter 1](https://gitlab.aja.com/pub/rest_api/-/blob/master/01_Generic_AJA_REST_API_Control_Framework.md), and the [repository README](https://gitlab.aja.com/pub/rest_api/-/blob/master/README.md).

## FAQ

### Does one stop command end the recording?
Chapter 5 says the first stop pauses, and the second stop makes the unit stop, which it calls idle. Both sends are `eParamID_TransportCommand` set to 4.

### Where do the example addresses come from?
Chapter 1 says every example uses the default IP address `192.168.0.2`. The path is `/config`. If the recorder is not on that address, the same query string still applies to the address it is using. `/rest.tmpl` is the developer page on that host.

### Can the speed parameter shuttle any Ki Pro Ultra?
The speed section is headed "v3.1.1 and above". The parameter descriptor says the string is only used with the `eTCVarPlay` transport command. A plain play is value 1 on `eParamID_TransportCommand`, not a speed write.
