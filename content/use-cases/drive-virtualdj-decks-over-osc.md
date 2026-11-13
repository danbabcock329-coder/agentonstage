---
title: "Drive VirtualDJ decks over OSC"
slug: drive-virtualdj-decks-over-osc
category: "Audio"
tools: ["VirtualDJ", "OSC"]
difficulty: Intermediate
source_url: https://virtualdj.com/manuals/virtualdj/appendix/optionslist.html
labels: ["Commercial product"]
summary: "VirtualDJ Pro listens for OSC when oscPort is not zero. /vdj/deck/1/play runs that script. A subscribe on get_bpm replies with the BPM as a float."
---

## What it does

VirtualDJ's options list documents native OSC on the Pro license. The changelog lists "OSC protocol support" in build 8909, dated 2025-12-01. The option `oscPort` is the UDP port that receives OSC. The same line says to leave it at zero so the OSC server does not start. The options list does not publish a default port other than that zero.

The command form in the options list is `/vdj/{vdjscript}`. The example is `/vdj/deck/1/play`. A VirtualDJ moderator, on the official forum thread about this feature, gives `/vdj/play` and `/vdj/deck/1/hot_cue/1` as further examples, and says spaces in the script are replaced by `/`.

Queries use `/vdj/query/{vdjscript}`. The moderator says the reply is `/vdj/{vdjscript}` with the result as an OSC argument. Subscriptions use `/vdj/subscribe/{vdjscript}`, and `/vdj/unsubscribe/{vdjscript}` stops one. The options list writes that pair as `/vdj/{un}subscribe/{vdjscript}`. Its example is `/vdj/subscribe/deck/1/get_bpm`, which sends `/vdj/deck/1/get_bpm` with a float BPM whenever the value changes.

`oscPortBack`, when set, is the port those query and subscription answers use. The moderator says that if you do not set a return port, replies go to the port of the UDP connection that sent the message. A query or subscription that could come back as a bool, text, or float can be forced with `/vdj/query/(bool)/` or `/vdj/query/(text)/` plus the script. The same reply says to use OS2L instead of OSC for complex commands.

## How to set it up

1. Confirm the build is 8909 or later, and that the license is VirtualDJ Pro. In Options, search for `oscPort`. Set it to the UDP port you will send to. Leave it at zero only when you want the server off.
2. From the show machine, send `/vdj/deck/1/play` to that port. The options list uses that address as the example of a script VirtualDJ will run.
3. For a hot cue, send `/vdj/deck/1/hot_cue/1`. If the script text contains spaces, replace each space with `/` before you put it after `/vdj/`.
4. To watch the tempo, set `oscPortBack` to the port your client is listening on, then send `/vdj/subscribe/deck/1/get_bpm`. The options list says the reply address is `/vdj/deck/1/get_bpm` and the argument is a float. Send `/vdj/unsubscribe/deck/1/get_bpm` when you want those replies to stop.
5. Read a one-shot value with `/vdj/query/` plus the script. If the type is ambiguous, use `/vdj/query/(text)/` or `/vdj/query/(bool)/` as the moderator describes. Keep OS2L for the lighting link the options list documents separately under `os2l`.

Source: [VirtualDJ options list](https://virtualdj.com/manuals/virtualdj/appendix/optionslist.html) (`oscPort`, `oscPortBack`), the [changelog entry for build 8909](https://virtualdj.com/products/virtualdj/changelog.html), and the moderator's command list on the [OSC support thread](https://virtualdj.com/forums/266538/VirtualDJ_Technical_Support/VDJ_and_new_OSC_support.html).

## FAQ

### Why does nothing arrive when the port looks right?
`oscPort` at zero means the OSC server is not started. The options list also says this feature requires a VDJ Pro license. Builds before 8909 do not list OSC protocol support.

### Where do query replies go?
With `oscPortBack` set, query and subscription answers go to that port. The moderator says that without it, replies go back to the UDP port the command came from.

### Can one message carry a script that has spaces?
The moderator says spaces in the script are replaced by `/`. `/vdj/deck/1/play` is already in that form. The same note recommends OS2L rather than OSC for complex commands.
