---
title: "Cut a Roland V-160HD over its basic LAN commands"
slug: cut-a-roland-v-160hd-over-its-basic-lan-commands
category: "LED/Video"
tools: ["Roland V-160HD", "TCP"]
difficulty: Intermediate
source_url: https://static.roland.com/assets/media/pdf/V-160HD_Control_eng06_W.pdf
labels: ["Commercial product"]
summary: "V-160HD takes Telnet on TCP 8023. PGM:INPUT2; selects that input and CUT; takes it when split is off. Set a four-character LAN password in the menu."
---

## What it does

Roland's V-160HD remote control guide says the LAN CONTROL port is a Telnet connection over TCP/IP, on TCP port 8023. Under MENU, LAN CONTROL, CONFIGURE is either USING DHCP or MANUAL. MANUAL is where the IP address, subnet mask, and default gateway are set. NETWORK PASSWORD is a separate screen. The guide says to set a network password of four characters, and to input that password when a computer on the same network connects to the switcher. The command list does not print the password bytes.

Commands are ASCII and are shared with RS-232. The guide's form is `stx`, then a three-character command code, then parameters separated by a colon and commas, then a semicolon. `stx` is the byte 02 hex. The same page says that when you control the switcher over LAN Telnet, `stx` may be omitted. The error list includes `stxERR:6;` for a command with no `stx`, and it marks that error as RS-232 only.

A parameter write is `stxDTH:a,b;` and the response is `ack`. The guide's example of writing 01 hex to address 12 hex 34 hex 56 hex is `stxDTH:123456,01;`. A read is `stxRQH:a,b;`, and the response form is `stxDTH:a,c;`. In that table, `a` is a three-byte SysEx address, `b` on a read is a three-byte size, and `c` is the value. Other `stxERR` values in the table are 0 for a syntax error, 4 when another setting makes the command have no effect, and 5 when an argument is out of range.

The button map lists the CUT button at 0B hex 00 hex 1E hex, write only, with 00 hex for release and 01 hex for press. The checksum example says the PGM Select address is 00 hex 21 hex 00 hex, and that the INPUT 2 parameter there is 01 hex. HDMI IN 3 tally is 0C hex 00 hex 02 hex, read only, with 00 hex through 03 hex meaning OFF, PGM, PST, and PGM and PST.

The separate basic-commands manual covers the V-160HD along with the V-80HD, VR-120HD, VR-6HD, and V-1-4K. It says those text commands can be used at the same time as the regular commands, that they are ASCII, and that a response sends 0A hex (line feed) after the semicolon. `PGM:INPUT2;` selects INPUT2 for the program video and the response example is `ACK;`. On a V-160HD the program argument can be HDMI1 through HDMI8, SDI1 through SDI8, STILL1 through STILL16, or INPUT1 through INPUT20. `QPGM;` is the read. The printed response is `PGM:HDMI2,INPUT2;ACK;`. `CUT;` switches with a cut, and the manual says that command is enabled when SPLIT is off. `QVISRC:0;` checks video input source 0, and the printed response is `VISRC:0,HDMI1;ACK;`. `VFL` sets the video fader. On the V-160HD the range in that table is 0 to 2047, and the example `VFL:1024;` is answered with `ACK;`.

## How to set it up

1. On the switcher open MENU, LAN CONTROL. Leave CONFIGURE on USING DHCP, or set MANUAL and fill in the IP address, subnet mask, and default gateway. Open NETWORK PASSWORD and set four characters.
2. From a machine on that network, open a TCP connection to the switcher's IP on port 8023. The guide says to input the network password when connecting. It does not print the password command.
3. Send `QVISRC:0;` and wait for a `VISRC` line ending in `ACK;` plus a line feed. Then send `PGM:INPUT2;` and `QPGM;` before you take it.
4. Send `CUT;` only when SPLIT is off. The basic-commands manual says that is when the cut command is enabled.
5. For the panel CUT button, the map address is 0B hex 00 hex 1E hex, write only. 01 hex is press and 00 hex is release. The command list's write example is `stxDTH:` plus six address digits, a comma, and the value. The guide says `stx` may be omitted on LAN Telnet.

Source: [V-160HD remote control guide](https://static.roland.com/assets/media/pdf/V-160HD_Control_eng06_W.pdf) and [LAN/RS-232 basic control commands](https://static.roland.com/assets/media/pdf/LAN_RS-232_Basic_Control_Commands_eng02_W.pdf). The [V-60HD LAN entry](/use-cases/cut-a-roland-v-60hd-over-lan) is a different switcher and a different command list.

## FAQ

### Does every command need the 02 hex prefix?
The remote control guide says `stx` may be omitted for LAN Telnet. The missing-`stx` error is marked RS-232 only. The basic text commands such as `PGM:INPUT2;` and `CUT;` are documented without that prefix.

### Is INPUT 2 the value 02 hex on PGM Select?
The checksum section of the remote control guide says the PGM Select address is 00 hex 21 hex 00 hex and the INPUT 2 parameter is 01 hex. The basic-commands manual selects that input with the text `PGM:INPUT2;` instead of a raw value.

### Will CUT work in split?
The basic-commands manual says `CUT;` switches video using a cut, and that this is enabled when SPLIT is off.
