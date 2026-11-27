---
title: "Switch an IoCore2 relay and DMX channel over OSC"
slug: switch-an-iocore2-relay-and-dmx-channel-over-osc
category: "Lighting"
tools: ["Visual Productions IoCore2", "OSC", "UDP"]
difficulty: Intermediate
source_url: https://api.visualproductions.nl/api/download/6763ec7f5aaf91d36674c9e4
labels: ["Commercial product"]
summary: "IoCore2 manual revision 8 takes /core/gpo/1 as a bool on its OSC port. UDP and TCP default to 7000. The UDP form is core-gpo-1= plus 0 or 1."
---

## What it does

Visual Productions' IoCore2 user manual, document revision 8, dated 30 August 2026, is the manual for the GPI, GPO, RS-232, and DMX interface. Appendix D says the unit is pre-programmed so its internal functions are available over OSC and over UDP, and that a show can still add its own messages on the Show Control page. The API prefix in General settings is `core` by default. The same section says a unique prefix is useful when more than one Visual Productions unit is on the network, because feedback between them can loop.

OSC listens on the port in the OSC settings Port field. The manual does not print a default for that field. Outgoing OSC goes to up to four Out IP fields, written `ip-address:port`. The example is `192.168.1.11:9000`. An unused field is `0.0.0.0:0`. A broadcast such as `192.168.1.255` is allowed. Forward copies every incoming OSC message to those addresses. TCP and UDP listening ports are in the TCP/IP settings. The manual says both default to 7000.

The OSC table uses GPO 1 as the example and says `1` can be any number from 1 to 6. `/core/gpo/1` with a bool switches the relay on GPO port 1. The UDP and TCP string for the same relay is `core-gpo-1=<0/1>`. DMX uses `/core/dmx/1` with an integer, and the number can be 1 through 512. The table says the DMX port has to be switched to output. The UDP string is `core-dmx-1=` plus the value. `/core/tm/1/start`, `/core/tm/1/stop`, `/core/tm/1/restart`, and `/core/tm/1/pause` run timer 1. The timer number can be 1 through 4. Those four take no parameter. `/core/hello` makes the unit reply with the same Hello message. `/core/blink` flashes the LED. The UDP forms are `core-hello` and `core-blink`.

Feedback goes to the last four OSC clients and the last four UDP clients. A power cycle clears those lists. `/core/goodbye` or `core-goodbye` removes the sender. The hello command is the poll the manual recommends, to check that the unit is online at the address and port you expect. The reset section says a long press, held until the status LED flashes white, returns the IP settings to the default static address `192.168.1.10`. The password section says that long press also disables password protection.

## How to set it up

1. Install vManager from Visual Productions and use it to find the IoCore2. The quick-start example opens the web interface at `192.168.1.10`. A long press of reset returns a unit to that static address.
2. On the Settings page, read the API prefix. It is `core` unless someone changed it. Read the OSC Port field. Leave TCP and UDP at 7000 unless those fields were edited.
3. Set the DMX port to output before a DMX write. Send `/core/hello` and wait for the same Hello message back. Then send `/core/gpo/1` with a bool, or the UDP string `core-gpo-1=` plus 0 or 1, to port 7000. The table does not say which value energizes the relay.
4. Send `/core/dmx/1` with an integer only after the DMX direction is output. Channel numbers in the table run from 1 to 512.
5. Send `/core/goodbye` when the client is done, or expect the client list to clear on a power cycle. If two Visual Productions units start answering each other, give this unit a prefix other than `core`.

Source: [IoCore2 user manual, document revision 8](https://api.visualproductions.nl/api/download/6763ec7f5aaf91d36674c9e4). [Step a Visual Productions CueCore2 playback over OSC](/use-cases/step-a-visual-productions-cuecore2-playback-over-osc) is a different product. Its playback path is `/core/pb/1/go+`. This manual's relay path is `/core/gpo/1`.

## FAQ

### Is 7000 the OSC port?
The TCP/IP section says the TCP port and the UDP port both default to 7000. The OSC section says incoming OSC uses the number in the Port field, and it does not print a default for that field. Read it on the unit.

### Will a relay write also set a DMX channel?
Not by this API. `/core/gpo/1` switches relay 1. `/core/dmx/1` sets DMX channel 1, and only when the DMX port is an output. The show-control templates can map GPI to DMX, which is a separate programming page.

### Does hello stay subscribed after a reboot?
The feedback section says a power cycle clears the OSC and UDP client lists. Send `/core/hello` again after power returns. `/core/goodbye` removes the sender without a reboot.
