---
title: "Play a 7thSense Delta timeline over external control"
slug: play-a-7thsense-delta-timeline-over-external-control
category: "LED/Video"
tools: ["7thSense Delta", "TCP", "OSC"]
difficulty: Intermediate
source_url: https://portal.7thsense.one/user-guides/resources/ExternalControlHelp.html
labels: ["Commercial product"]
summary: "DeltaServer takes English commands over TCP or UDP. PLAY starts the show, CUE waits, and GOTOMARKER jumps. OSC /transport/play maps to PLAY."
---

## What it does

7thSense DeltaServer accepts an English command set for timeline control. The external-control help page says commands are not case sensitive, and that each command is activated by a carriage return (hex 0D). A backslash in a path has to be doubled. Optional arguments sit in square brackets. A command the server recognizes returns `OK`. An unrecognized command returns `BAD`. Both come back with a carriage-return / line-feed pair. On connect, the telnet interface sends a welcome line, the server name, and `READY`.

`PLAY` plays the show, and the user-guide appendix says that start is instant if a cue was already done. `CUE` cues the show and waits for play. `STOP` stops it. `REWIND` returns to frame 0. `GOTOFRAME` takes a frame number and an optional `play`. `GOTOMARKER` takes a marker name in quotes when the name has a space, plus an optional `play`. `GOTOTIME` takes a timecode and a framerate, then an optional `play`. The guide's example `gototime 0:1:0:15 30.00` goes to 1 hour and 15 frames when the rate in the command is 30 fps. `STATUS` returns the server name, the loaded file, a mode of Stopped, Preparing to Play, or Playing, plus `CURRENTFRAME`, `FRAMERATE`, and the audio and video levels.

A timeline is selected with `TL=`. The help page says `TL=` takes a timeline number or `R` for the reserve timeline. The user-guide appendix says that number runs from 1 to 32, that a unique name set in View, Timeline Names, can be used as `TL=myname`, and that `TL=ALL` hits every timeline. Names have to be unique. Commands marked with `!` in the help page are non-realtime: they can interrupt playback, or they stop playback as part of the command. `STOP`, `ADVANCE`, `REWIND`, `GOTOMARKER`, and `GOTOFRAME` are in that set. The appendix says some of these commands only work on a Leader server, because Follower servers receive them from the Leader.

The listen ports are set in DeltaGUI under Configure, Preferences, Communication, on the Ports controls for DeltaGUI, TCP (Telnet), and UDP external control. The 2.8 user guide says most people leave those at the defaults unless something else on the network conflicts. It does not print the default number. SSH, if you enable it, is fixed to port 22.

OSC receive was added in Delta 2.8. Enable OSC Rx in that same communication section. The guide says there is no acknowledgement on OSC, and that the OSC port can stay at the default or move to any free port. The OSC dictionary maps `/transport/play` to `PLAY`, `/transport/cue` to `CUE`, `/transport/stop` to `STOP`, `/transport/rewind` to `REWIND`, `/transport/gotoframe` with an int to `GOTOFRAME`, and `/transport/gotomarker` with a string to `GOTOMARKER`.

## How to set it up

1. In DeltaGUI, open Configure, Preferences, Communication. Note the TCP (Telnet) and UDP external-control ports. Leave them at the defaults unless you have a conflict. Enable OSC Rx and note the OSC port if you will send OSC instead of text.
2. Open a TCP connection to the server IP on the Telnet port and wait for `READY`. Send `STATUS` and a carriage return. Read `MODE`, `FILE`, and `CURRENTFRAME` before you change anything.
3. Cue, then play, on timeline 1: `CUE TL=1` then `PLAY TL=1`, each ended with CR. On a named timeline the same commands take `TL=myname`. The appendix says `PLAY` and the other leader-side transport commands belong on the Leader.
4. Jump with `GOTOMARKER "Act 2" play` or `GOTOFRAME 1200 play`, still with `TL=` when the show has more than one timeline. These are marked non-realtime. The guide says a seamless-loop show does not take them instantly, because the server has to set up the jump.
5. If you send OSC, use `/transport/cue`, then `/transport/play`, on the OSC port. The dictionary has no acknowledgement, so send `STATUS` on the TCP connection when you need `MODE` and `CURRENTFRAME` back.

Source: [Delta external control](https://portal.7thsense.one/user-guides/resources/ExternalControlHelp.html), the [OSC dictionary](https://portal.7thsense.one/user-guides/resources/DeltaOSCCommands.html), and the [Delta 2.8 user guide](https://portal.7thsense.one/user-guides/pdf-library/Delta%20software%20guides/M723-5%20Delta%202.8%20User%20Guide.pdf) (appendix A and the communication preferences).

## FAQ

### Does PLAY always start from the top?
The appendix says `PLAY` plays the show, and that the start is instant if a cue was already done. `CUE` loads and waits. `REWIND` goes to frame 0. `GOTOMARKER` and `GOTOFRAME` move first, and they take an optional `play`.

### Can a Follower be cued on its own?
The appendix says some commands only work on the Leader, because Followers receive them from the Leader. Send `PLAY`, `CUE`, and `STOP` to the Leader. `STATUS` on connect tells you whether that machine is Leader or Follower.

### Will OSC tell me the frame?
The 2.8 guide says OSC receive has no acknowledgement. `/transport/play` maps to `PLAY` and nothing comes back on that socket. Use the TCP connection and `STATUS` for `CURRENTFRAME` and `MODE`.
