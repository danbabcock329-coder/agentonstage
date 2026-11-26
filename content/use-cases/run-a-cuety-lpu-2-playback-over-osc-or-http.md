---
title: "Run a Cuety LPU-2 playback over OSC or HTTP"
slug: run-a-cuety-lpu-2-playback-over-osc-or-http
category: "Lighting"
tools: ["Visual Productions Cuety", "OSC", "HTTP"]
difficulty: Intermediate
source_url: https://api.visualproductions.nl/api/download/633d386c812af574aa076795
labels: ["Commercial product"]
summary: "Cuety manual revision 5: the LPU-2 takes OSC on UDP port 8000. HTTP GET /ajax/pb01/int=0.55 sets playback 1. On TCP 7000 that level is pb01/in=55."
---

## What it does

Visual Productions' Cuety manual, revision 5, dated 12 October 2023, is the user guide for the LPU lighting interface and the Cuety app. Section 1.5 says only the LPU-2 has OSC, TCP, UDP, and HTTP. The comparison table gives both LPU models 64 playbacks and 48 cues per playback, and 512 DMX channels. The LPU-2 web interface is read-only. It can show status and the network messages, and the manual says it cannot modify the LPU-2.

Appendix A is the API, and it repeats that the LPU-1 does not support it. OSC is received on port 8000. The intensity address is `/pb<playback index>/in` with a float from 0.0 to 1.0. The same path with a bool asks for the level. Speed is `/pb<playback index>/sp`, float -1.0 to 1.0. Go forward is `/pb<playback index>/go+`. Go back is `/pb<playback index>/go-`. Jump is `/pb<playback index>/ju` with an integer from 1 to 48. Release is `/pb<playback index>/re`. Release all is `/pbxx/rel`. Blackout is `/blackout` with a bool. Hello is `/hello`.

The playback-button path, `/pb<playback index>/bu`, has a footnote. It copies the on-screen button. A short press is go forward and a long press is release. The note says it expects a 1 and then a 0, and the time between them decides which press it was.

TCP and UDP use port 7000 and ASCII strings. The intensity set example is `pb01/in=55`, an integer from 0 to 100. The intensity get example on that row is `pb00/in`. Speed example `pb33/sp=-20` is an integer from -100 to 100. Jump example `pb45/ju=17` is an integer from 1 to 48. Release all on this transport is the word `release`, not `pbxx/rel`. Blackout example `blackout=1` is an integer, 0 or 1. Hello is the word `hello`. Set-all intensity is `pbxx/int=0.5`, and that row's range is the float 0.0 to 1.0, not the 0 to 100 scale used by `pb01/in`.

HTTP is a GET to port 80. The worked intensity URL is `http://192.168.1.10/ajax/pb01/int=0.55`, range 0.0 to 1.0. Jump is `http://192.168.1.10/ajax/pb45/jmp=17`. Blackout is `http://192.168.1.10/ajax/blackout=1`. The speed row's URL column is `/ajax/pb<playback index>/spd=`, and the example printed beside it is `http://192.168.1.10/ajax/pb33/sp=-0.20`.

Section A.5 says an OSC or UDP command stores the sender, up to four OSC clients and four UDP clients. A later status change is sent back to that list. A power cycle clears it. Hello is answered with hello. The poll example for playback 9 speed is the UDP string `pb09/spd`, and the printed reply is `pb09/spd=-0.5`, which the manual calls -50 percent. The OSC feedback table prints playback speed as 0.0 to 1.0.

[Step a Visual Productions CueCore2 playback over OSC](/use-cases/step-a-visual-productions-cuecore2-playback-over-osc) is the CueCore2 manual. That page's TCP and UDP default is also 7000, and its HTTP port is also 80. Its OSC port is the Settings field, and its addresses start with `/core/`. This manual prints OSC port 8000 and does not use that prefix.

## How to set it up

1. Confirm the unit is an LPU-2. Section 1.5 says the LPU-1 does not have OSC, TCP, UDP, or HTTP. The web page on the unit is read-only, so use it to watch messages, not to set a level.
2. For OSC, send to UDP port 8000. Set playback intensity with `/pb<playback index>/in` and a float from 0.0 to 1.0. Ask with the same path and a bool. Jump with `/pb<playback index>/ju` and an integer from 1 to 48.
3. For a readable string, open TCP or UDP port 7000. The set example is `pb01/in=55`. The get example printed on that row is `pb00/in`. Release every playback with `release`. Do not send `pbxx/rel` on this port. That path is the OSC form.
4. For HTTP, GET port 80. The manual's intensity example is `http://192.168.1.10/ajax/pb01/int=0.55`. Use the address of the LPU-2 in place of 192.168.1.10. Blackout is `/ajax/blackout=1`.
5. Poll with hello before you trust a level. OSC `/hello`, TCP or UDP `hello`, and HTTP `/ajax/hello` are the three printed forms. The feedback list holds four OSC clients and four UDP clients, and a power cycle clears it.

Source: [Cuety manual, revision 5, 12 October 2023](https://api.visualproductions.nl/api/download/633d386c812af574aa076795).

## FAQ

### Is pb01/in=55 the same as 0.55?
On TCP and UDP, `pb01/in=55` is the printed example and the range is the integer 0 to 100. On OSC the intensity float runs from 0.0 to 1.0. On HTTP the worked URL is `/ajax/pb01/int=0.55`. The TCP set-all row is a third scale: `pbxx/int=0.5`, float 0.0 to 1.0.

### Which speed path is the HTTP one?
The HTTP speed row labels the URL `/ajax/pb<playback index>/spd=`. The example in that same row is `http://192.168.1.10/ajax/pb33/sp=-0.20`. The OSC set path is `/pb<playback index>/sp`, from -1.0 to 1.0. The OSC feedback table prints the speed range as 0.0 to 1.0.

### Does a playback button path go?
The footnote on `/pb<playback index>/bu` says the command copies the on-screen button, expects 1 and then 0, and uses the gap between them to choose a short press or a long press. A short press is go forward. A long press is release. Go forward without that timing is `/pb<playback index>/go+`.
