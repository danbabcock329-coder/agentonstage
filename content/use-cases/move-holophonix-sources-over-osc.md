---
title: "Move HOLOPHONIX sources over OSC"
slug: move-holophonix-sources-over-osc
category: "Audio"
tools: ["HOLOPHONIX", "OSC"]
difficulty: Intermediate
source_url: https://holophonix.xyz/documentation/docs/external_controls/osc
labels: ["Commercial product"]
summary: "HOLOPHONIX receives OSC on port 4003 by default. /bus/2/gain -2.5 sets bus 2 to -2.5 dB. /get /master/gain reads the master level."
---

## What it does

HOLOPHONIX documents OSC as the way to control or monitor every parameter. The OSC page says to open Settings, then the OSC tab. Incoming messages go to the processor's IP on port 4003 unless you change that port. Outgoing OSC stays off until you activate a destination and give it an IP and a port. The same page says you can have several destinations and choose which coordinate format they receive for source position. Under OSC Send, the page says ports 4002 and 4001, ports below 1024, and ports above 65535 are not allowed.

An address is the object type, the object index, and the parameter. The page's level example is `/bus/2/gain` with the argument `-2.5`, which sets spatialization bus 2 to -2.5 dB. The inspector header of a selected object shows the address for that object, index included. Addresses start with one of the types the page lists: `/track` for a mono source, `/stereo`, `/multi`, `/tree`, `/aformat`, `/bformat`, `/zylia`, `/em32`, `/em64`, `/hoastream`, `/bus`, `/reverb`, `/d2m`, `/lfe`, `/monitoring`, and `/master`.

Arguments are integers, decimals, strings, or booleans. The page says a decimal sent to an integer parameter is rounded to the closest integer, and its examples are 1.5 becoming 1 and 1.6 becoming 2. An angle can be sent on the native -180 to +180 scale or on 0 to 360. The page's example is +190 becoming -170. String arguments are not case-sensitive: `/bformat/1/norm` with `FuMa` and with `fuma` are the same message.

One address can hit several objects. `*` matches a run of characters, `?` matches one, `[1-4]` is a range, and `{1,4,5}` is a list. The page's examples are `/track/*/azim` with `10` for every mono source at +10 degrees, `/stereo/[1-5]/gain` with `-6` for stereo sources 1 through 5, and `/{track,stereo}/*/mute` with `1` to mute every mono and stereo source.

Reads use `/get` plus the address. `/get /stereo/5/gain` comes back as `/stereo/5/gain` and the current value. `/get /stereo/[1-5]/gain` returns one message per source. `/get /master/gain` reads the master. The OSC Status window lists the addresses in the preset that is open.

## How to set it up

1. On the processor, open Settings, then the OSC tab, and read the receive port. The page says the default is 4003 and that you can change it. Send to the processor's IP on that port.
2. Read before you move anything. Send `/get /master/gain` and `/get /track/1/azim`. The reply repeats the address and the value. The OSC Status window is the list of addresses for the open preset.
3. Set bus 2 with `/bus/2/gain` and `-2.5`. Set every mono azimuth with `/track/*/azim` and `10`. Mute mono and stereo sources with `/{track,stereo}/*/mute` and `1`. Use the address printed in the inspector header when the index is not the one in these examples.
4. If HOLOPHONIX should report changes to a console or a cue stack, activate an OSC destination and set its IP and port. The page's forbidden destination ports are 4002, 4001, anything below 1024, and anything above 65535.

Source: [HOLOPHONIX OSC](https://holophonix.xyz/documentation/docs/external_controls/osc).

## FAQ

### Is the receive port always 4003?
The page says 4003 is the default and that the OSC tab can change it. Send to the port that tab shows. The forbidden-port warning on that page is in the OSC Send section, for destinations.

### How do I hit sources 1 through 5 without five messages?
The page uses square brackets for a range and curly braces for a list. `/stereo/[1-5]/gain` with `-6` is the documented range. `/stereo/{1,2,3,4,5}/gain` with `-6` is the same five sources written out. `/track/*/azim` is every mono source.

### What comes back from a read?
`/get` plus an address. The page says `/get /stereo/5/gain` returns `/stereo/5/gain` and the level, and `/get /master/gain` returns `/master/gain` and the master level. A range in the address returns one reply per match.
