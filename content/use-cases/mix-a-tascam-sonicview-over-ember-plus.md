---
title: "Mix a Tascam Sonicview over Ember+"
slug: mix-a-tascam-sonicview-over-ember-plus
category: "Audio"
tools: ["Tascam Sonicview", "Ember+"]
difficulty: Advanced
source_url: https://tascam.jp/wp-content/uploads/downloads/products/tascam/sonicview/sonicview_24/sonicview_ember_tree_structure_specification_rev1.1.0.xlsx
labels: ["Commercial product"]
summary: "Sonicview Ember+ Rev 1.1.0 writes a channel fader of 816 for 0 dB. Setting a snapshot recall bool to true recalls it. Meters arrive on UDP port 41624."
---

## What it does

TASCAM's Sonicview 16/24 remote control specification for Ember+, Rev 1.1.0, is the parameter tree for the console. The cover's changelog lists Rev 1.0.0 on 2025/6/11 as the first edition for firmware v2.2.0, and Rev 1.1.0 on 2026/01/06 as the edition that adds DP parameters for v2.3.1. The related-document line points at Lawo's [ember-plus](https://github.com/Lawo/ember-plus) repository. The tree sheet itself does not name a TCP port. The Sonicview 24 FAQ says to use the Ethernet port on the main unit for Ember+. The V2.3 reference manual says a connection with 12 Ember+ devices has been confirmed, and that the number that will connect can vary with the network.

`sonicview/identity/version` is a read-only string. The spec's example is `1.07.00 build 20240627`. `sonicview/identity/product` is described as a fixed value, `Sonicview 24`, even though the document title covers the 16 and the 24. Read that node on the desk you are talking to. `sonicview/information/clock_status` is `Good`, `Unlocked`, or `Regained`. `sonicview/information/sampling_rate` is `48000` or `96000`.

A channel fader is `sonicview/channels/channel_1~40/fader`, an Int64 from 0 to 1023. The row says −∞ dB is 0 and 0 dB is 816, and it points at the fader conversion sheet. That sheet lists entry 0 as `-Inf` and entry 816 as `0.00`. Mute on the same channel is a bool: true is muted and false is unmuted. Pan is `pan_bal`, an Int64 from 0 to 200, with 0 as L100, 100 as center, and 200 as R100. The link-operation sheet says that on a stereo-linked channel or mix, writes go to the left side except for `input_*`, `d.trim`, and `phase`. It says commands on the right side are ignored.

Snapshots live under `sonicview/snapshots/snapshot_1~128,P001`. `name` is read-only. `recall` is a bool, and the description says setting it to true runs the recall and that it returns to false when the recall finishes. Analog phantom is `sonicview/sources/analog_1~16/24/phantom`, a writable bool, true for on. Pad is the bool next to it, and `analog_gain` is an Int64 from 12 to 66 in 1 dB steps. A mix client that is only moving faders should leave those three alone.

Meters are a different document. The reference manual says meter data cannot be acquired with Ember+. The meter-data specification, Ver. 1.00, dated June 11, 2025, sends UDP to port 41624, and says that port can be changed through Ember+. In the tree, `sonicview/meter_application/setting/sv_meter_udp_port` is an Int64 from 4096 to 49150. Writing an `A.B.C.D` address to `sv_meter_ip_connect` starts the stream to that address. The spec's example address is `192.168.100.100`. Writing the address to `sv_meter_ip_disconnect` stops it. The stream also stops about 10 minutes after the connect write unless the address is written again. `sv_meter_interval` is `OFF` or a step from `50ms` through `500ms`. A packet begins with the 8-character string `SV_METER`, packet version `0x0000`, and the type string `DATA`. Meter values run from 0 to `0x7fff`. The conversion function in the spec returns −100.0 when the value is 0, and otherwise `20 * log10(value / 0x7fff)`. Channel 1's channel ID and meter index are both `0x0000`. The post-fader tag for channels 1–40 is `0x0006`.

## How to set it up

1. Connect the Ember+ client to the main-unit Ethernet port named in the Sonicview 24 FAQ. Read `sonicview/identity/version` and `sonicview/identity/product` before any write. The reference manual's confirmed client count is 12, and it says the network can change how many actually connect.
2. Read `sonicview/channels/channel_1/fader`. Write `816` for the conversion table's `0.00` dB, or `0` for the table's `-Inf`. Set `sonicview/channels/channel_1/mute` to true to mute that channel and false to unmute it. On a stereo-linked pair, write the left channel. The link sheet says the right-side command is ignored.
3. Read `sonicview/snapshots/snapshot_1/name` before you recall. Set `recall` on that snapshot to true. The tree says the bool returns to false when the recall completes. `snapshot_recall_confirmation` under `sonicview/preferences` is its own bool.
4. For meters, write the listener address to `sonicview/meter_application/setting/sv_meter_ip_connect` in `A.B.C.D` form and open UDP 41624, unless `sv_meter_udp_port` has been moved inside 4096–49150. Check the header for `SV_METER` and type `DATA`. Write the same address again before the timeout of about 10 minutes. Stop with `sv_meter_ip_disconnect`.
5. Do not write `phantom`, `pad`, or `analog_gain` from a fader client. Phantom true turns phantom on for that analog input. The gain row is 12 to 66 in 1 dB steps.

Source: [Sonicview 16/24 Ember+ tree, Rev 1.1.0](https://tascam.jp/wp-content/uploads/downloads/products/tascam/sonicview/sonicview_24/sonicview_ember_tree_structure_specification_rev1.1.0.xlsx), [meter data protocol Ver. 1.00](https://cf.tascam.com/wp-content/uploads/downloads/products/tascam/sonicview/sonicview_24/sonicview_meter-protocol_e_va.pdf), and the [V2.3 reference manual](https://manual.tascam.jp/sonicview/rm/en/sonicview16_24_16dp_24dp_rm_e_va.pdf).

## FAQ

### Where are the meters in the Ember+ tree?
The V2.3 reference manual says meter data cannot be acquired with Ember+. Levels arrive as UDP. The meter specification names destination port 41624 and says Ember+ can change it. The tree parameter for that port is `sv_meter_udp_port`, from 4096 to 49150.

### Which integer is 0 dB?
The fader row says −∞ dB is 0 and 0 dB is 816, on a range of 0 to 1023. The conversion sheet lists entry 0 as `-Inf` and entry 816 as `0.00`. Mute is a separate bool on the same channel.

### Does the tree name the Ember+ TCP port?
Rev 1.1.0's tree sheet does not name one. The cover lists Lawo's ember-plus repository as the protocol document, and the Sonicview 24 FAQ says to use the Ethernet port on the main unit.
