---
title: "Take a Ross Ultrix crosspoint over RossTalk"
slug: take-a-ross-ultrix-crosspoint-over-rosstalk
category: "LED/Video"
tools: ["Ross Ultrix", "RossTalk", "TCP"]
difficulty: Intermediate
source_url: https://documentation.rossvideo.com/files/Manuals/Routers/Ultrix/User%20Guides/Ultrix%20User%20Guide%20%282101DR-004%29.pdf
labels: ["Commercial product"]
summary: "Ultrix RossTalk listens on TCP 7788, CR/LF terminated. The guide's take is XPT I:7 D:2 S:1 L:1,3,5,12-16. Omit L and every level follows."
---

## What it does

Ross Video's ULTRIX-FR1, FR2, and FR5 User Guide, part 2101DR-004-28, revision 13, released August 10, 2026, for software issue 7.4, lists RossTalk as one of the protocols on the router's Services tab. That tab is where a service is enabled or disabled. The same guide's Ethernet table gives RossTalk the default TCP port 7788. Pro-Bel SW-P-08 is a separate row in that table, on TCP 8910. The RossTalk command document, part 4802DR-403-35, dated June 2026, says Ultrix accepts RossTalk on port 7788 and that it does so automatically. Its Ultrix section also says every command is case sensitive and ends with a carriage return and a line feed.

The user guide's crosspoint command is `XPT D:<destination> S:<source> I:<user_id>` with an optional `L:` level list. Destination, source, and level IDs are the logical IDs in the active database, and they are 1-based. The user ID is the panel or user number that is requesting the take. Arguments are separated by a single space, and each argument is separated from its value by one colon. The guide says the arguments may be written in any order. Its pair of equivalents is `XPT D:1 S:4 I:2` and `XPT S:4 I:2 D:1`.

The worked example is `XPT I:7 D:2 S:1 L:1,3,5,12-16`. The guide reads that as user 7 requesting destination 2, source 1, on levels 1, 3, 5, and 12 through 16. Levels are a comma-separated list with no spaces. A range is two numbers joined by a dash, and the start has to be lower than the end. Single levels and ranges can be mixed, as in `L:1,3,4-8,12-17`. Invalid numbers are ignored. If `L` is left off, the guide says the router requests a follow switch, which is all valid levels.

The same RossTalk document has a different `XPT` table for the switcher. That table's example is `XPT ME:2:PGM:IN:6`, which selects input 6 on the program bus of ME 2. That string is not the Ultrix router form. A client written for Carbonite or Acuity should not send it to an Ultrix frame.

`GPI` is not a crosspoint. The user guide says `GPI 04` triggers the salvo whose database name ends in `[4]`. The command document's Ultrix example is `GPI 23`, which fires salvo 23. `TIMER 3:RUN`, `TIMER 1:PAUSE`, `TIMER 2:STOP`, and `TIMER 4:END` operate a clock. `ALIASLABEL` writes an alias. The guide's example `ALIASLABEL 3:SOURCE:12:"CAMERA 1"` assigns that label to source 12 through alias set 3. Alias-set numbers in the command are 1-based, and the guide says the same sets are 0-based in the database.

SW-P-08 stays on its own port. The user guide's command table names command 02 as Crosspoint Connect, a take of one crosspoint, and command 04 as the Crosspoint connected response. Command 01 is Crosspoint Interrogate and 03 is the tally. The Server Options default for the protocol variant is Use Last Request. The guide does not print the byte frame for those command IDs, so a RossTalk client should stay on the ASCII commands above.

## How to set it up

1. In DashBoard, open the Ultrix node, System, Configuration, Connections, and the Services tab. Confirm RossTalk is enabled. The user guide's default Ethernet port for that service is TCP 7788. The command document says to open the connection there and to end each command with CR/LF.
2. Take the guide's example only when destination 2 should come from source 1 for user 7 on those levels: `XPT I:7 D:2 S:1 L:1,3,5,12-16`. Use the logical IDs from the active database. They start at 1.
3. Leave `L` off only when every valid level should follow. The guide calls that a follow switch. A breakaway is an explicit list such as `L:1,3,5,12-16`, with no spaces inside the list.
4. Do not send `XPT ME:2:PGM:IN:6` to Ultrix. That example belongs to the switcher table in the same RossTalk document. Do not send `GPI` from a take client. `GPI 04` fires a salvo.
5. Leave `ALIASLABEL` out of a take client. It writes a source or destination alias. If the frame is being driven with SW-P-08 instead, use TCP 8910 and command 02 for a single connect. Read command 04 for the connected response.

Source: [Ultrix User Guide, 2101DR-004-28 Rev. 13 (August 10, 2026)](https://documentation.rossvideo.com/files/Manuals/Routers/Ultrix/User%20Guides/Ultrix%20User%20Guide%20%282101DR-004%29.pdf) and [RossTalk commands, 4802DR-403-35](https://documentation.rossvideo.com/files/Manuals/Protocol%20Documents/RossTalk-Commands%284802DR-403%29.pdf).

## FAQ

### Are Ultrix destination numbers zero-based?
The user guide says the destination, source, and level IDs in `XPT` are the logical IDs from the active database, and that they are 1-based. Alias-set numbers in `ALIASLABEL` are also 1-based in the command, while the guide says those sets are stored 0-based in the database.

### What happens if the level list is omitted?
The user guide says a command with no `L` requests a follow switch of all valid levels. The worked breakaway keeps the list, as in `L:1,3,5,12-16`. Ranges need the lower number first, and there are no spaces between entries.

### Is the ME program command the Ultrix take?
No. The RossTalk document's switcher example `XPT ME:2:PGM:IN:6` selects an ME bus. The Ultrix table uses `XPT D:`, `S:`, and `I:`. The command document says Ultrix commands are case sensitive.
