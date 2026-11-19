---
title: "Recall a Bose ControlSpace set over TCP"
slug: recall-a-bose-controlspace-set-over-tcp
category: "Audio"
tools: ["Bose ControlSpace", "TCP"]
difficulty: Intermediate
source_url: https://assets.boseprofessional.com/m/3f75dade2573b467/original/ControlSpace-Serial-Protocol-v5-14-1.pdf
labels: ["Commercial product"]
summary: "ControlSpace protocol v5.14.1 takes ASCII on TCP port 10055. SS b recalls parameter set 11. A system Set sends no ack, so follow it with GS."
---

## What it does

Bose Professional's ControlSpace Serial Control Protocol v5.14.1, revision date 4 November 2024, is the third-party text protocol for ControlSpace processors, PowerMatch amplifiers, PowerShare amplifiers, the MSA12X, and the WP, EP, and EX endpoints. This page follows the serial-over-Ethernet path for ESP, EX, networked PowerMatch, and PowerShare. Those products are the server. The controller opens TCP to them. The document's port for that connection is 10055. ESP-00, PowerMatch, and PowerShare keep 10055 fixed. A 1U ESP or an EX uses 10055 unless the port was changed or disabled in the device properties inside ControlSpace Designer.

The same section says Designer closes the third-party connection while it goes online to load a design, and that the controller connects again once the processor is online. The connection table lists 32 simultaneous serial-over-Ethernet sessions for EX-1280C, EX-12AEC, EX-440C, EX-1280, the 1U ESP models, and networked PowerMatch, and 8 for ESP-00 Series II, ESP-00, ESP-88, and the PowerShare PS404D and PS604D. Those seats are shared with ControlSpace Remote. A further client is refused until one session closes. Query replies go only to the client that asked. Serial output is copied to every active connection, including the RS-232 port on ESP and EX.

Every command is ASCII and ends with a carriage return, byte `0x0D`. System commands use hexadecimal values with no `h` suffix. `SS n` recalls parameter set `n`, from `1` to `FF` hex, which the command line writes as 1 to 255 decimal. The worked example `SS b` recalls parameter set 11, because `b` hex is 11. `GS` asks which parameter set was recalled last. The response is `S n`, and `n` of `0` means none since power-up. The example response `S 5` means parameter set 5. System Set commands send no acknowledgement. The format section says to follow a Set with a Get.

Module commands are a different grammar, decimal rather than hex, and they do answer. `SA"Input 1">3=-21` is the document's example that sets the level of the module named Input 1 to -21 dB. Index 3 on an input module is level, from -60.5 to +12.0 dB in 0.5 dB steps. `SA"Input 1">4=O` is the example that mutes that input. `O` is mute on, `F` is off, and `T` toggles. A module name is in quotes and has to be unique on that device. Success is byte `0x06`. A refused command is byte `0x15` plus a two-digit code: `01` is a bad or duplicate module name, `02` is an illegal index, `03` is a value out of range, and `99` is unknown. Group mute is still a system command: `SN 4,M` mutes group 4, and `GN 4` reads it back as `GN 4,M` when it is muted.

WP, EP, and EX endpoints, and the MSA12X, are not this TCP port. The document gives them UDP port 49494. It also says that a setting sent straight to an endpoint which is paired with an EX can be overwritten by the processor.

## How to set it up

1. Open a TCP connection to the ESP, EX, networked PowerMatch, or PowerShare processor on port 10055. Confirm in Designer that a 1U ESP or EX has not been moved off that default. The processor is the server, so the controller has to connect first.
2. Recall parameter set 11 with the ASCII line `SS b` and a carriage return. System commands are hex, so 11 decimal is `b`. There is no ack. Send `GS` and a carriage return, and read `S n`. `S 0` means no parameter set has been recalled since power-up.
3. Mute group 4 with `SN 4,M`. Read it with `GN 4`. The example response for a muted group is `GN 4,M`. `U` unmutes and `T` toggles. Group numbers in that section run from 1 to `40` hex.
4. Set one input with a module command, which does ack. `SA"Input 1">3=-21` sets that module's level to -21 dB. `SA"Input 1">4=O` mutes it. Wait for byte `0x06`. Byte `0x15` followed by `01` means the name did not match, or two modules share it.
5. Leave UDP 49494 for an endpoint or an MSA12X. If Designer goes online, expect the TCP session to drop until the new design has loaded, then connect again.

Source: [ControlSpace Serial Control Protocol v5.14.1](https://assets.boseprofessional.com/m/3f75dade2573b467/original/ControlSpace-Serial-Protocol-v5-14-1.pdf).

## FAQ

### Is this Q-SYS QRC?
[Inspect and control a Q-SYS Core from an AI agent](/use-cases/inspect-and-control-a-q-sys-core-from-an-ai-agent) speaks QRC on port 1710. The commands on this page are Bose ControlSpace text on TCP 10055, and a system Set such as `SS` does not return an ack.

### Do I send SS to a wall-panel endpoint?
No. The v5.14.1 connection section puts ESP, EX, PowerMatch, and PowerShare on TCP 10055, and puts WP, EP, and EX endpoints, plus the MSA12X, on UDP 49494. A paired endpoint can have a direct write overwritten by the EX processor.

### What does a missing ack mean?
For `SS`, `SN`, and the other system Set commands, the format section says no acknowledgement is sent. Follow the Set with the matching Get. Module `SA` is the other pattern: byte `0x06` is success, and byte `0x15` plus `03` means the value was out of range.
