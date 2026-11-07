---
title: "Fire Show Cue System cues over OSC"
slug: fire-show-cue-system-cues-over-osc
category: "Show Control"
tools: ["Show Cue System", "OSC"]
difficulty: Intermediate
source_url: https://showcuesystems.com/scs11help/topics/prod-cc-network.htm
labels: ["Commercial product"]
summary: "SCS Professional Plus takes OSC over TCP or UDP. /cue/go with string Q90 plays that cue. /ctrl/go is the Go button. Messages may start with /scs."
---

## What it does

Show Cue Systems documents network cue control for SCS 11. The page says Network (TCP/UDP) Cue Control is only available with SCS Professional Plus and higher license levels. You add it as a Cue Control Device. SCS can list up to four of those devices. The page says more than one is uncommon, so most shows use the C1 entry.

The device settings include a network protocol of TCP or UDP when that field is enabled, and a network role. SCS is a Network Client when it connects to a host you name, with that host's name or IP and the port the host is listening on. SCS is a Network Server when it listens on the port you enter. Dummy Network Connection is for writing Control Send cues when this computer has no suitable network connection. A button lists this computer's IPv4 addresses so the client can be pointed at the wireless or Ethernet address that actually reaches the SCS machine.

The same page maps incoming messages to SCS actions. OSC is not plain text. The page says an OSC command is an address, an optional type-tag string, and then the values. The tags it describes use `,s` for a string and `,f` for a float. Incoming OSC may start with `/scs`, so `/scs/ctrl/go` is the same Go as `/ctrl/go`. Cue labels in these commands are not case-sensitive.

Transport commands with no argument: `/ctrl/go` is the Go button. `/ctrl/stopall` is Stop All. `/ctrl/pauseresumeall` is Pause or Resume All. `/ctrl/gotop` is Go To Top. `/ctrl/goback` is Go Back. `/ctrl/gotonext` is Go To Next. `/ctrl/gotoend` is Go To End. `/ctrl/goto` with a string argument is Go To Cue. The page's example label is Q90.

Cue and hotkey commands take that string argument. `/cue/go` plays the cue. `/cue/stop` stops it. `/cue/pauseresume` pauses or resumes it. `/hkey/go` activates a hotkey, and the example is A. `/hkey/on` and `/hkey/off` start and stop a note hotkey. The page says a note hotkey operates the same as activate hotkey.

Fader commands use a float in dB. `/fader/setmaster` sets the master. `/fader/setmasterrel` adds to it, so the page's example of -3 lowers the current master by 3 dB. `/fader/setdevice` takes the device name and the dB value. The example device is Front. `/fader/setdevicerel` adjusts that device the same way. The page says values outside the permitted range, and gives -75 dB to 0 dB as the example, are capped.

The page also lists ASCII forms for some of the same actions, such as `scsGo("0")` for Go and `scsGo("x")` for play cue. An ASCII command can end with a carriage return or a pipe character. The example `SCSGo("q90")` fires a cue labeled Q90.

## How to set it up

1. On an SCS Professional Plus or higher license, open Production Properties, Cue Control Devices, and add a Network device. Pick TCP or UDP, then Client or Server. For a server, set Listen on Port No. and use This Computer's IPv4 Addresses to tell the sender which address to use.
2. Send a real OSC message, not the address typed as text. `/ctrl/go` hits Go. `/cue/go` with the string `Q90` plays that cue. A sender that must prefix every address can send `/scs/ctrl/go` instead.
3. Set a level with `/fader/setmaster` and a float, for example -12. Use `/fader/setdevice` with the device name and a float when the change is one output, such as Front. Relative commands use `/fader/setmasterrel` and `/fader/setdevicerel`.
4. Click Test Network Control. The page says the Network Test window shows incoming messages, and shows the mapping when SCS recognizes the message for cueing. Clear empties the window.

Source: [SCS 11, Production Properties, Cue Control Devices, Network](https://showcuesystems.com/scs11help/topics/prod-cc-network.htm).

## FAQ

### Which license can receive these messages?
The page says Network (TCP/UDP) Cue Control is only available with SCS Professional Plus and higher license levels.

### Does the cue label have to match the case in the cue list?
No. The page says the network commands and the cue labels in them are not case-sensitive, and that `SCSGo("q90")` fires a cue labeled Q90.

### What happens to a fader value that is out of range?
The page says values outside the permitted range are capped. The range it gives as the example is -75 dB to 0 dB.
