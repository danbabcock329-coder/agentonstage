---
title: "Place Meyer Sound Spacemap Go channels over OSC"
slug: place-meyer-sound-spacemap-go-channels-over-osc
category: "Audio"
tools: ["Meyer Sound Spacemap Go", "OSC"]
difficulty: Intermediate
source_url: https://docs.meyersound.com/products/en/user-guide---spacemap-go.html
summary: "Spacemap Go accepts general-purpose OSC on UDP 38033 to move a channel panner, set level and spread, run a trajectory, and recall a snapshot by its External Recall ID."
---

## What it does

Meyer Sound's Spacemap Go user guide documents a general-purpose OSC map for a Spacemap system. The system runs on a Galileo GALAXY processor in Spacemap Mode. In the QLab section, the system receives OSC on UDP port 38033. QLab's receive port, when a Spacemap event should trigger QLab, is 53000. Passing audio needs the hardware in Spacemap Mode. That section says a Virtual GALAXY inside Compass is enough for the control connection, using the firmware bundled with Compass 4.9 or later and matched to the app version in use.

The app uses IPv6 between the iPad and the processors until a system IPv4 address is entered. The guide's FAQ puts that field under Settings, External Device Connection. For a hardware system, the QLab steps open Settings, then System Settings, External Device Control, and fill in SYSTEM IP CONFIGURATION with an IPv4 address and a subnet mask. A contiguous range of addresses is then assigned to the processors, separate from the addresses Compass shows. General Purpose OSC is a switch in that same area. Its default client address is `(any)` and its default port is 0. The guide says to set that port to 53000 only when Spacemap should send to QLab. A Virtual GALAXY on the same computer is addressed at `localhost` or `127.0.0.1`, port 38033, and the guide says the system IPv4 is not required in that case. A Virtual GALAXY on another computer is addressed at that Compass computer's IPv4, still on port 38033.

The command table covers channels 1 to 32. `/channel/{n}/position` takes two integers, X then Y, each from -1000 to 1000. The example `/channel/1/position` with 125 and 300 puts the panner at X 125, Y 300. `/channel/{n}/level` is dB from -90 to +10. `/channel/{n}/mute` is 0 for off and 1 for on. `/channel/{n}/crossfade` runs from -100, fully the left map, to 100, fully the right map. `/channel/{n}/spread` is 0 to 100 percent. The table says spread is logarithmic and that 14 percent is optimal for most cases. `/channel/{n}/trajectory/status` takes `play`, `pause`, or `stop`, and `stop` restarts the trajectory at its start point. `/mix/level` and `/system/level` use the same -90 to +10 dB range. `/mix/mute` uses 0 and 1.

Snapshots are recalled by the External Recall ID. In Setlist view, the three-dot control on a snapshot shows that ID. The command table's examples are `/recall/channel` with 3003, `/recall/mix` with 2002, and `/recall/system` with 1001. A console-automation section of the same guide says the IDs are assigned automatically between 900 and 3000. Read the ID from the snapshot. A console-plugin note says to recall a mix snapshot before a channel snapshot, and that a system snapshot can be recalled at any time.

The console connection is a separate switch. For that path the guide says the server accepts messages only from the IPv4 address you entered, and replies only to that address. The suggested port on the console's receive side of that pairing is 4001. The console still sends to 38033.

QLab can address a range of channels with its own regular expressions. The guide's examples are `/channel/[1-9]/position` for channels 1 to 9, `/channel/1[0-9]/position` for 10 to 19, and `/channel/2[0-9]/position` for 20 to 29. That syntax is for cues built in QLab.

## How to set it up

1. Boot the GALAXY into Spacemap Mode, or start a Virtual GALAXY in Compass. Open the Spacemap Go project and the setlist you intend to fire.
2. On hardware, set a system IPv4 address and subnet under External Device Control, then enable General Purpose OSC. Leave the client address at `(any)` unless you are binding one controller. Send UDP to that system address on port 38033.
3. For a Virtual GALAXY on the same machine, send to `127.0.0.1` port 38033. On another machine, send to the Compass computer's IPv4 on port 38033.
4. Move one channel with `/channel/{n}/position` and two integers from -1000 to 1000. Set level in dB, mute with 0 or 1, and trajectory status with `play`, `pause`, or `stop`.
5. Read the External Recall ID from the snapshot's three-dot details before you send `/recall/mix`, `/recall/channel`, or `/recall/system`. The guide's plugin note says a mix snapshot should be recalled before a channel snapshot.

Source: [Spacemap Go user guide](https://docs.meyersound.com/products/en/user-guide---spacemap-go.html).

## FAQ

### Which senders can use general-purpose OSC?
The QLab steps leave General Purpose OSC at the default address `(any)` and send to port 38033. The one-address rule in the guide belongs to the console external-device connection, which accepts messages from the entered IPv4 and replies only to that address.

### Which number goes in `/recall/mix`?
The External Recall ID from that snapshot's three-dot details in Setlist view. The command table's mix example is 2002. The automation section says assigned IDs fall between 900 and 3000.
