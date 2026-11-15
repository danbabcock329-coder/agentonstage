---
title: "Stream OptiTrack Motive and start a take over NatNet"
slug: stream-optitrack-motive-and-start-a-take-over-natnet
category: "Show Control"
tools: ["OptiTrack Motive", "NatNet"]
difficulty: Intermediate
source_url: https://docs.optitrack.com/motive/data-streaming
labels: ["Commercial product"]
summary: "Motive streams NatNet on UDP 1511 and takes commands on UDP 1510. The default multicast address is 239.255.42.99. StartRecording starts a take."
---

## What it does

OptiTrack's data-streaming page describes NatNet as a UDP client/server stream from Motive. It carries reconstructed 3D data, rigid bodies, trained markersets, and skeletons, over unicast or multicast. The advanced streaming settings default to command port 1510, data port 1511, and multicast address 239.255.42.99. The XML broadcast port defaults to 1512. That port is not edited on its own. It stays two ports above the command port, so command port 1512 makes the XML port 1514.

Rigid Bodies, when enabled, streams each asset's name plus the position and orientation of its pivot. A firewall or antivirus can block the traffic. The page says to allow both Motive and the client, or disable the filter while you test.

Clients on NatNet 2.0 or older need a different pair. The page says to set the multicast interface to 224.0.0.1 and the data port to 1001. Multicast as Broadcast is marked for testing only. It sends to 255.255.255.255 and can flood the network. The page says to use a dedicated network if you turn that on.

NatNet commands go to UDP 1510 by default. The remote-commands page lists the strings Motive accepts. `StartRecording` starts a take. `StopRecording` stops it. `SetRecordTakeName,` plus the take name sets the name that will be recorded. `LiveMode` and `EditMode` switch modes. `CurrentMode` returns 0 for Live and 1 for Edit. `FrameRate` returns the tracking rate as a float. `UnitsToMillimeters` returns the current units. `SetPlaybackTakeName,` plus a name selects a take. `TimelinePlay` and `TimelineStop` play and stop the loaded take.

`SendMessageAndWait` sends one of those strings. The overload with a try count and a timeout defaults to 10 tries and 20 ms. Parameters are comma-separated. The WinForms sample sends `StartRecording`, then reads a 32-bit integer from the response. 0 means the command was handled and succeeded.

Unicast clients on Motive 3.0 or newer can subscribe so the data packets stay small. The form is `SubscribeToData,[DataType],[All or a specific asset]` or `SubscribeByID,[DataType],[ID]`. The page says subscription is unicast only.

XML start and stop is the other trigger. Remote Trigger has to be enabled, and the packet goes to the XML broadcast port. The streaming page recommends NatNet commands instead, because they are more robust and can do more. A `CaptureStart` document can include `Name`, `SessionName`, `Notes`, `Assets`, `DatabasePath`, and `TimeCode`. `CaptureStop` uses `Name`, `Notes`, `Assets`, and `TimeCode`.

## How to set it up

1. In Motive's streaming settings, turn on the assets you need. Leave command port 1510 and data port 1511 unless the client is NatNet 2.0 or older. For those clients, set multicast to 224.0.0.1 and the data port to 1001.
2. Use multicast address 239.255.42.99 for a current client. Allow Motive and the client through the firewall. Do not enable Multicast as Broadcast on a network that also carries show traffic.
3. Send `SetRecordTakeName,` and the take name, then `StartRecording`, to UDP 1510. Read the integer result. Send `StopRecording` to end the take. Send `FrameRate` if you need the camera rate before you trust the stream.
4. On a unicast client and Motive 3.0 or newer, send `SubscribeToData` or `SubscribeByID` so you only receive the types you asked for. The commands page says this does not apply to multicast.
5. Prefer those command strings over XML. If you do use XML, enable Remote Trigger and send `CaptureStart` or `CaptureStop` to the XML port, 1512 when the command port is still 1510.

Source: [Motive data streaming](https://docs.optitrack.com/motive/data-streaming) and [NatNet remote commands](https://docs.optitrack.com/developer-tools/natnet-sdk/natnet-remote-requests-commands).

## FAQ

### Which port is the take command?
The remote-commands page says NatNet commands use UDP 1510 by default. Tracking data uses 1511. XML triggers use 1512 and follow the command port if you change it.

### Can a multicast client subscribe to one rigid body?
The commands page says subscription commands are for unicast, and for Motive 3.0 or above. Multicast sends the broadcast set.

### What does a 0 coming back from StartRecording mean?
In the WinForms sample on that page, an integer 0 in the response means the server handled the command and it succeeded. A non-zero integer means it was handled and failed. A non-zero return from `SendMessageAndWait` means the server did not handle it.
