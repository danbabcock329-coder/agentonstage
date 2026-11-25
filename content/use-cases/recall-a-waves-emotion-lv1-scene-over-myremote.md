---
title: "Recall a Waves eMotion LV1 scene over MyRemote"
slug: recall-a-waves-emotion-lv1-scene-over-myremote
category: "Audio"
tools: ["Waves eMotion LV1", "Bitfocus Companion", "OSC"]
difficulty: Advanced
source_url: https://github.com/bitfocus/companion-module-waves-lv1
labels: ["Commercial product"]
summary: "Companion's LV1 module recalls a scene with /Set/CurSceneIndex. The index option is 0-based. Plain OSC fails; MyRemote frames each packet with an 8-byte header."
---

## What it does

Waves' support note of 9 November 2025 is the official MyRemote setup for eMotion LV1. In Setup, System Inventory, Controls, an empty control slot is set to MyRemote. The note says one MyRemote module is the path between the host and the MyMon, MyFOH, and mRecall apps at the same time. The Ethernet cable that feeds the Wi-Fi router carries control only. The note says no audio passes over it, and that this network stays off the SoundGrid network.

Bitfocus Companion's `companion-module-waves-lv1` speaks that MyRemote path. The README says module 2.x needs Companion 5.0 or newer, and that Companion 4.x should stay on module 1.2.1. MyRemote mode installs nothing on the LV1 computer. The README says it uses the same protocol as the MyFOH app: OSC over TCP, with a custom frame of a 4-byte big-endian size, an 8-byte header, and then the OSC bytes. It says a plain OSC client fails silently. The module's MyFOH handshake is one TCP write that batches `/handshake` with arguments `1`, `-1`, `1` and `/device_name`. A `/ping` and `/pong` keepalive runs at about 1 Hz. After the handshake the LV1 sends `/Channels` with the track names. The README says the control port changes every time eMotion LV1 launches and again on a mixer-mode change, so the module's port field is left at `0`, which means discover it. Discovery uses a custom `/zDNS` multicast. The README says the module is community-built from public traffic of the MyFOH and MyMon apps and from `MyMonService.dll`, and that it is not affiliated with Waves.

Scene recall in `src/actions.ts` sends `/Set/CurSceneIndex` with one integer. The action option is labeled "Scene index (0-based)". Recall by name, next, and previous in that file all end at the same address. Next and previous wrap, using the scene list the module has already received. Mute sends `/Set/Track/Out/Mute` with a group integer, a channel integer, and an OSC true or false. `resolveTrackAsync` subtracts 1 from the dropdown channel before that send, and the comment on `resolveIndexAsync` says the dropdown values are 1-based and the wire index is 0-based. Group `0` is the key that file uses for the input-channel dropdown. The fader field help on `/Set/Track/Out/Gain` says the dB range is -144 to +10, that -144 is mute, and that 0 is unity.

A second mode, Companion Surface, is a driver installed on the LV1 computer. The README says that driver listens on TCP port 9460, with an optional password set on both sides, and that MyRemote is not used in that mode. The driver installers are served by the module at the page it prints in the connection settings.

## How to set it up

1. On the LV1 host, add MyRemote to an empty control slot, as the Waves note describes. Keep that control network off SoundGrid. The note says the cable carries no audio.
2. In Companion 5, add the Waves LV1 connection and leave Connect through on MyRemote. Leave the port at 0 unless you have read a port from the log. The README says a hard-coded port goes stale on the next launch. Module 2.x is the Companion 5 build.
3. Wait for discovery, or type the host IP and leave the port at 0. The README says the module re-finds the port after a mixer-mode change. A plain OSC packet, without the 4-byte size and 8-byte header, is what the README says fails silently.
4. Recall scene index 0 with `/Set/CurSceneIndex` and the integer 0. The action text calls that index 0-based. Recall by name in the same file still sends `/Set/CurSceneIndex` after it resolves the name to an index.
5. Treat Companion Surface as a different socket. That mode is TCP 9460 on the driver, and the README says MyRemote does not have to be enabled for it. Do not mix the two handshakes on one connection.

Source: [companion-module-waves-lv1](https://github.com/bitfocus/companion-module-waves-lv1) and [Waves, Set up MyRemote with eMotion LV1](https://www.waves.com/support/set-up-myremote-with-emotion-lv1).

## FAQ

### Does the Waves note print the OSC addresses?
The 9 November 2025 note prints the control-slot steps and the separate-network rule. The addresses in this entry, including `/Set/CurSceneIndex` and `/Set/Track/Out/Mute`, are the ones in the Companion module source. The README says that source was built by reading MyFOH and MyMon traffic.

### Why does a normal OSC library get no reply?
The README says each MyRemote packet is a 4-byte big-endian size, an 8-byte header, and then the OSC payload, and that a plain OSC client fails silently. The handshake it uses is `/handshake` with `1`, `-1`, `1`, sent in the same TCP write as `/device_name`.

### Is scene 1 the first scene?
The scene-recall option is labeled 0-based, and the callback sends that integer to `/Set/CurSceneIndex`. The track dropdown is a different count: the source comment says those dropdown values are 1-based and that the wire channel is that number minus 1.
