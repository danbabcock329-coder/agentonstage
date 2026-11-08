---
title: "Step a Visual Productions CueCore2 playback over OSC"
slug: step-a-visual-productions-cuecore2-playback-over-osc
category: "Lighting"
tools: ["Visual Productions CueCore2", "OSC", "HTTP"]
difficulty: Intermediate
source_url: https://api.visualproductions.nl/api/download/633ae916812af574aa075201
labels: ["Commercial product"]
summary: "CueCore2 takes OSC on the Settings port. /core/pb/1/go+ steps playback 1. HTTP GET /ajax/pb01/go+ on port 80 does the same. TCP and UDP default to 7000."
---

## What it does

The CueCore2 user manual, document revision 13 dated 27 September 2026, describes a solid-state lighting controller with six playbacks and two DMX-512 ports. Appendix D says the unit is pre-programmed so OSC, TCP, UDP, and HTTP can reach that playback engine. The same appendix says you can still build a separate OSC, TCP, or UDP implementation on the Show Control page. The API prefix in the addresses below is `core` unless you change it. The Settings chapter says that prefix defaults to `core`, and that a unique label matters when several Visual Productions units share a broadcast.

OSC does not have a port number printed as a factory default. Section 12.6 says equipment sending OSC has to use the number in the Port field. That is the port the CueCore2 listens on. Outgoing OSC goes to up to four Out IP fields, written as `ip address:port`. The manual's example is `192.168.1.11:9000`. An unused field can be `0.0.0.0:0`. TCP and UDP are separate. Section 12.8 says both of those listening ports default to 7000. HTTP GET goes to port 80.

The playback table uses playback 1 and says the `1` can be any number from 1 to 6. `/core/pb/1/go+` jumps to the next cue in playback 1. `/core/pb/1/go-` jumps to the previous cue. `/core/pb/1/jump` takes an integer and jumps to a specific cue. `/core/pb/1/release` releases that playback. `/core/pb/release` releases all of them. `/core/pb/1/intensity` takes a float. `/core/pb/solo` takes an integer and starts a solo playback. The appendix marks `/core/pb/1/go+` with a footnote: this command does not work when the parameter is off or a 0 value. `/core/pb/1/rate` is also listed with a float. The same row's description text repeats "Set the playback's intensity". The HTTP table is the one that labels the rate control: `/ajax/pb01/rat=0.55` is "Set playback rate", and the range is -1.0 to 1.0.

The HTTP examples use `http://192.168.1.10`. Playback numbers in those paths are two digits, `01` through `06`. Go forward is `/ajax/pb01/go+`. Jump is `/ajax/pb01/jmp=3`, and the parameter range is 1 to 32. Release is `/ajax/pb01/rel`. Intensity is `/ajax/pb01/int=0.55`, range 0.0 to 1.0. Release all is `/ajax/rel`. Master intensity is `/ajax/int=0.55`. Master fade is `/ajax/fad=3s`. Solo is `/ajax/pb/sol=3`, range 1 to 6.

The TCP and UDP form of the same go is the ASCII string `core-pb-1-go+`. A jump is `core-pb-1-jump=` plus the cue. `/core/hello`, or the string `core-hello`, is answered with the same hello. The manual says that hello is the poll for "the CueCore2 is online at the IP address and port that you expect." Feedback of intensity, rate, the active state, and the current cue goes back to the last four OSC clients and the last four UDP clients. A power cycle clears that client list. `/core/goodbye` or `core-goodbye` removes the sender. The manual warns that two Visual Productions units can loop if each treats the other's feedback as a new command, which is why the API prefix can be relabeled.

A long press of the reset button, held until the status LED flashes white, returns the static IP to `192.168.1.10`. vManager finds the unit on the network. Password protection, once enabled on the Settings page, blocks changes until it is disabled there or with that reset.

## How to set it up

1. Find the CueCore2 with vManager, or browse to the address you already set. After a long-press reset the manual's default static address is `192.168.1.10`. Open Settings and read the OSC Port field. Leave the API prefix at `core` unless this network has more than one unit.
2. Send OSC to that port. To step playback 1, send `/core/pb/1/go+` with a parameter that is not off and not 0. The appendix says a 0 value does not run that command. Jump to cue 3 with `/core/pb/1/jump` and integer 3.
3. Or send HTTP GET to port 80. The manual's go example is `http://192.168.1.10/ajax/pb01/go+`. The jump example is `http://192.168.1.10/ajax/pb01/jmp=3`. Set that playback's intensity with `http://192.168.1.10/ajax/pb01/int=0.55`.
4. For a TCP or UDP sender, use port 7000 unless Settings shows another number, and send the text `core-pb-1-go+`. Poll with `core-hello` and expect the same text back. Watch the Monitor page if the playback does not move.

Source: [CueCore2 user manual, revision 13](https://api.visualproductions.nl/api/download/633ae916812af574aa075201) and the [CueCore2 product page](https://www.visualproductions.nl/products/cuecore2).

## FAQ

### Is the OSC port 7000?
Not from this manual. Section 12.6 says the OSC listen port is whatever is in the Port field. Section 12.8 says the TCP and UDP ports both default to 7000. HTTP GET uses port 80. Read the three fields before you pick a socket.

### Why did go+ get ignored?
The appendix footnote on `/core/pb/1/go+` says the command does not work when the parameter is off or a 0 value. Send a non-zero parameter. Playback numbers only run from 1 to 6, and an HTTP jump only accepts a cue from 1 to 32.

### Does the unit tell you which cue is up?
Yes, for OSC and UDP clients it remembers. The feedback table includes `/core/pb/1/cue` and `/core/pb/1/active`, plus the intensity and rate addresses. The list holds four OSC clients and four UDP clients, and a power cycle clears it. Send `/core/goodbye` to drop yourself out of that list.
