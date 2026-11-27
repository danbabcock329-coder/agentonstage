---
title: "Cut a Roland VR-120HD and start its stream over LAN"
slug: cut-a-roland-vr-120hd-and-start-its-stream-over-lan
category: "LED/Video"
tools: ["Roland VR-120HD", "TCP"]
difficulty: Intermediate
source_url: https://static.roland.com/assets/media/pdf/VR-120HD_Control_eng04_W.pdf
labels: ["Commercial product"]
summary: "The VR-120HD guide 2.00 takes Telnet on TCP 8023. PGM:INPUT2; selects that input. STROA:START starts stream and record when the type is RTMP."
---

## What it does

Roland's VR-120HD remote control guide, version 2.00, dated September 4, 2024, says the switcher supports LAN and RS-232. The LAN path uses the LAN CONTROL jack as Telnet over TCP/IP. The communication table lists TCP port 8023. MENU, LAN Setup, Configure is either Using DHCP or Manually. Manually is where the IP address, subnet mask, and default gateway are set. Network Password is a four-character password. The guide says to input that password when a computer on the same network connects. It does not print the password bytes.

Commands are ASCII and are shared with RS-232. The form is `stx`, a three-character command code, parameters separated by a colon and commas, then a semicolon. `stx` is byte 02 hex. The command list says that on LAN Telnet, `stx` may be omitted. `stxERR:6` is a command with no `stx`, and that error is marked RS-232 only. Other `stxERR` values are 0 for a syntax error, 4 when another setting makes the command have no effect, and 5 when an argument is out of range.

`stxVER;` reads the version. The response parameters are the product name `VR-120HD` and a version number. The printed example of that number is `1.00`. A parameter write is `stxDTH:a,b;` and the response is `ack`. The guide's example of writing 01 hex to address 12 hex 34 hex 56 hex is `stxDTH:123456,01;`. The address table lists PGM Select at 00 hex 1B hex 00 hex, values 00 hex through 24 hex, named HDMI In 1 through 6, SDI In 1 through 6, Still 1 through 16, Video Player/SRT In, and Input 1 through 8. The CUT button is at 02 hex 03 hex 09 hex, write values 00 hex off and 01 hex on.

The separate basic-commands manual, marked 02 and © 2025 Roland, says those text commands can be used at the same time as the regular commands, and that a response sends 0A hex (LF) after the semicolon. `PGM:INPUT2;` selects INPUT2 for program, and the printed response is `PGM:HDMI2,INPUT2;ACK;`. On a VR-120HD the program argument can be HDMI1 through HDMI6, SDI1 through SDI6, STILL1 through STILL16, V.PLAYER, SRT, or INPUT1 through INPUT8. `CUT;` switches with a cut when SPLIT is off. `CUT:` plus a source does the same with the source named. `STRTY:RTMP` or `STRTY:SRT` sets the stream and record type. `STROA:START` and `STROA:STOP` start and stop it, and the manual says that command is enabled when the type is RTMP. `SRTOSS:START` and `SRTOSS:STOP` start and stop SRT out, enabled when the type is SRT. `QSTRST;` returns `STOP`, `STOPPING`, `STARTING`, or `ONAIR`. `QMEM;` returns `N/A` or `MEMORY1` through `MEMORY32`.

## How to set it up

1. On the switcher open MENU, LAN Setup. Leave Configure on Using DHCP, or set Manually and fill in the IP address, subnet mask, and default gateway. Set Network Password to four characters.
2. From a machine on that network, open a TCP connection to the switcher's IP on port 8023. The guide says to input the network password when connecting. It does not print the password command.
3. Send `VER;` and wait for a line that names `VR-120HD`. Then send `QPGM;` before you change program. The basic-commands response ends with `ACK;` and a line feed.
4. Send `PGM:INPUT2;` or a VR-120HD source such as `PGM:V.PLAYER;` or `PGM:SRT;`. Send `CUT;` only when SPLIT is off.
5. Read `QSTRTY;` before starting a stream. `STROA:START` is the RTMP start. `SRTOSS:START` is the SRT-out start. `QSTRST;` returns `STOP`, `STOPPING`, `STARTING`, or `ONAIR`. `QSTRTM;` returns elapsed seconds. The printed example is `STRTM:30;ACK;`.

Source: [VR-120HD remote control guide, version 2.00](https://static.roland.com/assets/media/pdf/VR-120HD_Control_eng04_W.pdf) and [LAN/RS-232 basic control commands](https://static.roland.com/assets/media/pdf/LAN_RS-232_Basic_Control_Commands_eng02_W.pdf). The [V-160HD LAN entry](/use-cases/cut-a-roland-v-160hd-over-its-basic-lan-commands) is a different switcher. Its program list has no V.PLAYER or SRT, and the basic-commands stream commands are not listed for it.

## FAQ

### Does STROA:START work when the type is SRT?
The basic-commands manual says `STROA` is enabled when Type is RTMP. The SRT-out start and stop is `SRTOSS`, enabled when Type is SRT. `QSTRST;` is the status read for both, and `ONAIR` is one of the four values it prints.

### Is the CUT button the same command as CUT;?
No. The control guide's panel map writes the CUT button at 02 hex 03 hex 09 hex, 00 hex off and 01 hex on, through `DTH`. The basic-commands manual sends the text `CUT;` or `CUT:` plus a source, and says that cut is enabled when SPLIT is off.

### Does the guide print the LAN password?
It says to set four characters and to input that password when connecting. It does not print the bytes the client sends.
