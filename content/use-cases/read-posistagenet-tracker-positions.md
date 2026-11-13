---
title: "Read PosiStageNet tracker positions"
slug: read-posistagenet-tracker-positions
category: "Lighting"
tools: ["PosiStageNet", "UDP"]
difficulty: Intermediate
source_url: https://github.com/vyv/psn-cpp/blob/master/doc/PosiStageNetprotocol_v2.03_2019_09_09.pdf
summary: "PosiStageNet 2.03 multicasts on UDP 236.10.10.10 port 56565. A data packet's position chunk is three little-endian floats, in meters."
---

## What it does

PosiStageNet is the tracking protocol VYV and MA Lighting published so a positioning system can share named points with lighting and other show systems. Spec v2.03, dated 9 September 2019, says third parties may use it without a royalty. The project page links that PDF as the current specification.

Transport is UDP multicast. The default address is 236.10.10.10 and the default port is 56565. The spec says both can be changed on the tracking server. One UDP packet is at most 1500 bytes, so one frame can be split. Encoding is little endian.

Two packet families matter. `PSN_INFO`, root chunk id `0x6756`, is the slow description. The default rate in the spec is 1 Hz. It carries the system name and, under the tracker list, each tracker's id and name. `PSN_DATA`, root chunk id `0x6755`, is the motion. The default rate is 60 Hz. The spec says the server can send as fast as the hardware, and that 250 Hz was the top it named at the time of writing.

Every chunk starts with a 32-bit header. The spec names three fields: an id, a data length, and a flag for whether child chunks follow. The reference decoder in `psn_defs.hpp` packs that header as 16 bits of id, 15 bits of data length, and 1 bit of `has_subchunks`, and `psn_decoder_impl.hpp` casts the packet bytes onto that struct. Unknown chunk ids are skipped. The spec says new fields are appended and default to 0, so a reader that stops at the length it understands still accepts a longer chunk.

Inside a data packet, the header chunk (`0x0000`) holds a timestamp in microseconds since the server started, `version_high`, `version_low`, `frame_id`, and `frame_packet_count`. The spec says systems that share the same high version number can read the binary packet. Reassemble a frame by collecting `frame_packet_count` packets with the same `frame_id`.

Each tracker is a chunk whose id is the tracker id. The position child, id `0x0000`, is three 32-bit floats, `pos_x`, `pos_y`, `pos_z`, in meters. Positive X is right, positive Y is up, and positive Z is depth. Speed (`0x0001`) is meters per second. Orientation (`0x0002`) is a vector whose length is radians, and the spec says it is absolute, not accumulated from the previous packet. Status (`0x0003`) is one float, `validity`. Acceleration, target position, and a per-tracker timestamp are further optional children. If the tracker timestamp is absent, the spec says to use the packet timestamp.

## How to set it up

1. On the tracking server, confirm the multicast address and port. The spec's defaults are 236.10.10.10 and UDP 56565. Join that group from the show machine.
2. Separate packets by the root chunk id. `0x6756` is info. `0x6755` is data. Read the header with the 16/15/1 layout from `psn_defs.hpp`, little endian, and skip any chunk id you do not handle.
3. From info packets, store tracker id to tracker name. The tracker chunk id is the tracker id. Names arrive as a character array whose length is the chunk data length.
4. From data packets, read `version_high` before you trust the rest. Collect every packet that shares a `frame_id` until you have `frame_packet_count` of them. Then read each tracker's position child as three floats in meters.
5. Treat speed, orientation, validity, acceleration, and target position as optional children. If the tracker timestamp chunk is missing, use the packet timestamp, which the spec defines as microseconds since the server started.

Source: [PosiStageNet protocol 2.03](https://github.com/vyv/psn-cpp/blob/master/doc/PosiStageNetprotocol_v2.03_2019_09_09.pdf), linked from [posistage.net](https://posistage.net/) as the current specification. The header layout is the one in [psn_defs.hpp](https://github.com/vyv/psn-cpp/blob/master/include/psn_defs.hpp).

## FAQ

### Can the multicast address change?
Yes. The spec says 236.10.10.10 and port 56565 are the defaults, and that the tracking server can use other values. Read them from the server before you join the group.

### What is a position unit?
The position section says the three floats are meters. Positive X is right, positive Y is up, and positive Z is depth. Speed is meters per second.

### What if a chunk id is not in the spec?
The spec says a decoder that meets an unknown chunk ignores it, using the data length in the header to skip. Do not fail the packet because a later revision added a child.
