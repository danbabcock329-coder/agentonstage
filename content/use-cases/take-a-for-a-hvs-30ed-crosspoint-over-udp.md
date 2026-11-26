---
title: "Take a FOR-A HVS-30ED crosspoint over UDP"
slug: take-a-for-a-hvs-30ed-crosspoint-over-udp
category: "LED/Video"
tools: ["FOR-A HVS-30ED", "UDP"]
difficulty: Advanced
source_url: https://www.for-a.co.jp/download_file.php?id=2451&product_id=4467
labels: ["Commercial product"]
summary: "HVS-30ED editor protocol 1.00.8 sends UDP to fixed port 8740, one client. The sample ME1 program take is bytes 03 01 80 01, and the comment calls that IN1."
---

## What it does

FOR-A's HVS-30ED Editor Interface BVS/DVS Support Protocol, version 1.00.8 and higher, file HVS30ED-J-V1008, with a footer date of 21 December 2010, is the editor command list for that interface. The protocol section says it follows the standard Sony protocol and supports what this document prints. Section 6 is the Ethernet path. The communication table says the protocol is UDP, the port number is 8740 and is fixed, the client limit is one client only, and the data format is the editor command format. The note under that table says the BREAK command is not used.

Before any of those datagrams, the editor menu has to be set. Section 6.2 says Type `BVS3K` and Enable `ON`.

A command is a byte count, an effect address, a command code, and a parameter block. The byte count is the sum of the effect address, the command code, and the parameter bytes, and the spec says it is not itself included in that sum. The maximum parameter block in the format figure is 127 bytes. The warning under the format says a byte count that does not match the following bytes stops normal receive processing until a BREAK arrives. Section 6 says BREAK is not used on Ethernet.

Effect address `00` is the program/preset row. `01` is the ME 1 row. `14` and `15` are STILL1 and STILL2. `21` is printed as `EVENET MEMORY`. `29` and `2A` are PinP channel 1 and channel 2. `30`, `31`, and `32` are AUX1, AUX2, and AUX3.

BKGD A bus, the program side in the sample comment, is a write of byte count `03`, effect `01`, command `80`, and one crosspoint byte. The read is byte count `02`, effect `01`, command `00`, with no parameter. BKGD B bus uses command `81` to write and `01` to read. Table 1 names crosspoint `00` as `XPT_BLACK` and crosspoint `01` as `XPT_BNC_01`. Crosspoints run from 0 to 63. The high bit of that parameter byte is the modify flag: `0` selects table 1, and `1` selects table 2.

The sample in section 6.3 is labeled as setting ME1 program crosspoint IN1. The four bytes it stores are `03`, `01`, `80`, `01`. It opens a UDP socket, sets the port with `htons( "8740" )`, sets the address to `INADDR_ANY`, binds, sends four bytes, waits on receive for the reply, and closes. The state diagram shows the processor transmitting ACK as `84` hex after a command. The notes above the diagram say to wait for that reply before the next command, not to concatenate commands, and to treat one command per field as the basic rule.

The same listing writes the third index as `semd_buff[3]` and passes `send_buff` to `send`. It spells the bind size `sizof`. It does not print a destination address before `send`.

Event memory sits at effect address `21`. Learn is byte count `04`, effect `21`, command `80`, sub-command `01`, and a register byte from 0 to 99. Recall is the same frame with command `90`.

## How to set it up

1. In the editor menu, set Type to `BVS3K` and Enable to `ON`. Send UDP to the switcher on port 8740. The table says the port is fixed and that only one client is allowed. The sample's `htons( "8740" )` passes a quoted string. Use the numeric port.
2. Read BKGD A on ME 1 before you take it. The read is `02 01 00`. Wait for the reply before you send anything else. The state diagram's ACK is `84` hex.
3. The sample take is `03 01 80 01`. Effect `01` is the ME 1 row, command `80` is the BKGD A write, and table 1 names crosspoint `01` as `XPT_BNC_01`. The sample comment calls that byte IN1. Crosspoint `00` is `XPT_BLACK`.
4. Copy the four bytes into the buffer you actually send. The listing stores byte 3 with the name `semd_buff` and sends `send_buff`. It also binds `INADDR_ANY` and does not print the switcher's address. The datagram has to be addressed to the switcher.
5. Do not send a second command until the reply arrives, and do not join two commands in one datagram. If the byte count is wrong, the format warning says receive processing stays down until BREAK, and section 6 says BREAK is not used on this path. Keep the byte count equal to the bytes that follow it.

Source: [HVS-30ED Editor Interface BVS/DVS Support Protocol, version 1.00.8](https://www.for-a.co.jp/download_file.php?id=2451&product_id=4467).

## FAQ

### Does 03 01 80 01 select black?
The sample stores `03 01 80 01` and the comment calls it ME1 program crosspoint IN1. Table 1 names number `01` as `XPT_BNC_01` and number `00` as `XPT_BLACK`. Effect `01` is the ME 1 row. Command `80` is the BKGD A bus write.

### Why is the sample not a finished client?
The listing sets the port with `htons( "8740" )`, binds with `sizof`, writes byte 3 to `semd_buff`, and sends `send_buff`. It binds `INADDR_ANY` and does not print a destination address. The communication table says UDP port 8740 is fixed and that the client limit is one.

### What happens if the byte count is short?
The byte count is the effect address plus the command code plus the parameter bytes. The format warning says a mismatch stops normal receive processing until a BREAK command. Section 6 says the BREAK command is not used on Ethernet. The notes also say one command per field, after the previous reply.
