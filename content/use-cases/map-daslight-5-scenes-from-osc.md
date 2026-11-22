---
title: "Map Daslight 5 scenes from OSC"
slug: map-daslight-5-scenes-from-osc
category: "Lighting"
tools: ["Daslight 5", "OSC", "UDP"]
difficulty: Intermediate
source_url: https://storage.googleapis.com/nicolaudie-us-litterature/Release/daslight_5_manual_en.pdf
labels: ["Commercial product"]
summary: "Daslight 5 learns an OSC message onto a scene, fader, or dial. The v1.4 manual uses the OSC tab and the OSC Mappings overlay. A forum reply puts the default ports at 7000 and 7001."
---

## What it does

The Daslight 5 English manual, marked v1.4 and linked from the download page as the English manual dated 2025-07-24, documents OSC as one of the mapping types. The mapping-options section lists MIDI, keyboard, DMX input, dry contact, and OSC, plus Touch mapping for Daslight's own touch screen. Section 5.6 is the OSC procedure.

Section 5.6 says OSC messages reach Daslight 5 over UDP/IP and Ethernet. In Settings, the OSC tab has checkboxes for OSC Input and OSC Output. The Incoming Port is the port Daslight receives on. The Outgoing Port is the port it returns messages to. OSC Output can be Broadcast, Local Host, or IP Address. IP Address requires the destination address. The manual does not print a default port number and does not print a fixed address list. A mapping is learned: the software stores the message you send while a function is selected.

The OSC Mappings tool is in the top right of the screen or under the Mappings menu. It shows a dark blue overlay of assignable functions. The steps are to select the function, and the examples named are a scene play button and a dimmer dial, then trigger the OSC control that should fire it. Mapping settings are edited afterward from the mappings list. While the overlay is up, Shift plus left click triggers a function that sits underneath the overlay, such as playing a scene or opening another window.

Section 7.5 is the MIDI/OSC watcher. The OSC tab shows incoming messages with Address, Type, Value, and Device. That is the view to use while learning a mapping, so the address that arrived is the address that got stored.

A forum reply from Javier.Cordova, posted 17 November 2025, describes the same OSC tab and adds the defaults the manual omits. It says the incoming and outgoing ports default to 7000 and 7001, and that they can be changed. For TouchOSC it says to use a UDP connection, set the send port to Daslight's incoming port, and set the receive port to Daslight's outgoing port. The reply points at the OSC Mappings tool for the actual assignment. It does not print an address pattern.

## How to set it up

1. Open Settings, OSC. Turn on OSC Input. Turn on OSC Output only if Daslight should send messages back. Choose Broadcast, Local Host, or an IP address for that output. Read the Incoming Port on that tab. The support reply says a fresh tab shows 7000 in and 7001 out.
2. Open the OSC watcher from Tools and leave the OSC tab visible. Send one message from the controller. Confirm the Address, Type, and Value that arrived before you map anything.
3. Open OSC Mappings. Select the scene play button, fader, button, or dial on the blue overlay. Trigger the OSC message once. Select the new row in the mappings list and check its settings.
4. Close the overlay and send that same message again. The manual's mapping step is learn-then-trigger. It does not document an address that works before it has been learned onto a function.
5. Use Shift plus left click when you need to operate a control hidden by the overlay. That chord is the manual's way to play a scene or change windows during mapping.

Source: [Daslight 5 manual, English, v1.4](https://storage.googleapis.com/nicolaudie-us-litterature/Release/daslight_5_manual_en.pdf), sections 5.6 and 7.5, and [Javier.Cordova's forum reply on default ports](https://forum.daslight.com/viewtopic.php?t=9800).

## FAQ

### Is there a built-in /scene address?
Section 5.6 does not print one. You select a scene play button and send the message you want stored. The watcher shows the address Daslight actually received.

### Are 7000 and 7001 in the manual?
The v1.4 text names Incoming Port and Outgoing Port and does not print numbers. Javier.Cordova's 17 November 2025 reply says those fields default to 7000 and 7001 and that you can change them. The port in the Settings tab is the one to send to.

### Does OSC Output choose the receive port?
OSC Output is the return path. Its choices are Broadcast, Local Host, or a specific IP. The Incoming Port is the one Daslight listens on. The support reply matches TouchOSC's send port to that incoming port.
