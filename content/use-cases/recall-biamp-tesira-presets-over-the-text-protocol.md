---
title: "Recall Biamp Tesira presets over the text protocol"
slug: recall-biamp-tesira-presets-over-the-text-protocol
category: "Audio"
tools: ["Biamp Tesira", "TTP"]
difficulty: Intermediate
source_url: https://downloads.biamp.com/assets/docs/default-source/control/tesira_text_protocol_v4-2_jan22.pdf?sfvrsn=100c2497_46
labels: ["Commercial product"]
summary: "Tesira Text Protocol 4.2 is ASCII over SSH port 22 or Telnet port 23. After login, a client can list instance tags, read a level, and recall a preset by ID."
---

## What it does

Biamp's Tesira Text Protocol Version 4.2 (2 Dec 2021) is the ASCII control path for a programmed Tesira system. The manual says a third-party controller or a terminal can use RS-232 or Ethernet. Ethernet is Telnet or SSH. Commands are case sensitive. A line feed or a carriage return ends each command. A success response starts with `+OK`. An error response starts with `-ERR`.

Telnet is TCP port 23. The manual says a server supports up to 32 Telnet connections, that commands sent by Telnet are not encrypted, and that Telnet can be turned off for Tesira Server, Server IO, Tesira amplifiers, or TesiraFORTÉ in Device Maintenance, Network Settings. A raw TCP client that never answers Telnet option negotiation does not get a session. The manual says the simple rejection is DON’T (`0xFE`) when the server sends WILL (`0xFB`), and WON’T (`0xFC`) when the server sends DO (`0xFD`), echoing the option byte. After negotiation the server sends `Welcome to the Tesira Text Protocol Server`.

SSH is TCP port 22. The manual says those commands are encrypted, and that the session limit is 80 per Tesira. After 64 sessions, new ones start failing on a planned percentage. At 80, further connections are refused. The SSH section says an unprotected system uses username `default` and does not require a password. The earlier TTP Security section says an unprotected system's username and password are both `default`. A protected system uses the credentials configured on it. Either section says a login of controller or higher is required to change the system, and an observer can only query.

The device instance tag `DEVICE` is case sensitive and must be capitals. Service commands are `Instance_Tag`, then the service, then a value when that service needs one. The manual's table row for recalling a preset is instance tag `DEVICE`, service `recallPreset`, value `1001`. The service table says `recallPreset` takes a preset ID integer, `recallPresetByName` takes a preset name string, and `startAudio` and `stopAudio` take no value. `reboot` and `deleteConfigData` are also device services. This entry does not send them.

Attribute commands are `Instance_Tag Command Attribute [Index] [Value]`. Biamp's Tesira Text Protocol Cornerstone article, which documents subscriptions and the same `+OK` / `-ERR` replies, prints these worked strings: `Level3 set level 2 0` returns `+OK`, and `Level3 get level 2` returns `+OK "value":0.000000`. `SESSION get aliases` returns the instance tags. The article's bad-tag example `level3 set mute 3 true` returns `-ERR address not found`, because the tag on that system was `Level3`. The manual says instance tags are case sensitive, that `/` and `&` are illegal in a tag, and that a tag with spaces has to be wrapped in double quotes.

Subscriptions are session based. The article says the first response includes the current value, later messages wait until the value changes, and the subscription disappears if the session drops or the server reboots. A rate in milliseconds is optional and limits how often updates are sent. The article's example is `MyLevel1 subscribe level 1 MyLevelCustomLabel 500`.

## How to set it up

1. Prefer SSH to port 22. The manual says Telnet on port 23 is not encrypted. Enable the service in Device Maintenance, Network Settings, if it is off. Log in. On an unprotected system, try username `default`. The SSH section says no password is required there. The TTP Security section says the password is also `default`. Use the configured account on a protected system, and use controller or higher if you will recall a preset.
2. Send `SESSION get aliases` and a line feed. The Cornerstone article's success body is `+OK "list":[ ... ]` of tag names. Use those spellings. `Level3` and `level3` are not the same tag.
3. Read before you write. `Level3 get level 2` is the article's get example, and the reply looks like `+OK "value":0.000000`. Change one channel only after that read, with a set such as `Level3 set level 2 0`, and read it back.
4. Recall a preset with `DEVICE recallPreset` and the preset ID. The manual's table uses `1001` as that value. Confirm the ID in Tesira software before you send it. `recallPresetByName` takes the preset name string instead.
5. Do not send `DEVICE reboot`, `DEVICE deleteConfigData`, or `DEVICE stopAudio` from an unattended client. They are device services in the same table as recall.

Source: [Tesira Text Protocol v4.2 (2 Dec 2021, PDF)](https://downloads.biamp.com/assets/docs/default-source/control/tesira_text_protocol_v4-2_jan22.pdf?sfvrsn=100c2497_46) and [Tesira Text Protocol on Biamp Cornerstone](https://support.biamp.com/Tesira/Control/Tesira_Text_Protocol).

## FAQ

### Why does Telnet connect and then sit there?
The manual says the server negotiates Telnet options (RFC 854 and RFC 855) and will not continue if the client ignores them. Reject each option, or use a real Telnet client, or use SSH on port 22.

### Can an observer recall a preset?
The security section says an observer can query levels and other current parameters, and that changes need a login of controller or higher. A get of a level fits the observer role. `recallPreset` is a change.

### Do subscriptions survive a reboot?
The Cornerstone article says they are lost when the server reboots or the session drops, and that they belong to the session that created them. Resubscribe with the same custom label if you still want the updates.
