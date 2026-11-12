---
title: "Preview a Martin P3 rig over the visualizer protocol"
slug: preview-a-martin-p3-rig-over-the-visualizer-protocol
category: "LED/Video"
tools: ["Martin P3", "UDP"]
difficulty: Advanced
source_url: https://adn.harmanpro.com/site_elements/resources/26012_1759989464/Martin%20Professional%20P3%20Visualizer%20Protocol%20Specification%202025-09-30_original.pdf
labels: ["Commercial product"]
summary: "P3 Visualizer Protocol 1.00 sends UDP 20531 from a P3-175, P3-275, or P3-PC on software 6.2.0 or later. Type 0x03 is the sync. 59.94 Hz is 0x003BF0A4."
---

## What it does

Martin's P3 Visualizer Protocol Specification, protocol version 1.00, document revision 2 dated 30 September 2025, is a one-way UDP feed from a P3 System Controller, or from P3-PC software, to visualization software. The listener gets every fixture mapped on the controller: fixture information, pixel data, a gamma curve, and a sync pulse. The hardware list is the P3-175, the P3-275, and the P3-PC, on P3 System Controller software 6.2.0 or higher. The computer connects on the controller's MGMT port. Fixtures may also be attached to the P3 output ports, and the spec says visualization works with no fixtures connected.

Packets go to the directed broadcast of the subnet the controller is on, so more than one listener can receive them. Several controllers may share the network. The listener tells them apart by source IP. Both the UDP source port and the destination port are 20531 (`0x5033`). Bytes are big-endian. There is no length field and no checksum inside the P3 packet. Use the UDP length, and discard a packet whose UDP checksum does not match. A packet stays inside one Ethernet frame, 1472 bytes. A larger fixture's pixels are split across packets.

The first five bytes are the identifier `P3VP` and a zero byte. The next byte is the version, major in the high nibble and minor in the low nibble, currently 1 and 0. The packet type is next: `0x01` fixture info, `0x02` pixel data, `0x03` sync, `0x04` gamma. Fixture info repeats on a 5000 ms cycle. The spec's burst example is 1700 fixtures, sent as packets of up to 17 fixtures, one packet every 50 ms. A change of DMX mode, address, or selection is sent immediately. A fixture info packet holds at most 17 fixtures, and fewer when a fixture has several layers of color coordinates. Fixture number 0 is invalid and marks the end of the repeating block. DMX mode `0x00` means the fixture is not patched to DMX, and the protocol, universe, and address fields are ignored. Protocol `0x01` is Art-Net and `0x02` is sACN. An Art-Net universe is 0 to 32767. An sACN universe is 1 to 63999. The start address is 1 to 512, or 0 when the fixture is not patched. The manufacturer ID for Martin Professional is `0x4D50`. The 16-byte UUID matches the MVR UUID when a show moves between P3 and MVR.

Pixel data can follow the incoming video rate, 24 to 75 Hz, or a lower rate set on the controller. The controller sends every pixel packet for the frame, waits a dead time, then sends the sync packet with the same frame ID. That sync is the point at which the listener displays the frame. The frame rate in the sync packet is the rate times 65536, rounded to the nearest integer. The spec's example is 59.94 Hz encoded as `0x003BF0A4`. Gamma packets also repeat every 5000 ms, and immediately when the brightness fader or the gamma selection changes. Apply the curve after the intensity factor. If no gamma packet has arrived, the receiver may assume the linear curve the spec prints, from `0x0000` through `0xFFFF`.

## How to set it up

1. Connect the visualizer computer to the P3 MGMT port, on the same IPv4 subnet. Listen for UDP whose source and destination ports are both 20531. Accept the subnet's directed broadcast. Use the source IP when more than one controller is transmitting.
2. Check the first five bytes for `P3VP` and `0x00`, then the version nibble `0x10` for version 1.0. Read the type byte. Drop a packet whose UDP checksum fails. Stop a repeating fixture or pixel block at fixture number 0, or at the end of the UDP payload.
3. Build the rig from type `0x01`. A fixture number is 1 to 65535. Mode `0x00` means there is no DMX patch to read. Otherwise protocol `0x01` is Art-Net and `0x02` is sACN, with the universe and start-address ranges above. Match the UUID to an MVR fixture when the show was exchanged that way. Martin fixtures use manufacturer ID `0x4D50`.
4. Collect type `0x02` pixel packets for one frame ID. Display them when the type `0x03` sync packet arrives with that frame ID, after the dead time the controller inserts. Read the frame rate as the 32-bit value divided by 65536. The spec's 59.94 Hz example is `0x003BF0A4`.
5. Apply a type `0x04` gamma curve after the intensity factor. Use the linear curve from the spec until the first gamma packet arrives. Keep a separate Art-Net or sACN input from the console if the visualizer also has to merge DMX. This protocol delivers the P3 pixels. The spec leaves the merge to the visualizer.

Source: [Martin P3 Visualizer Protocol Specification 1.00, revision 2 (30 September 2025)](https://adn.harmanpro.com/site_elements/resources/26012_1759989464/Martin%20Professional%20P3%20Visualizer%20Protocol%20Specification%202025-09-30_original.pdf).

## FAQ

### Which controllers send this?
The spec lists the P3-175, the P3-275, and the P3-PC, on P3 System Controller software 6.2.0 or higher. Protocol version 1.00 is document revision 2, dated 30 September 2025. Both UDP ports are 20531.

### When is a frame ready to draw?
The controller sends the pixel packets, leaves a dead time, then sends packet type `0x03` with the matching frame ID. That sync packet is the display trigger. Pixel data can run at the video rate, from 24 to 75 Hz, or slower if the controller is set that way.

### What gamma is used before the first curve arrives?
The spec says the receiver may assume a linear curve, the sequence it prints from `0x0000` to `0xFFFF`. A later gamma packet replaces it, and the curve is applied after the intensity factor.
