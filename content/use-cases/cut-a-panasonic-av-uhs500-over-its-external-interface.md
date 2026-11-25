---
title: "Cut a Panasonic AV-UHS500 over its external interface"
slug: cut-a-panasonic-av-uhs500-over-its-external-interface
category: "LED/Video"
tools: ["Panasonic AV-UHS500", "TCP"]
difficulty: Intermediate
source_url: https://eww.pass.panasonic.co.jp/pro-av/support/content/download/DEF/soft/lps/AV-UHS500_InterfaceGuide(DVQP2369XA)_E.pdf
labels: ["Commercial product"]
summary: "AV-UHS500 spec 1.01, factory IP 192.168.0.8, takes STX commands on TCP 62000. SBUS:01:01 selects IN1 on ME1PGM, and the reply is ABUS:01:01."
---

## What it does

Panasonic's AV-UHS500 external-interface specification, version 1.01, dated 31 March 2021, document DVQP2369XA, is the protocol between the live switcher and external equipment. The introduction says a device on the network can switch buses and read source information. The 1.01 introduction does not print a plug-in install step.

Section 2.1 lists the factory settings, and it says the menu can change each one. The IP address is 192.168.0.8. The subnet mask is 255.255.255.0. The receive port is TCP 62000. The UDP destination port is 65000. The minimum command interval is 16 milliseconds or more. The same section says the switcher accepts a maximum of 20 simultaneous external-control connections.

A command is STX, a four-letter name, colon-separated parameters, and ETX. STX is byte 0x02 and ETX is byte 0x03. The format example is `SBUS:01:02`, written in hex as `02 53 42 55 53 3a 30 31 3a 30 32 03`.

`SBUS` selects a bus. It has two parameters, and the switcher replies `ABUS` with those same two parameters. Parameter 1 is the bus. In that table, 01 is ME1PGM, 02 is ME1PVW, 113 is AUX1, 114 is AUX2, 115 is AUX3, and 116 is AUX4. Parameter 2 is the source. 01 is IN1, 02 is IN2, and 148 is BLACK. The normal-sequence example sends `SBUS:01:01` and shows the reply `ABUS:01:01`. The query example on the same page says that pair is IN1 on the ME1PGM bus. The out-of-range example sends `SBUS:25:00` and shows the reply `EROR:01`.

`QBSC` asks for one bus. It has one parameter, the same bus numbers as `SBUS` parameter 1, and the reply is `ABSC`. When IN1 is on ME1PGM, the printed exchange is `QBSC:01` answered by `ABSC:01:01`. Section 3.3 says a crosspoint change is also pushed as `ABSC` over UDP, three times, 16 milliseconds apart, with no connection handshake.

On TCP, section 3 says the switcher disconnects the external equipment if 20 seconds or more pass after a control command or a query before the next command.

`SCUT` issues a cut. It has one parameter, and the spec says that parameter uses the same source-selection list as parameter 1 of `SAUT`. On that list, 00 is BKGD and 01 is KEY1. The command-list heading calls `SAUT` an AUTO transition. The detail heading for the same command calls it an AUX transition. `EROR` parameter 01 is out of the parameter range. Parameter 02 is a syntax error, including a command the switcher does not recognize.

`SSNM` writes a source name of up to 12 bytes and expects `ASNM`. The spec says setting the IN1 name changes both the SDI IN1 name and the HDMI IN1 name. `SPST` sets whether the displayed name is the default or the user name, and the spec says that command has no response. Section 4.6 is a separate path, TSL protocol 5.0 over UDP, for source names and tally. The regular interval can be 16, 32, 48, 64, or 80 milliseconds. The spec says tally group 1 is red and tally group 2 is green.

[Cut a Panasonic AV-HS6000 over its external interface](/use-cases/cut-a-panasonic-av-hs6000-over-its-external-interface) is the 2015 HS6000 spec. That page's factory IP is 192.168.0.5, and its source 01 is SDI IN1. This spec's factory IP is 192.168.0.8, its source 01 is IN1, and it prints a limit of 20 connections. Both specs use TCP 62000.

## How to set it up

1. Read the menu for the IP, the TCP receive port, and the UDP destination port. Use 192.168.0.8 and TCP 62000 only when the menu still shows those factory defaults. The factory UDP destination is 65000.
2. Open TCP to the receive port. Leave at least 16 milliseconds between commands. Send another command before 20 seconds have passed after a control or a query, or section 3 says the switcher closes the connection. The spec's connection limit is 20.
3. Read before you take. `QBSC:01` asks for the ME1PGM bus. The printed answer when IN1 is selected there is `ABSC:01:01`. Do not treat a bus or source number that is absent from the tables as valid.
4. To put IN1 on ME1PGM, send `SBUS:01:01` framed with STX and ETX. Accept the take only when `ABUS:01:01` comes back. `EROR:01` means the parameters were out of range. `EROR:02` means the command was not understood.
5. For a cut, send `SCUT` with one source-selection value from the `SAUT` list. 00 is BKGD and 01 is KEY1. If you also listen for tally, use the UDP destination port. An `ABSC` push on that port is repeated three times at 16 millisecond intervals.

Source: [AV-UHS500 External interface Communication protocol Specifications, version 1.01, DVQP2369XA](https://eww.pass.panasonic.co.jp/pro-av/support/content/download/DEF/soft/lps/AV-UHS500_InterfaceGuide(DVQP2369XA)_E.pdf).

## FAQ

### Does SBUS:01:02 select IN1?
The format example is `SBUS:01:02`, and the hex line is that same string. On the source table, 02 is IN2. The sequence section's worked take is `SBUS:01:01`, and the query example calls `01:01` IN1 on ME1PGM.

### Why do the SAUT headings disagree?
The command list names `SAUT` as the AUTO transition trigger. The detail heading for command 4-1 calls the same command an AUX transition. `SCUT` is the separate cut, and its one parameter uses the source-selection list printed under `SAUT`.

### Is the connection limit the same as the HS6000 spec?
This 1.01 spec prints a maximum of 20 simultaneous external-control connections. The HS6000 page linked above says that spec left the connection count under consideration. The factory addresses also differ: 192.168.0.8 here, 192.168.0.5 on that page.
