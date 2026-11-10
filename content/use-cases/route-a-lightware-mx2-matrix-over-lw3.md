---
title: "Route a Lightware MX2 matrix over LW3"
slug: route-a-lightware-mx2-matrix-over-lw3
category: "LED/Video"
tools: ["Lightware MX2", "LW3", "TCP"]
difficulty: Intermediate
source_url: https://assets.prod.pim.lightware.com/assets/File-Downloads/Guides-and-Manuals/User-Manual/HTML/MX2_Standalone_series/MX2_Standalone_Series_UserManual.html
labels: ["Commercial product"]
summary: "The MX2 Standalone Series manual routes video on TCP port 6107. CALL /MEDIA/XP/VIDEO:switch(I4:O1) ties input 4 to output 1 and returns mO =OK."
---

## What it does

Lightware's MX2 Standalone Series user's manual, LW3 programmer's reference, controls the matrix with ASCII commands. The revision history on that manual reaches v6 on 2026-02-12, and the related-firmware line on the same page is package v1.11.3. The manual says LW3 has been in Lightware devices since 2012, and that this chapter is the command set for this switcher. Names and parameters are case-sensitive. A command ends with carriage return and line feed. A line, including the response, can be at most 800 bytes.

Over Ethernet the port is TCP 6107. The manual's terminal steps use a raw connection, and the IP default it names is DHCP. The built-in web page is a different control path. This chapter is the TCP protocol.

`GET /.ProductName` is the identity check. The manual's example response is `pr /.ProductName=MX2-24x24-DH-12DPi-R`. `GET /MEDIA/XP/VIDEO.DestinationConnectionStatus` reads the crosspoint. The response is one input token per output, separated by semicolons, in output order. The manual's example is a run of `I1` values, and it says that means input 1 is connected to every output.

A single route is a CALL. The switching section's example is `CALL /MEDIA/XP/VIDEO:switch(I4:O1)`, and the response it prints is `mO /MEDIA/XP/VIDEO:switch=OK`. That ties input 4 to output 1. `CALL /MEDIA/XP/VIDEO:switch(0:O1)` disconnects output 1. An invalid argument is an error. The manual's example `CALL /MEDIA/XP/VIDEO:switch(IA:O1)` returns `mE /MEDIA/XP/VIDEO:switch %E004:Invalid value`.

`CALL /MEDIA/XP/VIDEO:switchMulti(I1;I2;I3;I4;I5;I6;I7;I8)` sets outputs in order in one command. The manual's second example, `switchMulti(I1;I2;;;I5)`, leaves a gap where an output is not included. `switchAll` is the command that applies one source to every output. The manual's tip says `CALL /MEDIA/XP/VIDEO:switchAll(0)` disconnects every output. A show client that means one destination should send `switch` with one pair.

`CALL /SYS:softReset()` restarts the matrix and drops the LAN session. `CALL /SYS:factoryDefaults()` restarts it and restores defaults. `CALL /MANAGEMENT/POWER:standby()` disables video transmission. Those three stay out of a routing client. `MAN` in front of a node, property, or method returns that node's manual text, which is the check that the path exists on the frame you are talking to.

## How to set it up

1. Give the MX2 an address. The manual's LW3 terminal steps say the default is DHCP, then open a raw TCP connection to that address on port 6107.
2. Send `GET /.ProductName` followed by carriage return and line feed. Read the `pr /.ProductName=` line before any route. The manual's example value is `MX2-24x24-DH-12DPi-R`.
3. Send `GET /MEDIA/XP/VIDEO.DestinationConnectionStatus` and read the semicolon-separated input tokens. The position in that list is the output number.
4. Route one destination with `CALL /MEDIA/XP/VIDEO:switch(I4:O1)` and wait for `mO /MEDIA/XP/VIDEO:switch=OK`. Read the crosspoint again. `CALL /MEDIA/XP/VIDEO:switch(0:O1)` disconnects output 1. `mE` and `%E004:Invalid value` are the manual's example of a bad argument.
5. Leave `switchAll`, `softReset`, `factoryDefaults`, and `standby` out of the client unless that exact action is the one you mean. `switchAll(0)` disconnects every output.

Source: [MX2 Standalone Series user's manual, LW3 programmer's reference](https://assets.prod.pim.lightware.com/assets/File-Downloads/Guides-and-Manuals/User-Manual/HTML/MX2_Standalone_series/MX2_Standalone_Series_UserManual.html).

## FAQ

### Is the path /MEDIA/VIDEO/XP?
This manual's switch method is `/MEDIA/XP/VIDEO:switch`. The response prefix `mO` is a successful method, and the switching examples append `=OK`. Send `MAN /MEDIA/XP/VIDEO:switch` if you need the frame's own manual line for that method.

### What closes a command?
Carriage return and line feed. The manual says names are case-sensitive, nodes are separated by `/`, and a line can be at most 800 bytes. The Ethernet port for LW3 is TCP 6107.

### How do you unroute one output without clearing the frame?
`CALL /MEDIA/XP/VIDEO:switch(0:O1)` disconnects output 1 in the manual's example. `switchAll(0)` is the separate command the tip describes as disconnecting every output.
