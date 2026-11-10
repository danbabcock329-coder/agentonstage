---
title: "Recall Yamaha RIVAGE PM scenes over OSC"
slug: recall-yamaha-rivage-pm-scenes-over-osc
category: "Audio"
tools: ["Yamaha RIVAGE PM", "OSC"]
difficulty: Intermediate
source_url: https://download.yamaha.com/files/tcm:39-1407565
labels: ["Commercial product"]
summary: "Yamaha's RIVAGE PM OSC spec, for firmware V5.00 and later, recalls scene 5.00 on UDP port 49900. The input 1 fader example sends -32768 for -infinity."
---

## What it does

Yamaha's RIVAGE PM Series OSC Specifications, version 1.0.2, apply to firmware V5.00 and later. Version 1.0.2 is dated December 1, 2021, and the revision history says section 2 was revised for firmware V5.01 and V5.02. The console or DSP engine takes OSC on UDP port 49900. The address the controller uses is the DSP ENGINE IP SETTING address. The same address is the one used for MonitorMix and Immersive Sound. Up to 10 remote controllers can connect to one system.

The connection is the Network PC terminal, which the spec calls the computer connection terminal for external control, on either the console or the DSP engine. On the desk, open the NETWORK window from SETUP in the menu bar, set the IP address and subnet mask in DSP ENGINE IP SETTING, and turn on the ENABLE button.

Parameter commands use `/yosc:req/<Action>/<OSC address>/<X>/<Y>` plus a value. The spec's fader example sets input channel 1 to -infinity with `/yosc:req/set/MIXER:Current/InCh/Fader/Level/1/1 -32768`. That row is an int, minimum -32768, maximum 1000, scaling 100, unit dB, and the comment is -infinity to +10 dB. Input channel on/off is `MIXER:Current/InCh/Fader/On`, same X and Y indexes, int 0 for off and 1 for on. Pan to the stereo bus is `MIXER:Current/InCh/ToSt/Pan`, an int from -63 to 63. The comment labels -63 as L63, 0 as C, and +63 as R63. A channel name is `MIXER:Current/InCh/Label/Name`, and the comment says the maximum is 8 characters.

Scene recall uses a different shape, `/yosc:req/<Action> <OSC address> <value>`. The spec's example recalls scene 5.00 with `/yosc:req/ssrecallt_ex MIXER:Lib/Scene "5.00"`. The string range on that row is "1.00" through "999.99". The worked color example says the quotes around a string value are not required in QLab. The same page says QLab does not require OSC type tags, and that another controller may.

The channel-count table at the end of the spec lists InputChannelNum as 144 on DSP-R10 and CSD-R7, 120 on DSP-RX, and 288 on DSP-RX-EX. MixChannelNum is 72, 60, 48, and 72 on those four models, in the same order. StereoChannelNum is 4 on each: 1 is Stereo AL, 2 is Stereo AR, 3 is Stereo BL, and 4 is Stereo BR.

## How to set it up

1. On the RIVAGE PM system, open SETUP and the NETWORK window. Set the DSP ENGINE IP SETTING address and subnet mask, then turn on ENABLE. The spec says this is the same address MonitorMix and Immersive Sound use. Connect the controller to the Network PC terminal of the console or the DSP engine.
2. Send OSC to that IP on UDP port 49900. The spec's examples are written for QLab, which does not add type tags. Check whether your sender needs them.
3. Recall scene 5.00 with `/yosc:req/ssrecallt_ex MIXER:Lib/Scene "5.00"`. Stay inside the table's string range, "1.00" through "999.99". In QLab the spec says the quotes around a string value are not required.
4. Set input channel 1 with X and Y both 1, matching the fader example. `/yosc:req/set/MIXER:Current/InCh/Fader/On/1/1 0` turns that channel off. `/yosc:req/set/MIXER:Current/InCh/Fader/Level/1/1 -32768` is the spec's -infinity example. The row's maximum is 1000, which the comment ties to +10 dB. `/yosc:req/set/MIXER:Current/InCh/ToSt/Pan/1/1 -63` is the L63 end of the pan row.
5. Keep the channel index inside InputChannelNum for that DSP. A name write is limited to 8 characters by the name row's comment.

Source: [RIVAGE PM Series OSC Specifications, version 1.0.2](https://download.yamaha.com/files/tcm:39-1407565).

## FAQ

### Is input channel 1 index 0?
The fader example for input channel 1 is `/MIXER:Current/InCh/Fader/Level/1/1`. Both the channel index and the Y index in that command are 1. The X range on the row is 1 through InputChannelNum.

### Which port is the Dante port?
The spec says to use the DSP ENGINE IP SETTING address and UDP 49900, reached through the Network PC terminal on the console or the DSP engine. That address is the one shared with MonitorMix and Immersive Sound.

### Which systems does the channel table cover?
The spec's table lists DSP-R10, CSD-R7, DSP-RX, and DSP-RX-EX. Input counts in that table are 144, 144, 120, and 288. The document applies to firmware V5.00 and later.
