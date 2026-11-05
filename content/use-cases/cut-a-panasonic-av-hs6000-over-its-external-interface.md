---
title: "Cut a Panasonic AV-HS6000 over its external interface"
slug: cut-a-panasonic-av-hs6000-over-its-external-interface
category: "LED/Video"
tools: ["Panasonic AV-HS6000", "TCP"]
difficulty: Intermediate
source_url: https://eww.pass.panasonic.co.jp/pro-av/support/dload/hs6000_3ext/AV-HS6000%20external%20IF_protocol-E.pdf
labels: ["Commercial product"]
summary: "AV-HS6000 spec 1.07 takes STX-framed commands on TCP 62000. SBUS:01:01 selects SDI IN1 on ME1PGM, and the switcher replies ABUS:01:01."
---

## What it does

Panasonic's AV-HS6000 external-interface specification, document VQT5L88, version 1.07, dated 22 April 2015, is the protocol between the live switcher and external equipment. The introduction says a PC has to have the plug-in software for external I/F control installed before this function can be used. Bus changes and material-information reads then go to the switcher over the network.

Section 2.1 sets the factory defaults, all of which the menu can change. The IP address is 192.168.0.5. The subnet mask is 255.255.255.0. The receive port is TCP 62000, and that is the port the switcher uses for requests and replies. The submit port is UDP 65000, and that is where the switcher sends UDP to the external equipment. The minimum command interval is 16 milliseconds or more. The same section says the number of simultaneous external-control connections is under consideration, so the spec does not publish a connection limit.

A command is `<STX>`, four letters, colon-separated parameters, and `<ETX>`. STX is byte 0x02 and ETX is byte 0x03. The format example is `SBUS:01:02`, written in hex as `02 53 42 55 53 3a 30 31 3a 30 32 03`.

`SBUS` is the bus-select control. It has two parameters, and the switcher replies `ABUS` with the same two parameters. Parameter 1 is the bus. In the table, 01 is ME1PGM, 02 is ME1PVW, 13 is ME2PGM, 14 is ME2PVW, 113 is AUX1, and 128 is AUX16. Parameter 2 is the source. 01 is SDI IN1, 32 is SDI IN32, 148 is BLACK, and the table continues through stills, clips, MEs, and auxes. The normal-sequence example sends `SBUS:01:01` and shows the reply `ABUS:01:01`. Those two values are ME1PGM and SDI IN1. The error example sends `SBUS:25:00` and shows the reply `EROR:01`.

`QBSC` asks for one bus. It has one parameter, the same bus numbers as `SBUS` parameter 1, and the reply is `ABSC`. The query example says that when SDI IN1 is on the ME1PGM bus, `QBSC:01` is answered with `ABSC:01:01`. `ABSC` is also the UDP update. Section 3.3 says the switcher sends that command three times, 16 milliseconds apart, when a crosspoint changes, without a connection handshake.

`EROR` is the failure reply for a control command that expects a response. Parameter 01 is out of the parameter range. Parameter 02 is a syntax error, including a command the switcher does not recognize. `SPST` is the exception in the source-name section: it sets whether the panel or multiviewer shows the default name, the user name, a picture, or the same name as the panel, and the spec says there is no response. The sequence example for that command is `SPST:0:01`. `SSNM` writes a source name of up to 12 bytes and expects `ASNM`. `QSNM` reads it.

On TCP, section 3 says the switcher disconnects the external equipment if more than 20 seconds pass before the next command after a control command or a query. Section 4.5 is a separate path, TSL protocol 5.0 over UDP, for panel names and tally. It says tally group 1 is red, group 2 is green, and group 3 is amber, set under SYS, PERIPHERAL, Tally, and that two-byte values in that packet are little-endian.

## How to set it up

1. Install the external I/F plug-in the introduction requires, and read the menu for the IP, the TCP receive port, and the UDP submit port. Use 192.168.0.5 and TCP 62000 only when the menu still shows those factory defaults.
2. Open TCP to the receive port. Leave at least 16 milliseconds between commands. Send another command before 20 seconds have passed after a control or a query, or section 3 says the switcher closes the connection.
3. Read before you take. `QBSC:01` asks for the ME1PGM bus. Wait for `ABSC` and check both numbers against the spec's tables. Do not treat a bus or source number that is absent from those tables as valid.
4. To put SDI IN1 on ME1PGM, send `SBUS:01:01` framed with STX and ETX. Accept the take only when `ABUS:01:01` comes back. `EROR:01` means the parameters were out of range. `EROR:02` means the command was not understood.
5. If you also listen for tally, use the UDP submit port and the TSL 5.0 layout in section 4.5. `ABSC` on that port is repeated three times at 16 millisecond intervals. It is a status push, not a second copy of the TCP reply you should answer.

Source: [AV-HS6000 External interface Communication protocol Specifications, VQT5L88, version 1.07](https://eww.pass.panasonic.co.jp/pro-av/support/dload/hs6000_3ext/AV-HS6000%20external%20IF_protocol-E.pdf).

## FAQ

### Does SBUS:01:02 mean the same thing as the hex example?
The format example is `SBUS:01:02`. Parameter 1 value 01 is ME1PGM. Parameter 2 value 02 is the next source after SDI IN1 in the table, which runs 01 through 32 for SDI IN1 through SDI IN32. The normal-sequence diagram uses `SBUS:01:01`, ME1PGM from SDI IN1, and shows `ABUS:01:01` as the reply.

### What comes back from a query?
`QBSC` with one bus number is answered by `ABSC` with the bus and the source. The spec's own case is `QBSC:01` returning `ABSC:01:01` when SDI IN1 is on ME1PGM. A control `SBUS` is answered by `ABUS`, or by `EROR` when the command fails.

### Can the names and the tally use the same TCP command?
Source names on the panel and multiviewer use `QSNM`, `SSNM`, and `ASNM` on TCP. `SPST` changes which name is displayed and has no reply. Tally plus the panel name also has the TSL 5.0 UDP packet in section 4.5. Those are different frames from `SBUS`.
