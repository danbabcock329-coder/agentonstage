---
title: "Trigger Avid VENUE S6L events over OSC"
slug: trigger-avid-venue-s6l-events-over-osc
category: "Audio"
tools: ["Avid VENUE S6L", "OSC"]
difficulty: Advanced
source_url: https://resources.avid.com/SupportFiles/VENUE/What's_New_in_VENUE_8.2.pdf
labels: ["Commercial product"]
summary: "VENUE 8.2 adds eight OSC connections on the S6L. Message, integer, or boolean triggers fire events. Paths longer than 256 characters are dropped."
---

## What it does

Avid's What's New in VENUE 8.2 guide adds Open Sound Control as event triggers and actions on VENUE | S6L. The guide calls 8.2 a feature release. OSC is configured on a new OSC tab on the Control page, between the Event and Mute Groups tabs.

The Connections list has eight slots. One slot is always selected, and the settings on the right follow that selection. The last slot is a predefined I/O Sharing Consoles connection. It is created automatically between Avid consoles that are sharing I/O, and only its Active checkbox can be changed. Its Status column shows how many other consoles are connected.

Each of the other connections is OFF, TCP Client, TCP Server, or UDP over ECx. OFF shows "Connection is not set up" and passes no OSC. TCP Client connects the console to an external OSC server. Its Network choice is AVB, from Control Surface Port C or D or an Engine MLN-192 card in AVB-HD mode, or ECx. Its OSC Version is v1.1 or v1.0 / Auto. Send To is a Bonjour service or a manual IP and port. TCP Server lets external clients connect in. It has the same Network choice, OSC Version v1.1 or v1.0, and a Local Port. UDP over ECx sends unicast or broadcast on the ECx network. Send To is a manual IPv4 address and remote port, and broadcast addresses are allowed. Receive Port is the local UDP port.

The list columns are Active, Name, Settings, and Status. Active controls whether VENUE sends or responds on that connection. Clearing it keeps the settings and stops both directions. Name is editable up to 64 characters. The guide's settings example is "TCP Server port 8000, UDP local 8000". Status text is OK in green when the connection is established, WAITING in amber when the settings are valid and the slot is waiting for clients, CONNECTING in amber when the settings are valid but the connection is not up yet, OFF in amber when the connection is fully disabled, and ERROR in red for an invalid configuration.

The Network Monitor under the list shows the 10 most recent incoming or outgoing messages for the selected connection. The list clears when the connection settings change. Messages that arrived while the connection was disabled are grayed out. Columns are direction (IN or OUT), path, type, and value. Types named in the guide are Integer, Float, String, True, False, Null, and Impulse. Copy to Event copies the selected path in as an OSC Message Received event. Copy Path copies the path for another event. Clear empties the list.

On the Events page the new triggers are OSC Message Received, OSC Integer, and OSC Boolean. Integer conditions are greater than, less than, and equal. Boolean is True or False. The Send OSC Message action has four parameters. Parameter 1 is the connection, shown as index plus user name. Parameter 2 is the OSC path. Parameter 3 is the type: None, Pulse, Integer, Float, String, True, or False. Parameter 4 is the value, and the guide says it is used only for Integer, Float, or String. Paths longer than 256 characters are discarded on receive. The same 256-character limit applies to string values in the action. A message with multiple values is split and processed as separate single-value messages.

The guide says 8.2 is available as a System Restore and as an Updater. Updating from VENUE 8.0 or later may use the Updater. Updating from VENUE 7.2.4 or earlier requires a System Restore, and the guide says to back up show files, presets, and other data first.

## How to set it up

1. Install VENUE 8.2. From 8.0 or later, the guide says you may use the Updater. From 7.2.4 or earlier, perform a System Restore on the control surface and the engine, then update the E6L BIOS and BMC as that chapter describes. Back up show files before a System Restore.
2. Open Control, then the OSC tab. Leave the I/O Sharing Consoles slot as it is unless you mean to disable OSC between sharing consoles. Pick another slot and set TCP Client, TCP Server, or UDP over ECx. The guide's settings summary uses port 8000 as the example for a TCP server and for a UDP local port.
3. Confirm Status is OK, WAITING, or CONNECTING rather than ERROR. Send one test message and read it in the Network Monitor. Use Copy to Event if that path should become an OSC Message Received trigger.
4. On the Events page, add OSC Message Received for a cue-style trigger, or OSC Integer or OSC Boolean when the value matters. Add Send OSC Message when the console should transmit. Keep the path and any string value at or under 256 characters. Send one value per message. The guide says a multi-value message is split into single-value messages.

Source: [What's New in VENUE 8.2](https://resources.avid.com/SupportFiles/VENUE/What's_New_in_VENUE_8.2.pdf).

## FAQ

### How many OSC connections does one S6L get?
The Connections section is a fixed list of eight. The last one is the predefined I/O Sharing Consoles connection, and only its Active checkbox can be edited.

### Which trigger uses the value, and which ignores it?
OSC Message Received fires for a message on the path. OSC Integer compares the integer with greater than, less than, or equal. OSC Boolean fires on True or False.

### Why would a message never arrive in the monitor?
The guide says paths longer than 256 characters are discarded on receive. Active has to be checked, and messages that arrived while the connection was disabled are shown grayed out. Status ERROR means the configuration is invalid.
