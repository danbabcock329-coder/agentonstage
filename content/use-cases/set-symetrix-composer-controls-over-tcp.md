---
title: "Set Symetrix Composer controls over TCP"
slug: set-symetrix-composer-controls-over-tcp
category: "Audio"
tools: ["Symetrix Composer", "TCP", "UDP"]
difficulty: Intermediate
source_url: https://composer-docs.symetrix.co/control/reference-topics/control-protocol/CP_Control_Commands.html
labels: ["Commercial product"]
summary: "Symetrix Edge and Radius take CS on TCP or UDP port 48631. CS 1 754 sets control 1 and returns ACK. GS 1 reads it back."
---

## What it does

Symetrix Composer control is human-readable text. General notes say to send it to TCP or UDP port 48631 on the Edge or Radius unit. The IP is in the Connection Wizard or, on some units, on the front panel. Each command ends with a carriage return. A trailing zero is optional. Do not split one command across packets. TCP was added in Composer 2.0 and is not Telnet. It does not use Telnet options or escape sequences.

Up to six TCP sessions can be open. A seventh closes the least recently used one. `Q!` closes the current TCP session and returns `ACK`. The setup page says a `NAK` on `Q!` usually means it was not sent on TCP. Keep one TCP connection and send many commands through it. After a power cycle the controller has to open TCP again. UDP replies go to the last address and port that sent a packet, and that address is kept across power cycles.

New units default to quiet mode on. The setup page says the command writeups assume quiet mode is on, and that responses are then `ACK`, `NAK`, or a simple value. Quiet mode is separate for Ethernet and RS-232. `SQ 0` turns it off for the port that received the command and replies `Setting Quiet Mode to false.`

Control numbers are assigned in Composer, from 1 to 10000. `CS <number> <position>` sets an absolute position. Position is a decimal from 0 to 65535. Success is `ACK`. Failure is `NAK`. A missing control number is the typical failure. `CS` can take up to 40 ms because the unit checks that the number exists. `CSQ` is the same set without that check. The page says a single `CSQ` answers in 5 to 10 ms, and each command in a burst within 2 ms, and that `CSQ` returns `ACK` even when the control number is not in the site.

`GS <number>` returns the position, 0 to 65535, or `NAK`. A two-state button comes back as 0 or 65535 no matter what you sent. The page's mute example sends `CS 1 754` and then `GS 1`, and the reply is `0`, not `754`. Coarser parameters, including input selectors, quantize the same way. If one number drives several parameters, the system returns one value.

`CC <number> <0 or 1> <amount>` moves relative. 0 decrements, 1 increments, and the amount is 0 to 65535. The value stops at the parameter's minimum or maximum. The page's example is an increment of 10 from 65530, which lands on 65535.

`LP <preset>` loads a preset from 1 to 1000. `NAK` usually means that preset was not defined. `GPR` returns the last preset loaded, as four digits. 0 means none has been recalled. `FU` flashes the front-panel LEDs as a comms check. The optional cycle count defaults to 8. `FU 0` stops the flashing.

General notes say a unit rebroadcasts control to other units that share its site identifier. Two independent site files on one network need different identifiers, set under Tools, Site Preferences, or they will act on the same control numbers. A third-party controller still talks only to the unit it addresses.

## How to set it up

1. Read the unit IP from the Connection Wizard or the front panel. Open one TCP connection to port 48631 and leave it open. Send `FU` and wait for `ACK` plus the LED flash before you change a level.
2. In Composer, read the control number you assigned. Send `GS 1` for control 1 and keep the decimal it returns.
3. Send `CS 1 754` only when you mean that position. Wait for `ACK`. Send `GS 1` again. If the control is a two-state button, expect 0 or 65535, not a copy of 754.
4. Recall a preset that exists with `LP` and the preset number, from 1 to 1000. `NAK` means it is not defined. Do not use `CSQ` when you need to know the number exists. It answers `ACK` either way.
5. Give each independent site file its own site identifier before two systems share a network. Otherwise a set on one unit is rebroadcast to the others.

Source: [Control commands](https://composer-docs.symetrix.co/control/reference-topics/control-protocol/CP_Control_Commands.html), [general notes](https://composer-docs.symetrix.co/control/reference-topics/control-protocol/CP_General_Notes.html), and [setup commands](https://composer-docs.symetrix.co/control/reference-topics/control-protocol/CP_Setup_Commands.html).

## FAQ

### Why did GS return 0 after CS 1 754?
The control-commands page uses that pair as the mute-button example. A two-state button reads back as 0 or 65535, not the number you wrote.

### Does CSQ mean the control exists?
No. The page says `CSQ` skips the existence check and still returns `ACK`. Use `CS` when a missing number should come back as `NAK`.

### What closes a TCP session?
`Q!` closes the current one. A seventh connection also drops the least recently used session. The general notes say to keep one session open rather than reconnecting per command.
