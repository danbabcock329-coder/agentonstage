---
title: "Solo a KLANG channel over OSC"
slug: solo-a-klang-channel-over-osc
category: "Audio"
tools: ["KLANG", "OSC", "UDP"]
difficulty: Intermediate
source_url: https://www.klang.com/manuals/osc-reference-documentation/
labels: ["Commercial product"]
summary: "KLANG processors take OSC on UDP 9110. /Kf/ui/1/ch/5/solo b true solos channel 5 in mix 1. KLANGosc only confirms the packet left the computer."
---

## What it does

KLANG's OSC reference says KLANG:app and the immersive in-ear processors talk OSC over UDP. Messages to a processor go to port 9110. Messages to KLANG:app go to 9111 by default. The address prefix is `/Kf` or `/KLANGfabrik` for the hardware, and the page says that prefix is the same whether the processor is a :fabrik or another model. `/Ka` is the app. The same page says routing and configuration of the Dante modules inside KLANG:fabrik, KLANG:vier, and KLANG:vokal cannot be remote controlled this way.

Short addresses do not need the handshake. The handshake section says a connect request and a switch-user command are required before long-format messages, and that this handshake is not required for the short syntax. A channel solo is one of those short addresses: `/Kf/ui/<mix>/ch/<channel>/solo` with a bool. Mute is `/Kf/ui/<mix>/ch/<channel>/mute` with a bool. The KLANGosc page's worked example, on a processor at 192.168.1.163, is `KLANGosc 192.168.1.163 9110 /Kf/ui/1/ch/5/solo b true`, which it describes as soloing channel 5 in mix 1. The next example on that page is `/Kf/ui/1/ch/5/gaindB f -6`. Its argument table allows a bool as `true` or `false`, or as `1` or `0`.

The on-screen confirmation is not a device reply. The KLANGosc page prints `sent /Kf/ui/1/ch/5/solo (24 bytes) to 192.168.1.163:9110` and says OSC is one-way over UDP, so that line confirms the message left the computer. The reference says most commands can be tried against the Offline Editor under CONFIG, CONNECT, OFFLINE EDITOR, at 127.0.0.1 port 9110.

Mix master level is a different address. `/Kf/ui/<mix>/gain` takes a float from 0, printed as minus infinity dBFS, to 1, printed as 0 dBFS, linear. Snapshot recall by position is `/Kf/co/recallInd` with an integer. The reference says the index is zero-based and that the first snapshot is index 0. The long create-snapshot address is printed as `/KLANGfabrik/control/TakeSnaphot`. The short one is `/Kf/co/takeSnapshot`. A show-file change is `/KLANGfabrik/control/presetSelect` with a string that must match the preset name exactly, case-sensitive, without the ending the page writes as `.xml/KLANGshow`.

## How to set it up

1. Send processor commands to UDP port 9110. The reference says 9111 is the app port, and the :kontroller dark-mode lines on that page also use 9111. Read the app's receive port under CONFIG, CONNECT, if you are talking to KLANG:app rather than the processor.
2. Solo with the short address. The KLANGosc example is `/Kf/ui/1/ch/5/solo` and `b true` for channel 5 of mix 1. Use the mix and channel numbers shown under CONFIG, CHANNELS, INPUT. The reference says the short form does not need the connect handshake.
3. Treat the KLANGosc "sent" line as a local transmit check. The page says it does not confirm that the processor acted. Try the same address at 127.0.0.1 port 9110 against the Offline Editor before pointing it at a show processor.
4. Recall a stored mix with `/Kf/co/recallInd` and a zero-based index. Index 0 is the first snapshot in the list the reference describes. `/KLANGfabrik/control/presetSelect` needs the show name exactly, without the `.xml/KLANGshow` ending.
5. Do not use this port for Dante subscriptions. The reference says those modules are not remote controlled here. Do not send `/KLANGfabrik/Hardware/Restart`. The reference describes that address, with no arguments, as a restart.

Source: [KLANG OSC reference](https://www.klang.com/manuals/osc-reference-documentation/) and [KLANGosc](https://www.klang.com/manuals/klangosc/).

## FAQ

### Does the solo need a handshake?
The reference says the handshake is required for long-format messages, because the user number is not in the address. It says the handshake is not required for the short syntax. `/Kf/ui/1/ch/5/solo` is the short form in the KLANGosc example.

### What does the "sent" line prove?
The KLANGosc page says the on-screen confirmation means the packet left the computer. It says OSC over UDP does not confirm that the device acted on it.

### Why does one snapshot address say TakeSnaphot?
The reference prints the long create address as `/KLANGfabrik/control/TakeSnaphot` and the short address as `/Kf/co/takeSnapshot`. Recall by list position is a third address, `/Kf/co/recallInd`, and the page says the first snapshot is index 0.
