---
title: "Cut a Roland V-60HD over the LAN control port"
slug: cut-a-roland-v-60hd-over-lan
category: "LED/Video"
tools: ["Roland V-60HD", "TCP"]
difficulty: Intermediate
source_url: https://static.roland.com/assets/media/pdf/V-60HD_reference_v31_eng04_W.pdf
labels: ["Commercial product"]
summary: "The V-60HD reference manual for version 3.1 takes Telnet-style commands on TCP port 8023. Each command starts with byte 02 hex and ends in a semicolon. PGM:0 selects SDI IN 1, and CUT performs a cut."
---

## What it does

Roland's V-60HD Reference Manual for version 3.1 and later documents remote control on the CONTROL port. The LAN interface is Telnet over TCP, port 8023. The same command set is available on RS-232. The IP address is set under MENU, LAN CONTROL. CONFIGURE is either USING DHCP or MANUALLY. INFORMATION shows STATUS, IP ADDRESS, SUBNET MASK, and MAC ADDRESS.

Commands are ASCII. The manual writes the start of a command as `stx`, and it says that stands for the control byte 02 hex, not the letters s, t, and x. A command code is three letters. A colon separates the code from parameters. Commas separate multiple parameters. A semicolon ends the command. The response the manual lists for an accepted command is ACK, the byte 06 hex. It says to verify that ACK comes back before the next command. XON (11 hex) and XOFF (13 hex) are flow-control bytes.

`PGM:a` selects the final output. The parameter runs from 0, SDI IN 1, through 7, STILL/BKG IN 8. The steps in between are SDI IN 2, SDI IN 3, SDI IN 4, HDMI IN 5, HDMI/RGB IN 6, and STILL/BKG IN 7. `PST:a` uses the same numbers for the preset bus. `AUX:a` uses them for the AUX bus. `CUT` has no parameter and performs the same operation as the CUT button. `ATO` performs the AUTO button. `TRS:a` selects the transition: 0 is MIX, 1 is WIPE 1, 2 is WIPE 2. `TIM:a` sets the video transition time. The manual's range is 0, labeled 0.0 sec, through 40, labeled 4.0 sec.

`MEM:a` calls a preset memory. The parameter 0 is memory 1 and 7 is memory 8. `QPL:a` asks for panel status. `a` of 0 returns the PGM cross-point, 0 through 7. `VER` returns `VER:V-60HD` plus the version string. A bad command can come back as `ERR:a`. The manual's values are 0 for a syntax error, 4 when the command has no effect because another setting is in control, and 5 when an argument is out of range.

`TPT:a` sets a test pattern, including color bars, a ramp, a step, and a hatch. That replaces the program picture, so it stays off a live cut client.

## How to set it up

1. On the V-60HD, open MENU, LAN CONTROL, and set CONFIGURE to USING DHCP or enter a manual address. Open INFORMATION and read the IP ADDRESS the switcher is actually using.
2. Open a TCP connection to that address on port 8023. The manual describes this as Telnet over the CONTROL port.
3. Send byte 02 hex, then the ASCII `VER;`, and wait for byte 06 hex. The version reply is how you know the session is the V-60HD before a bus command.
4. Send byte 02 hex, then `PST:1;`, and wait for ACK. That selects SDI IN 2 on the preset bus. Send `PGM:0;` only when SDI IN 1 should be the program output. Send `CUT;` and wait for ACK when the preset bus should cut to program. `ATO;` runs the auto transition instead. `TIM` uses the manual's scale of 0 for 0.0 sec through 40 for 4.0 sec.
5. Recall a memory you have already saved with `MEM:0;` for memory 1, or `MEM:7;` for memory 8. Read the program cross-point back with `QPL:0;` before you send another bus command. Leave `TPT` out of the client. A test pattern replaces the output picture.

Source: [V-60HD Reference Manual, version 3.1 and later](https://static.roland.com/assets/media/pdf/V-60HD_reference_v31_eng04_W.pdf)

## FAQ

### Do you type the letters stx?
The manual uses `stx` as the name of the start byte, ASCII 02 hex. The three-letter code, the colon, the parameters, and the semicolon are the ASCII that follows that byte. ACK is byte 06 hex.

### What happens if the next command goes out before ACK?
The command list says to verify that an ACK is returned before sending the next command. An `ERR` reply uses 0 for a syntax error, 4 when another setting is in control, and 5 when an argument is out of range.

### Which number is SDI IN 1?
`PGM`, `PST`, and `AUX` use 0 for SDI IN 1. The manual's list ends at 7 for STILL/BKG IN 8. Preset memory is numbered the other way: `MEM` parameter 0 is memory 1, and 7 is memory 8.
