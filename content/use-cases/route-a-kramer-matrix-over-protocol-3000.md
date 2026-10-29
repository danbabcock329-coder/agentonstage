---
title: "Route a Kramer matrix over Protocol 3000"
slug: route-a-kramer-matrix-over-protocol-3000
category: "LED/Video"
tools: ["Kramer", "Protocol 3000", "TCP"]
difficulty: Intermediate
source_url: https://k.kramerav.com/downloads/protocols/protocol_3000_3.0_master_user.pdf
labels: ["Commercial product"]
summary: "Kramer Protocol 3000 takes ASCII on TCP port 5000 by default. Handshake, read the route, then take one output and trust the echoed response."
---

## What it does

Kramer's Protocol 3000 Reference Guide Version 3.0 (User), part number 2900-300489 Rev 5, is the command set for Kramer devices that speak Protocol 3000. The revision history dates the 3.0 text to 26 July 2017. A terminal, or a TCP or UDP client, can drive the device. The defaults are TCP port 5000 and UDP port 50000, and the guide says the user can change those port numbers. RS-232 and RS-485 use 115200 bps, no parity, 8 data bits, and 1 stop bit.

A host command starts with `#` and ends with a carriage return. A device message starts with `~` and ends with carriage return plus line feed. The optional address is a K-NET device id followed by `@`. A command and its parameters are separated by at least one space. Parameters are separated by commas. A query puts `?` after the command name. The maximum string length is 64 characters, except where a command's own syntax says otherwise. Several commands can sit in one string, separated by `|`, and none of them run until the closing carriage return. Each command in the chain gets its own response. The guide says a line feed sent with the carriage return is ignored by the parser.

Every Protocol 3000 device implements the mandatory system commands. `#` followed by a carriage return is the handshake. The response is `~nn@ OK`. The note says this validates the connection and returns the machine number. The error-code section says the machine number defaults to 01. `#MODEL?`, `#PROT-VER?`, `#VERSION?`, and `#HELP` are also mandatory and End User. `#HELP` with no argument returns a comma-separated command list. `#HELP` plus a command name returns that command's description and usage. Commands whose names start with `X-` are extended Protocol 3000. The guide says to use `#HELP` to see whether the connected device has them.

`#ROUTE layer,dest,src` sets a layer route. The parameter table's layer enumeration is 1 Video, 2 Audio, 3 Data, 4 IR, and 5 USB. `dest` is `*` for every output, `x` to disconnect, or a destination id. `src` is the source id. The response is `~nn@ROUTE layer,dest,src`. The note says ROUTE replaces the other routing commands. Brackets are reserved and mean a list, so the guide's example `ROUTE 1,[1,4,6,7],3` routes video input 3 to outputs 1, 4, 6, and 7. `#ROUTE? layer,dest` reads one route.

On devices that list `X-ROUTE`, the extended form is `#X-ROUTE OUT_signal_id,IN_signal_id`. A signal id is port id, signal type, and index, separated by dots. The note says to send `#SIGNALS-LIST?` first and use only ids from that list. It also says video index 1 is implied when it is left off, so `#X-ROUTE OUT.SDI.5,IN.SDI.1` is answered as `~01@X-ROUTE OUT.SDI.5.VIDEO.1,IN.SDI.1.VIDEO.1`. The routing rule in that section is to name the output first and the input second.

A general error is `~NN@ERR XXX`. An error tied to a command is `~NN@CMD ERR XXX`. The published codes include 1 for protocol syntax, 2 for a command that is not available, 3 for a parameter out of range, 4 for unauthorized access, 6 for protocol busy, and 8 for timeout. If security has been turned on with `SECUR`, `#LOGIN login_level,password` is required. A bad password is answered `~nn@LOGIN ERR 004`. The default password is an empty string, and the guide says a connection may log out after a timeout. The permission system applies only when security is enabled.

`#FACTORY` deletes all user data. The note says the deletion can take some time and that the device may need a power cycle. This entry does not send it.

## How to set it up

1. Open TCP to the device on port 5000 unless that port was changed. Send `#` and a carriage return. Read the machine number from `~nn@ OK`. Stop if there is no answer.
2. Send `#MODEL?`, `#PROT-VER?`, and `#HELP`. Continue with `ROUTE` only if it is in the list. If the list also contains `X-ROUTE`, send `#SIGNALS-LIST?` and keep those ids.
3. Read the route you intend to change with `#ROUTE? 1,dest` for video, or `#X-ROUTE?` plus the output signal id. The syntax section says to name the output before the input.
4. Take one output. A classic video take is `#ROUTE 1,dest,src` and a carriage return. Use `*` only when every output should change, and `x` only when that output should disconnect. Stay inside the 64-character string limit.
5. Treat the `~nn@ROUTE` or `~nn@X-ROUTE` line as the route that landed. A line containing `ERR` is a refusal. Leave `#FACTORY`, `#RESET`, `#NET-IP`, and `#SECUR` out of the session. The guide says front-panel and IR changes are also reported, so a later status line can belong to someone else.

Source: [Protocol 3000 Reference Guide Version 3.0 (User)](https://k.kramerav.com/downloads/protocols/protocol_3000_3.0_master_user.pdf), P/N 2900-300489 Rev 5.

## FAQ

### Does every Kramer device listen on port 5000?
The syntax chapter says the default TCP port is 5000 and the default UDP port is 50000, and that those port numbers can be changed by the user. Read `#HELP` after you connect. A command that is missing from that list is answered as not available.

### What does a destination of star mean?
The ROUTE parameter line says `dest` of `*` means ALL and `dest` of `x` means disconnect. Any other destination id is one output.

### Which number is video?
The layer enumeration table says 1 is Video, 2 is Audio, 3 is Data, 4 is IR, and 5 is USB. Extended routes name the signal instead, as in `OUT.HDMI.4.VIDEO.1`.
