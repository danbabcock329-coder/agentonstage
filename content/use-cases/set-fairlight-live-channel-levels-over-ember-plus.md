---
title: "Set Fairlight Live channel levels over Ember+"
slug: set-fairlight-live-channel-levels-over-ember-plus
category: "Audio"
tools: ["Blackmagic Fairlight Live", "Ember+"]
difficulty: Intermediate
source_url: https://documents.blackmagicdesign.com/UserManuals/FairlightLiveManual.pdf
labels: ["Commercial product"]
summary: "The October 2026 Fairlight Live manual advertises Ember+ as _ember._tcp. channel/channel1/level is the fader in dB, from -100.0 to 10.0."
---

## What it does

The Fairlight Live user manual dated October 2026 describes Ember+ (Glow/S101) as a show and automation protocol. It says third-party controllers, automation systems, and custom applications can query and control the mixer in real time. In Show Settings, Enable turns Ember+ control on. Once it is enabled, the manual says server configuration port information is displayed. The Server Name field defaults to "Fairlight Live."

The appendix says the server port is configured in Show Settings and advertised with Bonjour as `_ember._tcp`, so a compatible client can discover it. Clients can get, set, and subscribe to any parameter in the tree. Subscribing to a node includes every parameter beneath it. The tree follows the current mixer. When buses or send destinations are added or removed, the tree updates. Indices are one-based. Booleans use false for off or unmuted and true for on or muted. Meter parameters are read-only.

System paths are `system/onair` for the Off Air / On Air state, and `system/reset-loudness` to reset and restart the loudness meters. Channels are `channel/channelN`. `channel/channelN/level` is a real from -100.0 to 10.0, the fader in dB. Mute is a boolean. Pan is a real from -100.0 to 100.0. Name is a string. `channel/channelN/meter` is read-only, a real from -60.0 to 0.0, the maximum meter level in dB.

Buses are exposed as `main/mainN`, `sub/subN`, `aux/auxN`, `mixm/mixmN`, and `mtx/mtxN`. The bus table lists level in the same -100.0 to 10.0 dB range, mute, name, and pan. Pan is not exposed on main buses. Meter paths that the appendix prints in full are `sub/subN/meter`, `aux/auxN/meter`, `mixm/mixmN/meter`, and `mtx/mtxN/meter`, each a read-only real from -60.0 to 0.0. Main meters are `main/mainN/meters/meter` in that same range, and `main/mainN/meters/integrated` from -100.0 to 18.0.

Sends sit under `sends/aux`, `sends/mixm`, and `sends/mtx`. The appendix example is `channel/channel1/sends/aux/aux2/level`. Send level is a real from -100.0 to 10.0 dB. Send mute is a boolean. Send pan is a real from -100.0 to 100.0. Only sends that are currently assigned on that source expose destination parameters.

Four monitor circuits are `monitor/monitor1` through `monitor/monitor4`, each with level, mute, and dim. The appendix says subscribed meters update at up to 50 ms intervals, with a refresh at least once per second. AFV paths include `afv/on`, `afv/program` and `afv/preview` as integers from 1 to the camera count, fade-in and fade-out times as integers from 0 to 2000 milliseconds, fade levels from -100.0 to 0.0 dB, `afv/hold-time` from 0 to 1000 milliseconds, and `afv/camera-count` from 1 to 128. Four talkback circuits are `talkback/circuit1` through `talkback/circuit4`. Circuit 1 is the main console operator. `cueplayer/play/a` and `cueplayer/play/b` take an integer from 1 to 8. `cueplayer/dump` takes no argument and dumps all cues.

## How to set it up

1. In Fairlight Live, open Show Settings and enable Ember+. Read the server port shown there after enable. The manual says that port is advertised on the network as `_ember._tcp`. The Server Name field defaults to "Fairlight Live."
2. Connect an Ember+ client to that discovered host and port. Get `channel/channel1/level` and `channel/channel1/mute` before you set either one. Indices start at 1.
3. Set `channel/channel1/level` to a real from -100.0 to 10.0. Set mute with a boolean. The appendix says false is off or unmuted and true is on or muted.
4. For a monitor send, use a path the mixer currently assigns. The printed example is `channel/channel1/sends/aux/aux2/level`, in dB from -100.0 to 10.0. If the send is not assigned, the appendix says the destination parameters are not exposed.
5. Subscribe to a node when you want every parameter under it, including meters. Meter parameters are read-only. The appendix says subscribed meters update at up to 50 ms, and at least once per second.

Source: [Fairlight Live User Manual, October 2026](https://documents.blackmagicdesign.com/UserManuals/FairlightLiveManual.pdf).

## FAQ

### Is the channel tree OSC?
The Show Settings section describes OSC separately, and the appendix opens with a paragraph of OSC capabilities. The parameter tree, the one-based index rule, and the paths on this page are under the Ember+ heading. The manual does not print OSC addresses in that appendix.

### What does a mute boolean mean?
The appendix says false is off or unmuted, and true is on or muted. The same rule is stated for booleans throughout the tree.

### Which monitor circuits exist?
The appendix exposes four, `monitor/monitor1` through `monitor/monitor4`. Each has level, mute, and dim. Level uses the same -100.0 to 10.0 dB range as a channel fader.
