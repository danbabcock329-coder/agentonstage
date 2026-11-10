---
title: "Cue PlaybackPro Plus over UDP and TCP"
slug: cue-playbackpro-plus-over-udp-and-tcp
category: "Show Control"
tools: ["PlaybackPro Plus", "UDP", "TCP"]
difficulty: Intermediate
source_url: https://www.dtvideolabs.com/resources/PlaybackProPlusUserGuide.pdf
labels: ["Commercial product"]
summary: "PlaybackPro Plus 3.8 listens for UDP on port 7000 and TCP on port 4647. TA takes the preview clip. GTxxxx loads a clip and takes it."
---

## What it does

The PlaybackPro Plus 3.8 User Guide, marked 3.8a, documents remote control of the macOS playback application. The Network Setup menu has five choices. No Control stops all listening. UDP Listen and TCP/IP Listen take commands from another system on Ethernet. DT18 is the DT Videolabs controller for up to four systems. SimpleSync is the free multi-sync companion. The overview says the application also plays stills and crossfades, and that it is a non-linear player for macOS.

For a show-control client, choose UDP Listen or TCP Listen from Network Setup. The UDP section says PlaybackPro Plus listens for commands on port 7000, and that the controlling device should use a static IP. The TCP section says it listens for a connection on port 4647. After the client connects, Network Status shows TCP/IP Connected rather than TCP/IP Listening. The guide says to disconnect the remote source before you select a different remote option.

The command table is shared by UDP and TCP. `PR` is Previous Clip. `NX` is Next Clip. `CL` clears Preview. `GOxxxx` loads clip xxx into Preview. `GTxxxx` loads clip xxx and takes it. `TA` is Take. `KL` is End All, and the table notes that this command was previously Kill. `PA` is Pause. `PL` plays from the current location. `PS` is Playback Status. `GN` returns the program clip name, `GU` the program clip number, and `GD` the program clip duration. `TE` is program time elapsed and `TR` is program time remaining. `10`, `20`, and `30` are Goto 10, Goto 20, and Goto 30. `SIxxxx` selects a clip by ID and `TIxxxx` takes a clip by ID.

The same table has preview and program transport tokens: `EI` and `OI` go to the in point, `EO` and `OO` go to the out point, and `EP` and `OP` toggle play and pause. `sa` saves. `BF` brings the window to the front. `SF` returns the show file name. `AN` returns all clip names, comma delimited, and the guide says commas inside names are replaced with periods.

## How to set it up

1. On the PlaybackPro Plus Mac, open Network Setup and choose UDP Listen or TCP Listen. No Control is the menu item that stops listening. On the controller, enter the Mac's address. The UDP section says that controlling device should use a static IP.
2. For UDP, send the command text to port 7000. For TCP, connect to port 4647 and wait until Network Status reads TCP/IP Connected. Disconnect that socket before you change the Network Setup choice.
3. Load a clip into preview with `GOxxxx`, using the clip number in place of `xxxx`. Read it back with `VN` for the preview name or `VU` for the preview number. `CL` clears preview.
4. Put that clip on program with `TA`. `GTxxxx` is the single command that loads clip xxx and takes it. `PL` plays from the current location and `PA` pauses. `PS` is the status read.
5. `KL` is End All. The keyboard section lists End All as Escape, and the command table says `KL` was previously Kill. Send it only when the program output should end.

Source: [PlaybackPro Plus 3.8 User Guide](https://www.dtvideolabs.com/resources/PlaybackProPlusUserGuide.pdf).

## FAQ

### Are the UDP and TCP ports the same?
The UDP subsection says the listen port is 7000. The TCP subsection says the connection port is 4647. The command words in the shared table are the same on both.

### What is the difference between GO and GT?
`GOxxxx` loads clip xxx into Preview. `GTxxxx` loads clip xxx and takes it. `TA` takes whatever is already in preview. `SIxxxx` and `TIxxxx` are the select-by-ID and take-by-ID pair.

### How do you know TCP is attached?
The guide says Network Status changes from TCP/IP Listening to TCP/IP Connected. Disconnect the client before choosing another remote option, including No Control.
