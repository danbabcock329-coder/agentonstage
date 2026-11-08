---
title: "Play an Alcorn McBride sequence over the ASCII protocol"
slug: play-an-alcorn-mcbride-sequence-over-the-ascii-protocol
category: "Show Control"
tools: ["Alcorn McBride", "V16X", "BinloopX", "RidePlayer"]
difficulty: Intermediate
source_url: https://docs.alcorn.com/latest/api-reference/protocols
labels: ["Commercial product"]
summary: "Alcorn X-Series takes ASCII on TCP or UDP 2640, ended with CR. mySequencePL plays that V16X sequence. A quoted clip name plus PL plays media and returns R."
---

## What it does

Alcorn McBride's protocol page describes the ASCII control set for its show-control players. Commands go to UDP port 2640 or TCP port 2640. Each command ends with a carriage return, hex `0x0D`, which the page also writes as `\r`. Responses end with a carriage return too. On TCP, several commands can share one packet, and a command is processed only when its carriage return arrives, so a command split across packets is still valid. The page's example plays a sequence named `mySequence` on a V16X: the packet data is `mySequencePL` followed by that carriage return.

The commands page says it covers the X-Series: RidePlayer, V16X, V4X, BinloopX, and RidePlayerX. It tells you to use the older product manuals for earlier generations. Media commands on that page are a different suffix from the sequence example. RidePlayer and RidePlayerX take them directly. A BinloopX module does not. The forward-command form is `<cmd>|<slot>FC`. The page's examples are `"myClip"PL|R2FC` plus a carriage return, which sends that play to slot 2, and `RJ|R3FC` plus a carriage return, which sends that stop to slot 3.

Play, loop, and search are documented for RidePlayer, RidePlayerX, and BinloopX. The play format ends in `PL`. The filename is required and written in quotes. A number in quotes matches a clip whose name ends in that number, and the page's example is `"1"` matching `clip00001`. The output is optional, defaults to output 1, and is written as `[1]` or `C4` or `*` for every output. A start offset looks like `>00:00:10.01<`. The page's video example is `>00:00:10.01<"myVideo"[1]PL` plus a carriage return, and the response is `R` plus a carriage return. Loop uses `LP` instead of `PL`. Search uses `SE` and loads the clip paused. The documented failures are `E04` for an invalid command, `E06` for invalid parameters, and `E11` when the media is not found.

Stop ends in `RJ`. Pause ends in `PA`. The pause example for whatever is playing on output 3 is `[3]PA` plus a carriage return, and the response is again `R`. A version query is `?V`, and the example reply is `RidePlayer v6.8.0` plus a carriage return.

Scheduled sequence triggers are a separate API on the same commands page, for devices with SyncCore such as RidePlayer, V16X, and BinloopX. The add-trigger example is `00:00:00.00|Timeline_Scene1|1681839582.123456|Play|AddTT` plus a carriage return. That schedules a play. It is not the immediate `mySequencePL` command.

## How to set it up

1. Program the sequence in WinScript Live and confirm its name. The protocol example uses the name `mySequence` with no quotes around it.
2. Send UDP or TCP to the player's address on port 2640. The bytes are `mySequencePL` and then `0x0D`. On TCP you can place a second command in the same packet, and each one still needs its own carriage return.
3. To roll a clip on a RidePlayer or RidePlayerX, quote the name and end in `PL`. The documented video roll is `>00:00:10.01<"myVideo"[1]PL` plus a carriage return. Expect `R`. `E11` means the media was not found. `E04` and `E06` are the invalid-command and invalid-parameter replies.
4. On a BinloopX, wrap the media command. `"myClip"PL|R2FC` plus a carriage return is the page's play to slot 2. `RJ|R3FC` plus a carriage return is the stop sent to slot 3. Do not send the bare RidePlayer string to a BinloopX slot and expect it to land.

Source: [Alcorn McBride protocols](https://docs.alcorn.com/latest/api-reference/protocols) and [X-Series commands](https://docs.alcorn.com/latest/api-reference/commands).

## FAQ

### Does the sequence name get quotes?
The protocol page's V16X example is `mySequencePL` with the carriage return after `PL`, and the name is not quoted. Media play is the command that requires quotes. The video example is `"myVideo"` inside `>00:00:10.01<"myVideo"[1]PL`.

### What comes back when the clip plays?
The play, loop, search, pause, and stop sections say success is `R` followed by a carriage return. `E04` is an invalid command, `E06` is invalid parameters, and `E11` is media not found. The sequence example on the protocol page says responses end with a carriage return, and it does not print a separate response body for `mySequencePL`.

### Which products take a bare PL?
The media play section lists RidePlayer, RidePlayerX, and BinloopX. BinloopX still needs the slot wrapper, as in `"myClip"PL|R2FC`. The `mySequencePL` example is written for a V16X sequence. The commands page says earlier hardware should be checked against its own manual.
