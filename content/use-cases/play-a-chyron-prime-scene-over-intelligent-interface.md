---
title: "Play a Chyron PRIME scene over Intelligent Interface"
slug: play-a-chyron-prime-scene-over-intelligent-interface
category: "LED/Video"
tools: ["Chyron PRIME", "TCP"]
difficulty: Intermediate
source_url: https://help.chyron.com/hc/en-us/article_attachments/45926139175316
labels: ["Commercial product"]
summary: "PRIME's January 2026 P-command guide plays scene 1000 on output channel 1. A leading asterisk is success. Error 00004191 means the command was malformed."
---

## What it does

Chyron's PRIME Automation P Commands User Guide, version 5.3, January 2026, is the default Intelligent Interface command list for graphics output channels. The opening note says a customized rule engine on that connection can change how a command is handled, and that the parameter descriptions stay the ones in the guide.

The standard shape is `P\` then the behavior, then backslash-separated fields, ending in `\\`. Channel numbers are 1-based. The guide says the first channel is index 1. `P\LOAD\1\1000\\` loads scene 1000 on channel 1, on the layer stored in the scene, into Preview. If that scene is already playing, the guide says a second copy appears in Preview. `P\PLAY\1\1000\\` plays scene 1000 on channel 1 to Program, on the layer stored in the scene. If the scene is already in Preview, that instance is played to Program. Otherwise it is played from disk. `P\PLAY\1\*\\` plays every scene currently loaded in Preview on channel 1. The guide says the asterisk is supported on Play and Play All, and not on every command.

An optional buffer field sits after a colon. The parameter table says `0` and the word `Preview` affect Preview, `1` and the word `Program` affect Program, and `*` affects both. If the buffer is omitted, the colon is omitted too. The capture command later in the same guide, `P\CO`, prints the opposite numbers: buffer `0` for Program and `1` for Preview.

`P\SCENE_STATE` plus a channel and a scene name asks where that scene is. The printed replies are `*P\SCENE_STATE\Closed\\`, `Loaded`, `Playing`, `Loaded\Playing`, and `NonExistent`. The guide says Loaded and Playing are the only pair that can come back together. A malformed state query returns `00005507`. The general failure list is `000040B3` when the asset is not found, `00004190` when the command is formatted but cannot be fulfilled, `00004191` when the command is malformed, and `00004192` for an unknown error. Success for most of these commands is a single asterisk. The load-response example shows a success line that starts with `*` and repeats the command.

The PRIME Automation User Guide is the connection side. A new Intelligent Interface connection defaults to TCP/IP and to Western European (ISO-8859-1) text. The sending system has to use that same encoding. The port is a field on the dialog. That guide does not print one factory port number. Once the connection is enabled, the status it names is Waiting For Connection. Patterns in the rule editor are matched from the left and are not case-sensitive. The default heartbeat is two backslashes followed by a carriage return and a line feed, and that heartbeat is handled immediately rather than queued. The guide says the heartbeat text can be changed in `C:\ChyronHego\Prime\Automation.xml`.

Chyron's January 2023 NewsTicker network table lists TCP 23 through 50, service IIP, direction from NewsTicker to PRIME, described as PRIME automation control. Responses in that table are TCP 2023 through 2050, direction from the CG back to NewsTicker. That table is the NewsTicker path. It is not a line in the PRIME connection dialog.

## How to set it up

1. In PRIME, add an Intelligent Interface connection and leave the transport on TCP/IP. Match the encoding to ISO-8859-1 unless the dialog shows a different encoding. Read the port from that dialog. Enable the connection and wait until the status is Waiting For Connection.
2. Ask before you play. Send `P\SCENE_STATE\1\1000\\` for scene 1000 on channel 1. `*P\SCENE_STATE\Closed\\` means the scene exists and is neither in Preview nor on Program. `NonExistent` means the name is not there. `00004191` means the command was malformed.
3. Load with `P\LOAD\1\1000\\`. The 5.3 guide says that puts scene 1000 on channel 1 into Preview. Play with `P\PLAY\1\1000\\`. That plays it to Program. Channel 1 is the first channel. A leading asterisk is the success shape in the response examples.
4. End the line the way the heartbeat section ends a command: the closing backslashes, then CR, then LF. Keep the sender on ISO-8859-1. The rule editor is not case-sensitive, and a customized rule can change what `P\PLAY` does.
5. Do not mix the two buffer tables. The parameter section says `0` is Preview and `1` is Program. The `P\CO` capture section says `0` is Program and `1` is Preview. Read the section for the command you are sending.

Source: [PRIME Automation P Commands User Guide, 5.3, January 2026](https://help.chyron.com/hc/en-us/article_attachments/45926139175316), [PRIME Automation User Guide](https://help.chyron.com/hc/en-us/article_attachments/45926163343508), and [Network Requirements (v4)](https://help.chyron.com/hc/en-us/articles/23328370182932-Network-Requirements-v4).

## FAQ

### Does P\\LOAD\\1000\\\\ include a channel?
The 5.3 command guide's load example is `P\LOAD\1\1000\\`, and it says the channel index is 1-based. The automation guide's rule-editor walkthrough prints `P\LOAD\1000\\` and describes that shorter line as loading scene 1000 to Preview. Use the 5.3 example when the channel matters.

### What does a single asterisk mean?
The error-code section says most commands return success as a single asterisk. The load-response example returns a line that starts with `*` and includes the command. `00004191` is the malformed-command code. `00004190` is a command that parsed and could not be fulfilled.

### Is port 23 the PRIME default?
The automation guide prints the port as a setting on the Intelligent Interface dialog and does not print a factory number. The January 2023 NewsTicker table lists TCP 23 through 50 as the IIP ports from NewsTicker to PRIME. Read the port on the connection you enabled.
