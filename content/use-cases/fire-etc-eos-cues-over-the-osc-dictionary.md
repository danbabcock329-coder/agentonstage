---
title: "Fire ETC Eos cues over the OSC dictionary"
slug: fire-etc-eos-cues-over-the-osc-dictionary
category: "Lighting"
tools: ["ETC Eos", "OSC"]
difficulty: Intermediate
source_url: https://www.etcconnect.com/WebDocs/Controls/EosFamilyOnlineHelp/en/Content/22_Show_Control/08_OSC/OSC_Dictionary.htm
labels: ["Commercial product"]
summary: "Eos OSC input starts with /eos. /eos/cue/1/1.5/fire runs cue 1.5 in list 1. ETC's QLab article enables OSC RX and uses UDP port 8000."
---

## What it does

The Eos Family online help splits OSC into a dictionary of address patterns and a control chapter. The control chapter says every OSC message sent to Eos must begin with `/eos`, and every OSC message sent from Eos begins with `/eos/out`. The dictionary's cue row is the playback set. `/eos/cue/fire=1` runs cue 1 in the current cue list. `/eos/cue/1.5/fire` runs cue 1.5 in the current cue list. `/eos/cue/1/1.5/fire` runs cue 1.5 in cue list 1. `/eos/cue/1/1.5/2/fire` runs cue 1.5 part 2 in cue list 1. The optional button-edge argument is a float, 1.0 for down, which is the default, and 0.0 for up.

The control chapter separates `/fire` from `/go`. `/fire` activates the specified cue regardless of sequence, and it is also used for other targets such as macros and presets. `/go` is specific to cues and cue lists and advances in sequence the way the Go button does. Selecting a cue, without running it, is `/eos/cue=1.5`, or `/eos/cue/1=1.5` for cue 1.5 in list 1.

Channel levels are in the same dictionary. `/eos/chan/1=50` sets channel 1 intensity to 50. `/eos/chan/1/out` sets channel 1 intensity to Out. `/eos/chan/1/param/pan=50` sets pan to 50. A command-line string is `/eos/cmd`. The dictionary's examples include `/eos/cmd="Chan 1 At 75"`, which it calls unterminated, and `/eos/cmd="Chan 1 At 75#"`, where Eos treats `#` as the termination. `/eos/ping` is the connection test. Eos answers on its configured port with `/eos/out/ping/`.

Shaded dictionary rows can also start with `/eos/user/` instead of `/eos`, aimed at a user id from 0 to 99. If that user is not on the host, a virtual OSC user is created and stays in effect until it is changed. `/eos/user/-1` returns from a virtual OSC user to the default. With no user id, the command uses the current Eos user.

ETC's support article on triggering Eos from QLab, written against Eos 3.2.8, is the setup walkthrough. It says earlier versions laid the show-control and network settings out differently. OSC RX is enabled under Setup, System Settings, Show Control, OSC. The article sets OSC RX Port to 8000 and says that number is arbitrary as long as it matches the sender. It leaves OSC Cue Recv String blank for native `/eos` strings, and leaves OSC TCP Mode at Packet Length (v1.0). On the network port, UDP Strings & OSC must be ticked. The article says the sender has to target the primary console, not a backup or a client. The control chapter puts OSC Cue Receive String and OSC Cue Send String under Setup, System, Show Control. Those strings can be overridden on a cue list with Cue Triggers.

The same article says QLab 5 can open a TCP connection to Eos on port 3032, or on the third-party port 3037. It also says that, at least as of QLab 5.4.7, QLab closes that TCP connection after 3 seconds of inactivity.

## How to set it up

1. On the console, open Setup, Device Settings, Network and confirm the port you will use has UDP Strings & OSC enabled. The support article's example address is 10.101.92.101 on an Eos Ti port 1. Put the sender in that same subnet.
2. Open Setup, System Settings, Show Control, OSC. Set OSC RX to Enabled. Set OSC RX Port to 8000, or to another port if the sender will use that other port. The article says the number only has to match. Leave OSC Cue Recv String blank when you will send `/eos/...` addresses. Leave OSC TCP Mode at Packet Length (v1.0) for the article's UDP path.
3. Send `/eos/ping` and look for `/eos/out/ping/` on the transmit port Eos is using. Hold Tab and type 99 to open diagnostics. Turn Incoming OSC on. A cue command that arrives is visible there even when the cue itself does not run.
4. Fire cue 1.5 in cue list 1 with `/eos/cue/1/1.5/fire`. Fire cue 1.5 in the current list with `/eos/cue/1.5/fire`. The control chapter says `/go` advances in sequence the way the Go button does. The support article's explicit Go press is `/eos/key/go_0`.
5. Set a level with `/eos/chan/1=50`, or send `/eos/cmd="Chan 1 At 75#"` when you want a terminated command line. Point the sender at the primary. The article says a backup or a client will not run this path.

Source: [Eos OSC dictionary](https://www.etcconnect.com/WebDocs/Controls/EosFamilyOnlineHelp/en/Content/22_Show_Control/08_OSC/OSC_Dictionary.htm), [OSC Eos control](https://www.etcconnect.com/WebDocs/Controls/EosFamilyOnlineHelp/en/Content/22_Show_Control/08_OSC/Using_OSC_with_Eos/OSC_Eos_Control.htm), and [Triggering Eos from QLab using OSC](https://support.etcconnect.com/ETC/Consoles/Eos_Family/Software_and_Programming/Triggering_Eos_from_QLab_using_OSC).

## FAQ

### What is the difference between fire and go?
The control chapter says `/fire` activates the specified cue regardless of sequencing. `/go` advances in sequence the way the Go button does, and it applies to cues and cue lists.

### Does port 8000 have to stay 8000?
The support article calls 8000 an arbitrary number that has to match the sender. OSC RX has to be Enabled, and UDP Strings & OSC has to be ticked on the network port you are using. The article is based on Eos 3.2.8 and says earlier software arranged these settings differently.

### Is this the Eos MCP server?
No. [Agent control of ETC Eos and Nomad over OSC](/use-cases/agent-control-of-etc-eos-and-nomad-over-osc) is a separate MCP server that speaks this OSC interface. The addresses on this page are the ones in the Eos family dictionary.
