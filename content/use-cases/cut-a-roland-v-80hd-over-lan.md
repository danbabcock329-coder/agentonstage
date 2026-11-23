---
title: "Cut a Roland V-80HD over LAN"
slug: cut-a-roland-v-80hd-over-lan
category: "LED/Video"
tools: ["Roland V-80HD", "TCP"]
difficulty: Intermediate
source_url: https://static.roland.com/assets/media/pdf/V-80HD_Control_eng01_W.pdf
labels: ["Commercial product"]
summary: "The V-80HD control guide uses Telnet on TCP 8023 and an eight-character network password. PGM:INPUT2; selects program. CUT; takes when split is off."
---

## What it does

Roland's V-80HD Remote Control Guide, model V-80HD, version 1.03, dated August 28, 2024, puts LAN control on the LAN CONTROL jack. The LAN interface section says you use Telnet over TCP/IP. The communication-standards line prints TCP port number 8023. MENU, Network, LAN Setup is where Configure is either DHCP or manual, and where the IP address, subnet mask, and default gateway are shown. The command-format steps say to set a network password of eight characters and to input that password when a computer on the same network connects. The command table does not print the password bytes.

Commands are ASCII and are shared with RS-232. The form is a command code, a colon, parameters separated by commas, and a semicolon. The sent-command column prints `VER;` for version information. The response column prints `stxVER:a,b;`, with `a` the product name V-80HD and `b` a version number. The printed version in that cell is 1.00. A parameter write is `DTH:a,b;`. The guide's example of writing 01 hex at address 12 hex 34 hex 56 hex is `DTH:123456,01;`. The response cell is `stxACK;`. A read is `RQH:a,b;`, and the response form is `stxDTH:a,c;`. `stxERR:a;` uses 0 for a syntax error, 4 when another setting makes the command have no effect, and 5 when an argument is out of range. The guide says `stx` is 02 hex, and `xon` and `xoff` are 11 hex and 13 hex.

The 2025 basic-commands manual includes the V-80HD in the same list as the V-160HD, VR-120HD, VR-6HD, and V-1-4K. It says those text commands can be used at the same time as the regular commands, and that a response sends 0A hex after the semicolon. `PGM:INPUT2;` selects INPUT2 for the program video and the response example is `ACK;`. On a V-80HD the program argument can be HDMI1 through HDMI4, SDI1 through SDI4, STILL1 through STILL32, V.PLAYER, SRT, or INPUT1 through INPUT16. `QPGM;` is the read. The printed response is `PGM:HDMI2,INPUT2;ACK;`. `CUT;` and `CUT:a;` switch with a cut, and the manual says that command is enabled when SPLIT is off. `VFL` on the V-80HD row runs from 0 to 4095. The V-80HD AUX buses in that table are AUX1 and AUX2.

[Cut a Roland V-160HD over its basic LAN commands](/use-cases/cut-a-roland-v-160hd-over-its-basic-lan-commands) is the V-160HD guide. That page's password length is four characters. This page's V-80HD guide says eight.

## How to set it up

1. On the V-80HD, set the eight-character network password the control guide describes, and read the IP address under MENU, Network, LAN Setup. Open TCP port 8023. The guide says to input that password when a computer on the same network connects. It does not print the password bytes.
2. Send `VER;` and read `stxVER:`. The response parameter list says the product name is V-80HD. A syntax error comes back as `stxERR:0;`.
3. Select program with `PGM:INPUT2;` only when INPUT2 is the source you mean. The V-80HD argument list also includes HDMI1 through HDMI4, SDI1 through SDI4, STILL1 through STILL32, V.PLAYER, and SRT. Read it back with `QPGM;`. The printed success body is `PGM:HDMI2,INPUT2;ACK;`.
4. Send `CUT;` while SPLIT is off. The basic-commands manual says the cut is enabled in that state. `CUT:a;` takes the same source list as `PGM:a;`.
5. Use `DTH:` only with an address from the guide's parameter map. `stxERR:5;` is the out-of-range reply. `stxERR:4;` is the reply when another setting makes the write have no effect.

Source: [V-80HD Remote Control Guide, version 1.03](https://static.roland.com/assets/media/pdf/V-80HD_Control_eng01_W.pdf) and [LAN/RS-232 Basic Control Commands](https://static.roland.com/assets/media/pdf/LAN_RS-232_Basic_Control_Commands_eng02_W.pdf).

## FAQ

### Is the V-80HD password four characters?
The V-80HD control guide says eight characters. The V-160HD guide, linked above, says four. Both guides put LAN control on TCP port 8023.

### Does CUT work while split is on?
The basic-commands manual says `CUT;` and `CUT:a;` are enabled when SPLIT is off. It does not print a separate cut for the split-on state. `PGM:a;` is the select, and `CUT;` is the take.

### What is stx on a LAN write?
The V-80HD guide's sent-command cell prints `DTH:123456,01;` and `VER;` without a leading `stx`. The response cells print `stxACK;` and `stxVER:a,b;`. `stx` is defined there as 02 hex. The basic-commands responses end with a semicolon and then 0A hex.
