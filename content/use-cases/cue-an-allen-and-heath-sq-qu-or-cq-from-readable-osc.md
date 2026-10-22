---
title: "Cue an Allen & Heath SQ, Qu or CQ from readable OSC"
slug: cue-an-allen-and-heath-sq-qu-or-cq-from-readable-osc
category: "Audio"
tools: ["Allen & Heath SQ", "Allen & Heath Qu", "Allen & Heath CQ", "OSC"]
difficulty: Intermediate
source_url: https://github.com/h-allen-adams/sqOSC
labels: ["Experimental"]
summary: "sqOSC turns readable OSC into the NRPN MIDI an Allen & Heath SQ, Qu, or CQ expects, so a cue stack can recall scenes, mutes, and levels without hand-building MIDI."
---

## What it does

sqOSC is a macOS app that listens for OSC and sends the matching MIDI to one Allen & Heath mixer. The README covers the SQ series, Qu 5/6/7, and CQ. One mixer series is selected at a time. The author built it for an SQ-6 in a church, because QLab can send MIDI but the mixer's NRPN strings are awkward to edit in a rehearsal. OSC addresses are the script an assistant or a cue software can read.

The app is not from Allen & Heath. The SQ address list lives in `dictionary-sq.md`, which points at Allen & Heath's SQ MIDI Protocol Issue 5. On SQ, `/scene/5/recall` recalls scene 5, and scene numbers in that dictionary run from 1 to 300. Mutes take `ON` or `OFF`, as in `/input/1/mute` with argument `ON`. Levels in that dictionary run from -100 to 10, as in `/aux/1/level`. Soft keys are `/softKey/1/trigger` with `PRESS` or `RELEASE`, and the key has to be set up on the mixer first. Sends look like `/input/1/to/aux/1/sendLevel`. Qu and CQ have their own dictionaries, and the README says a method listed for one series may be missing on another.

The OSC server in `SqOscManager.swift` binds UDP port 9903. The Status tab is where you pick the MIDI device and channel, the mixer series, and the NRPN fader law so it matches the desk. The Builder tab shows the MIDI that an OSC line will become, and it can send that one message as a test. The README says a church show with dozens of mixer changes per scene has been fine, and that hundreds or thousands of cues per second have not been tried.

## How to set it up

1. Download a release from the repo (v2.4.1 is the current one) and open the macOS app, or build the Xcode project.
2. On the Status tab, select the MIDI device that already reaches the mixer, the MIDI channel, the mixer series, and the NRPN fader law configured on the desk. The app remembers those settings.
3. Open the Dictionary tab, or the matching `dictionary-sq.md`, `dictionary-qu.md`, or `dictionary-cq.md`, and use only addresses that series lists.
4. Send OSC to UDP port 9903 on the Mac running sqOSC. The source file that opens the socket does not show another port.
5. Test one message from the Builder tab before a cue list fires a stack of them. Watch the Status tab: it prints the OSC that arrived and the MIDI that went out.

Source project: [h-allen-adams/sqOSC](https://github.com/h-allen-adams/sqOSC). SQ MIDI message formats: [SQ MIDI Protocol Issue 5](https://www.allen-heath.com/content/uploads/2023/11/SQ-MIDI-Protocol-Issue5.pdf).

## FAQ

### Does the app talk to the SQ over Ethernet itself?
It publishes MIDI. You choose the MIDI device on the Status tab. That device might be the mixer's USB MIDI port, or a virtual port from Allen & Heath MIDI Control. The SQ protocol document says other network clients send MIDI to the mixer's IP on TCP port 51325. That port is the mixer's, not a setting in sqOSC.

### Are SQ, Qu, and CQ the same address list?
No. The README says to use the Dictionary tab for the series you selected. Scene, mute, level, and soft-key examples above are from the SQ dictionary.
