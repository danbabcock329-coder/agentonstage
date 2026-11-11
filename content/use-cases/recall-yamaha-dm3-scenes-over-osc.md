---
title: "Recall Yamaha DM3 scenes over OSC"
slug: recall-yamaha-dm3-scenes-over-osc
category: "Audio"
tools: ["Yamaha DM3", "OSC", "UDP"]
difficulty: Intermediate
source_url: https://usa.yamaha.com/files/download/other_assets/2/2063222/DM3_osc_specs_v100_en.pdf
labels: ["Commercial product"]
summary: "DM3 OSC spec 1.0.0 sends UDP to port 49900. Fader value 0 is 0.00 dB and -32768 is -infinity. ssrecall_ex scene_a 5 recalls scene A05."
---

## What it does

Yamaha's DM3 Series OSC Specifications, version 1.0.0, dated May 9, 2023, is the remote-control parameter list for the DM3 series. The controller sends OSC to the console's For Mixer Control address on UDP port 49900. The spec says that address is the same one StageMix and MonitorMix use. On the desk, open the NETWORK window from SETUP in the toolbar and select For Mixer Control. The connection is the Network port on the rear panel. Up to four OSC remote controllers can be connected to one console. The static-address steps are to select Static IP, then enter the address and the subnet mask.

Parameter writes use `/yosc:req/set/` plus the address, an X index, a Y index, and a value. The spec's fader example sets input channel 1 to −∞ with `/yosc:req/set/MIXER:Current/InCh/Fader/Level/1/1 -32768`. That row is an integer from -32768 to 1000, scaling 100, unit dB. Table 1 lists value -32768 as `"-∞"`, value 0 as `"0.00"`, value 100 as `"1.00"`, and value 1000 as `"10.00"`. The same channel's on/off row is `MIXER:Current/InCh/Fader/On`, integer 0 for off and 1 for on, again with X and Y. Pan to the stereo bus is `MIXER:Current/InCh/ToSt/Pan`, an integer from -63 to 63. Table 2 lists -63 as `"L63"`, 0 as `"C"`, and 63 as `"R63"`. A channel name is `MIXER:Current/InCh/Label/Name`, and the row says the maximum length is 8 characters.

The spec's QLab note says QLab does not require type tags, and that another OSC controller may. The color example on the same page says the quotes around a string value are not required in QLab.

Scene recall is a different command. The printed example, labeled Recall SCENE A05, is `/yosc:req/ssrecall_ex "scene_a" 5`. The Scene A and Scene B rows both use `ssrecall_ex`, with addresses `scene_a` and `scene_b`, a string and an integer, and an integer range of 0 to 99. The parameter list also names `sscurrent_ex` with `scene_a` or `scene_b` as Get Current Scene number. That row's type tag is a string. The spec prints the recall command and does not print a separate example line for the get.

The DM3/DM3S max-channel table at the end of the spec lists 16 input channels, 2 stereo input channels, 4 FX return channels, 6 mix channels, 2 stereo channels, 2 matrix channels, 2 FX channels, and 16 local inputs. Stay inside that table for a DM3 or DM3S.

Local head-amp controls are writable in the same document. `IO:Current/InCh/HAGain` is an integer from 0 to 64. Table 7 lists 0 as `"0"` and 64 as `"+64"`. `IO:Current/InCh/48VOn` is 0 for off and 1 for on. A client that is only moving faders or recalling scenes should not write those two addresses.

## How to set it up

1. On the DM3, open SETUP, then the NETWORK window, and select For Mixer Control. Set a static address and subnet if the controller cannot follow a changing address. The spec says this is the same address StageMix and MonitorMix use. Point the controller at the Network port on the rear panel.
2. Send UDP to that address on port 49900. The spec allows up to four OSC controllers on one console. The printed examples omit type tags because they are written for QLab. Add the tags if the sender you are using requires them.
3. Recall scene A05 with `/yosc:req/ssrecall_ex "scene_a" 5`. The integer on that row runs from 0 to 99. Scene B uses the same command with `"scene_b"`. In QLab the spec says the quotes around a string value are not required.
4. Set input channel 1 with X and Y both 1, matching the fader example. `/yosc:req/set/MIXER:Current/InCh/Fader/Level/1/1 0` is Table 1's `0.00` dB. `/yosc:req/set/MIXER:Current/InCh/Fader/Level/1/1 -32768` is the spec's −∞ example. `/yosc:req/set/MIXER:Current/InCh/Fader/On/1/1 0` turns that channel off.
5. Do not write `IO:Current/InCh/48VOn` or `IO:Current/InCh/HAGain` from a fader or scene client. Phantom 1 turns 48 V on for that local input. Head-amp gain runs from 0 to 64 in Table 7.

Source: [DM3 Series OSC Specifications, version 1.0.0 (May 9, 2023)](https://usa.yamaha.com/files/download/other_assets/2/2063222/DM3_osc_specs_v100_en.pdf).

## FAQ

### Which integer is 0 dB?
Table 1 lists parameter value 0 as `"0.00"` and value 1000 as `"10.00"`. The fader row's minimum, -32768, is the table's `"-∞"`. The spec's worked command sends that minimum to input channel 1.

### How is scene A05 addressed?
The spec's recall example is `/yosc:req/ssrecall_ex "scene_a" 5`, under the heading Recall SCENE A05. Scene B is the same command with `"scene_b"`. Both integer ranges are 0 to 99. `sscurrent_ex` is the parameter-list name for reading the current scene number.

### Does this use the RIVAGE PM scene string?
The DM3 spec's scene command is `ssrecall_ex` with `"scene_a"` or `"scene_b"` and an integer. The DM3/DM3S channel table lists 16 input channels. Send to the For Mixer Control address on UDP 49900.
