---
title: "Recall a Lake frame preset over DLM"
slug: recall-a-lake-frame-preset-over-dlm
category: "Audio"
tools: ["Lake", "Lab Gruppen", "DLM"]
difficulty: Advanced
source_url: https://beetech-inc.com/wp/wp-content/uploads/DLM-Lake-3rd-party-protocol-v3_4.pdf
labels: ["Commercial product"]
summary: "Lake processors take Direct Lake Messaging on UDP port 6015. The command Dev.Preset.Recall!1 recalls frame preset 1. Presets are numbered 1 to 100."
---

## What it does

Lab.gruppen's Direct Lake Messaging v3.4 is the third-party UDP protocol for Lake processors. The public document, file `PLM and LM 3rd party protocol v3_4 PUBLIC - APPROVED v1A`, last modified 15 June 2015, is the reference. It applies to DLM protocol version 1 on PLM firmware 2.58 and above, version 2 on LM firmware 0.32 and above, and version 3 on D Series and PLM+ firmware 2.36 and above. Some commands name a later firmware in their own heading.

In fixed-port mode the unit listens on UDP 6015, and the controller listens on UDP 6004. The document says port 6004 may not be used by any other program. The example application defines `DLM_PORT_RCV` as 6015 and `HOST_PORT_RCV` as 6004, and its comment on the send port says other ports can be used. Dynamic mode sends to UDP 6016, and the reply comes back to the port the message came from.

A command is not a raw text datagram. It is a little-endian packet. The header carries a 64-bit source id and a 64-bit destination id, each split into high and low 32-bit fields, a source class, a destination class, the total length including header, payload, and footer, a packet type, and a message id. A host uses source class 6. A specific device uses destination class 5. Broadcast class is 0, and the broadcast destination id is high `-2` and low `-3`. The footer is a 4-byte checksum. Section 5 says the hardware will not accept a packet larger than 560 bytes. Packet type 701 is `Msg_DLMMsg`. The payload is a null-terminated command string. The example application copies that string into the payload and sets the DLM message checksum to 0 before it sends.

`!` means do, `=` means set, and `?` means get. Parameters are separated by a single space. `Dev.Preset.Recall!1` recalls frame preset 1. The command table lists presets 1–100, supported on D Series and PLM+ 2.36, PLM 2.58, and LM 0.32. `Dev.Preset.Name?` with a number in that range returns the stored name, up to 64 characters. `Dev.Preset.Store!1 testpreset` stores the current configuration in position 1 under that name. Store on PLM requires 2.74 rather than 2.58.

Replies that you asked for come back as `Msg_Ack`, packet type 2, with your message id. A message id of `0xFFFFFFFF` means you do not want a reply. In fixed mode, listen on UDP 6004. `ACK_SUCCESS` is `-2`, which means the packet was processed. `-3` means the sender is not master of the device. `-4` is a bad checksum or an unsupported type. `-5` is a DSP error. `-6` is a bad parameter.

The hardware id is the destination id. In Lake Controller, from Home go to Modules, select a module on that processor, open I/O Config, and click Technical Data. The front panel path in the document is MENU, Frame, Network. The default IP mode is Auto ZeroConf, so the address can change between boots. More than one active network adapter on the controller can send the packet out the wrong interface.

## How to set it up

1. Read the frame id from Lake Controller: Home, Modules, the module on that processor, I/O Config, Technical Data. Or use the front panel path MENU, Frame, Network. Put the controller on one network adapter in the same subnet. The document warns that a second active adapter can reroute the UDP.
2. Bind the fixed-mode sockets the example uses: send to the processor on UDP 6015, and listen on UDP 6004. Leave 6004 unused by anything else. For dynamic mode, send to UDP 6016 and take the reply on the originating port.
3. Build a little-endian `Msg_DLMMsg`. Set the source class to 6 and the destination class to 5. Put the frame id in the destination id. Set the packet type to 701. Set the length to the full packet, header through footer. Put a unique message id in the header unless you want no reply, in which case use `0xFFFFFFFF`.
4. Put the null-terminated command `Dev.Preset.Recall!1` in the payload. The example application sets the footer checksum to 0 for this packet type. Send it. On UDP 6004, an ack result of `-2` means the packet was processed. `-3` means this sender is not master of the device.
5. Read the name first when the slot number is not enough: `Dev.Preset.Name?1` returns the name stored in preset 1. Store is a different command, `Dev.Preset.Store!1 testpreset`, and the table's PLM firmware for store is 2.74.

Source: [Direct Lake Messaging v3.4](https://beetech-inc.com/wp/wp-content/uploads/DLM-Lake-3rd-party-protocol-v3_4.pdf).

## FAQ

### Why is success minus two?
The ack table defines `ACK_SUCCESS` as `-2`, packet processed successfully. `-3` means the sender is not master. `-6` means a bad parameter. A message id of `0xFFFFFFFF` asks the device not to reply at all.

### Do I send the command as plain text to port 6015?
The command string sits in the payload of a `Msg_DLMMsg` packet, type 701, with the header and footer described above. The example application null-terminates that string and sets the DLM message checksum to 0.

### Which firmware is the preset recall written for?
The recall row says D Series and PLM+ 2.36, PLM 2.58, and LM 0.32. Store on PLM is listed at 2.74. The version section says some commands need a later firmware than the document-wide minimum, and that the heading of the command is where that is written.
