---
title: "Recall Yamaha CL, QL and TF scenes over the remote protocol"
slug: recall-yamaha-cl-ql-and-tf-scenes-over-the-remote-protocol
category: "Audio"
tools: ["Yamaha CL", "Yamaha QL", "Yamaha TF"]
difficulty: Intermediate
source_url: https://download.yamaha.com/files/tcm:39-1286035
summary: "Yamaha's CL/QL/TF remote scripts open TCP port 49280 and send one newline-terminated command. ssrecall_ex MIXER:Lib/Scene 1 recalls scene 1 on CL/QL."
---

## What it does

Yamaha's QLab setup guide for the CL, QL, and TF series, and the script template it tells you to download, send text commands to the console. `command.py` opens a TCP socket. The script comment says the port must be 49280. Each command is the arguments joined by spaces, plus a newline. The script then reads up to 1500 bytes and closes. The guide says the same commands can be sent from Terminal. The examples are written for QLab script cues that call the Python files.

The guide's equipment line is a CL3 at version 3.11 or later, and a TF at version 2.00 or later. The programming section for scenes, channel on/off, pan, and faders is titled for CL/QL, with a separate section for TF. Use the console's mixer-control LAN port, not the Dante port. On CL/QL the address is set under NETWORK, FOR MIXER CONTROL. On TF it is NETWORK, Static IP. The guide's example puts the console at 192.168.0.128 and the computer at 192.168.0.100, both with mask 255.255.255.0.

`command_list.pdf` in that zip is the command list. `ssrecall_ex MIXER:Lib/Scene <n>` recalls a CL/QL scene. The list's range is 0 through 300, and it labels 0 as scene #000 and 300 as scene #300. `recall.py` sends that command with the number you pass. The guide says `recall.py 1` recalls scene 1 and `recall.py 8` recalls scene 8. TF uses two banks. `ssrecall_ex scene_a <n>` and `ssrecall_ex scene_b <n>` each take 0 through 99. The shipped `recalla0.py` sends `ssrecall_ex scene_a 0` and its comment says that recalls scene A0. `recallb1.py` sends `ssrecall_ex scene_b 1` for scene B1.

Input commands share one shape. `set MIXER:Current/InCh/Fader/Level <x> 0 <y>` sets a fader. `set MIXER:Current/InCh/Fader/On <x> 0 <y>` sets on/off. `set MIXER:Current/InCh/ToSt/Pan <x> 0 <y>` sets pan to the stereo bus. The list says index 0 is input channel 1. The highest index depends on the model: CL1 is 0–47, CL3 is 0–63, CL5 is 0–71, QL1 is 0–31, QL5 is 0–63, TF1 and TF-RACK are 0–31, and TF3 and TF5 are 0–39. The list's channel example at the top of that range is index 71 as input channel 72.

On/off is 0 for off and 1 for on. Pan runs from −63, labeled L63, to 63, labeled R63. The setup guide says −63 is hard left, 0 is center, and 63 is hard right. Fader `<y>` runs from −32768, labeled −∞, to 1000, labeled 10.00. The setup guide's chart maps +10 dB to 1000, 0 dB to 0, −10 dB to −1000, −20 dB to −2000, −30 dB to −3000, −50 dB to −5000, −99 dB to −10000, and −120 dB to −12000. The chart says −100 dB is not available. The guide says these commands cover scene recall, input on/off, stereo pan, and input fader level.

## How to set it up

1. Address the console on its mixer-control LAN port. The guide's example is 192.168.0.128, mask 255.255.255.0, with the computer at 192.168.0.100. On CL/QL that address is FOR MIXER CONTROL. On TF it is a static IP under NETWORK.
2. Download the script template the guide links, and set `host` in `command.py` and `recall.py` to that console address. The scripts connect with TCP to port 49280.
3. Recall a CL/QL scene with `ssrecall_ex MIXER:Lib/Scene 1` and a newline. The guide's `recall.py 1` sends that for scene 1. Scene numbers in the command list run from 0 to 300.
4. On TF, send `ssrecall_ex scene_a 0` for scene A0 or `ssrecall_ex scene_b 1` for scene B1. Each bank accepts 0 through 99.
5. Set input 1 with index 0. `set MIXER:Current/InCh/Fader/On 0 0 1` turns it on. `set MIXER:Current/InCh/Fader/Level 0 0 0` puts the fader at 0 dB. `set MIXER:Current/InCh/ToSt/Pan 0 0 -63` pans it hard left. Stay inside the index range for that model.

Source: [QLab setup guide for CL/QL/TF](https://download.yamaha.com/files/tcm:39-1286035) and the [Python script template](https://usa.yamaha.com/files/download/other_assets/0/1266290/Python_Script_Template_V100.zip) it links, including `command_list.pdf`.

## FAQ

### Is scene 1 sent as 0?
On CL/QL the guide's `recall.py 1` sends `ssrecall_ex MIXER:Lib/Scene 1`, and the command list labels 0 as scene #000. Input channels are the other way around: index 0 is input channel 1.

### Which console port is this?
The mixer-control LAN port. The guide says not to use the Dante port. CL/QL takes the address under NETWORK, FOR MIXER CONTROL. TF takes it as a static IP under NETWORK.
