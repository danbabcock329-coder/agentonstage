---
title: "Recall a Yamaha MTX or MRX preset over TCP"
slug: recall-a-yamaha-mtx-or-mrx-preset-over-tcp
category: "Audio"
tools: ["Yamaha MTX/MRX", "TCP"]
difficulty: Advanced
source_url: https://data.yamaha.com/files/download/other_assets/5/1343735/200330_mtx_mrx_xmv_ex_rcps_v400_rev14_en.pdf
labels: ["Commercial product"]
summary: "Yamaha MTX/MRX spec V4.0.0 rev14 uses TCP port 49280. devstatus runmode must answer normal. ssrecall 1 recalls preset 1 and returns OK ssrecall 1."
---

## What it does

Yamaha's Remote Control Protocol Specifications, version 4.0.0 rev14, covers the MTX3, MTX5-D, MRX7-D, XMV series, EXi8, and EXo8 at firmware V4.00 and later. Section 1.2 puts Ethernet control on the NETWORK connector at TCP port 49280. MTX3, MTX5-D, and MRX7-D also accept the same commands on the RS-232C REMOTE connector, 8 data bits, no parity, 1 stop bit, no flow control, at 38400 or 115200. XMV, EXi8, and EXo8 have no REMOTE connector.

Section 3.1 says every command ends with LF, byte 0x0A. A bare LF is the heartbeat. Options are separated by at least one space, and the command text is ASCII. A string is wrapped in double quotes. A quote or a backslash inside a string is escaped with a backslash.

Section 1.3.1 says one MTX or MRX accepts up to nine controllers at once, eight on the network and one on RS-232C. XMV, EXi8, and EXo8 accept up to eight network controllers. When one of those is being controlled by an MTX or MRX, that limit drops to seven external controllers. On an MTX5-D in Dante daisy-chain mode either network jack can carry remote control. In Dante redundant mode, only the Primary jack, or RS-232C, can.

Remote control starts with `devstatus runmode`. The worked reply is `OK devstatus runmode "normal"`. The note says the external controller must send that command and wait, and that the device is ready for further commands when the reply is `"normal"`. The other printed run modes are `"emergency"` and `"update"`. `"emergency"` is marked invalid on XMV, EXi8, and EXo8. A command that fails comes back as `ERROR`, the command name, and a code. `AccessDenied` includes the case of `ssrecall` while the unit is in emergency run mode. `UnknownCommand`, `WrongFormat`, `InvalidArgument`, and `UnknownAddress` are the other codes for a line the unit will not run.

Preset recall is `ssrecall` plus an index. The command list says this command is invalid on XMV, EXi8, and EXo8. The worked exchange is `ssrecall 1` answered by `OK ssrecall 1`, which the meaning line calls preset 1. `sscurrent` with no argument asks which preset was recalled last. The worked reply is `OK sscurrent 10 unmodified`. `ssrecall_ex list` is a different command, and the command list says it is available only on MRX7-D. The worked line is `ssrecall_ex list 3`, answered `OK ssrecall_ex list 3`. The meaning sentence under that example says the snapshot assigned to index 2 was recalled.

An MRX7-D parameter is not addressed until it is in the Remote Control Setup List, created in MTX-MRX Editor and uploaded at synchronization. The raw set for that list is `set MTX:Index_1 0 0 -7760`, answered `OK set MTX:Index_1 0 0 -7760 "-77.60"`. The same page says V2.02 and earlier used `MTX:Index_001`. On MTX3, MTX5-D, XMV, EXi8, and EXo8 the address is `MTX:mem_` plus MemNo, UniqueId, ElmNo, Xpos, Ypos, PrmNo, and IndexNo. The worked set is `set MTX:mem_512/60000/0/0/0/0/0 0 0 -7760`, answered `OK set MTX:mem_512/60000/0/0/0/0/0 0 0 -7760 "-77.60"`. The meaning line calls that the 1ch level of the DCA fader. Section 7 labels UniqueId 60000 as the input-channel fader level, in dB times 100, from negative infinity to 10.00 dB. A value outside the range is clamped, and that reply is `OKm` rather than `OK`.

[Recall Yamaha CL, QL and TF scenes over the remote protocol](/use-cases/recall-yamaha-cl-ql-and-tf-scenes-over-the-remote-protocol) also uses TCP port 49280. That page's scene recall is `ssrecall_ex MIXER:Lib/Scene`. This spec's preset recall is `ssrecall`, and its MRX snapshot recall is `ssrecall_ex list`.

## How to set it up

1. Open TCP to the NETWORK address on port 49280. Use RS-232C only on an MTX3, MTX5-D, or MRX7-D, at the bit rate saved under MTX-MRX Editor, System, Remote control. Do not send the CL/QL/TF scene address to this port.
2. Send `devstatus runmode` and a line feed. Continue only when the reply is `OK devstatus runmode "normal"`. `"emergency"` and `"update"` are the other replies this section prints. An `ERROR` line names the command that was rejected.
3. Ask before you recall. `sscurrent` is the query. The worked reply is `OK sscurrent 10 unmodified`. Recall preset 1 with `ssrecall 1`. Accept it when the reply is `OK ssrecall 1`. The command list says `ssrecall` is invalid on XMV, EXi8, and EXo8.
4. On an MRX7-D, recall a snapshot only after the Remote Control Setup List is on the unit. `ssrecall_ex list 3` is the worked command, and the reply line is `OK ssrecall_ex list 3`. The meaning sentence under it says index 2. Read the index you sent, not that sentence.
5. For a level, use the parameter list. The worked MTX set for UniqueId 60000 is `set MTX:mem_512/60000/0/0/0/0/0 0 0 -7760`, and the reply includes `"-77.60"`. `OKm` means the unit changed the number to fit the range. End every line with LF. If keepalive was turned on, the worked setting is `scpmode keepalive 2000`, and a bare LF counts as the heartbeat.

Source: [MTX3, MTX5-D, MRX7-D, XMV Series, EXi8, EXo8 Remote Control Protocol Specifications, V4.0.0 rev14](https://data.yamaha.com/files/download/other_assets/5/1343735/200330_mtx_mrx_xmv_ex_rcps_v400_rev14_en.pdf).

## FAQ

### Does ssrecall 1 load the same thing as a CL scene?
This spec's worked preset recall is `ssrecall 1`, answered `OK ssrecall 1`. The CL/QL/TF page linked above uses `ssrecall_ex MIXER:Lib/Scene` on the same port number, 49280. On an MRX7-D, this spec's snapshot command is `ssrecall_ex list`, not the mixer-library address.

### Why does the snapshot example disagree with its meaning line?
The command and the response are `ssrecall_ex list 3` and `OK ssrecall_ex list 3`. The meaning sentence under that pair says the snapshot assigned to index 2 was recalled. The command list also says `ssrecall_ex` is available only on MRX7-D.

### Is UniqueId 60000 a DCA?
The set example's meaning line calls `MTX:mem_512/60000/0/0/0/0/0` the 1ch level of the DCA fader, and the reply string is `"-77.60"`. Section 7 labels UniqueId 60000 as the input-channel fader level, stored as dB times 100. A clamped write is answered with `OKm`.
