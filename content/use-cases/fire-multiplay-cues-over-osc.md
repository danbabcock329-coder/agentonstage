---
title: "Fire MultiPlay cues over OSC"
slug: fire-multiplay-cues-over-osc
category: "Show Control"
tools: ["MultiPlay", "OSC"]
difficulty: Intermediate
source_url: https://da-share.com/help/multiplay3/OSC-Control-Cue-Actions.html
summary: "MultiPlay 3 listens for OSC from Preferences > OSC Control. /cue/playhead/go runs the cue at the GO position, and /cue/100/go runs the cue whose Q# is 100."
---

## What it does

da-share's MultiPlay 3 help says an external device can drive the program with OSC, and that MultiPlay can send status back to that device. Ports and the remote IP are set under Preferences > OSC Control. The stopwatch page in the same help is labeled MultiPlay Version 3.0.237.0.

Cue commands are built from the Q# text. The cue-actions page says that text cannot contain spaces, so a Q# you intend to address has to be written that way in the cue list. `/cue/{cue}/{action}` hits one cue. `/cue/playhead/{action}` and `/cue/current/{action}` hit the cue sitting at the GO position. `/cue/active/{action}` hits cues that are playing or paused. An argument, when the action has one, is separate from the address.

Go, which the page also calls Start, takes no argument. Its targets are the current cue or one specific cue. The page does not list the all-active form for Go. Stop takes no argument and can target the current cue, one cue, or every active cue. Fade takes no argument. On one cue it uses that cue's fade time. Sent to all active cues, it runs the Fade All Out shortcut, and the time then comes from Preferences > Cues > Fade All Out.

CuePoint jumps playback to a cue point. The argument is First, Prev, Next, Last, or a cue-point number. A number that is not on the cue is ignored. JumpBack, JumpFwd, and JumpEnd take an optional time in seconds, as an integer or a float. Leave it off, or send zero, and MultiPlay uses the matching preference: Jump Back Time, Jump Fwd Time, or Jump End Time. Those three can target the current cue, one cue, or all active cues.

Volume, pan, and speed change the playing cue and do not rewrite its stored properties. Volume is an integer dB value from the configured floor, which the page writes as -60 or whatever the lowest level is set to, up to 0. VolumeS is a float from 0 to 1. Pan is an integer from -100 to 100. PanS is a float from -1 to 1. The same page documents relative pan and volume, a revert back to the value stored on the cue, speed as an integer from 50 to 150, and a Track action for a playlist cue. Track's argument is First, Prev, Next, Last, or the index of the track in the list.

The cue-list page moves the GO position in the focused list with `/select/{cue}`, again with no spaces in the Q#. The stopwatch page is two addresses, written there as `/Stopwatch/Start` and `/Stopwatch/Stop`.

## How to set it up

1. In MultiPlay, open Preferences > OSC Control and set the listen port and the remote IP the help page asks for. The current help does not publish a default port.
2. Remove spaces from any Q# you will put in an address. Cue 100 is `/cue/100/go`. The cue waiting at the GO position is `/cue/playhead/go` or `/cue/current/go`.
3. Stop everything that is playing or paused with `/cue/active/stop`. Fade that same set with `/cue/active/fade`, which follows the Fade All Out preference rather than each cue's own fade.
4. Move the selection with `/select/` and the Q#. Start or stop the stopwatch with `/Stopwatch/Start` and `/Stopwatch/Stop`.
5. Treat a level change as live only. `/cue/100/volume` with an integer dB argument does not edit the cue. The page's revert actions put the stored value back.

Source: [MultiPlay 3 cue actions](https://da-share.com/help/multiplay3/OSC-Control-Cue-Actions.html), [OSC setup](https://da-share.com/help/multiplay3/OSC-Control.html), [cue-list navigation](https://da-share.com/help/multiplay3/OSC-Control-Cue-List-Nav.html), and [stopwatch](https://da-share.com/help/multiplay3/OSC-Control-Stopwatch.html).

## FAQ

### Can /cue/active/go fire every cue?
The cue-actions page limits Go and Start to the current cue or one Q#. All-active is documented for Stop, Fade, and the jump commands, not for Go.

### Why did the cue number do nothing?
The page says the Q# portion of the address cannot contain spaces. A CuePoint number that is not on that cue is ignored.

### Does a volume message rewrite the cue?
No. The volume, pan, and speed sections say the change applies to the playing cue and leaves the cue properties alone. Use the revert action on that page to restore the stored value.
