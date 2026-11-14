---
title: "Run an LXConsole cue over OSC"
slug: run-an-lxconsole-cue-over-osc
category: "Lighting"
tools: ["LXConsole", "OSC"]
difficulty: Intermediate
source_url: https://www.claudeheintzdesign.com/lx/lxconsole_help/en.lproj/pgs/setup_osc.html
summary: "With OSC In checked, /cue/1/start runs cue 1 once that message type is enabled. /cmd.lxconsole/1@50 types 1@50. Pause and stop ignore the cue number."
---

## What it does

LXConsole listens for OSC over UDP when File → External → OSC In is checked. The menus page says that input is the OSC source set in the OSC tab of Preferences. The setup, menus, and preferences pages do not print the port number of that socket. The preferences page's `127.0.0.1:9000` example is an address you type for OSC Out, not the input port.

Two address prefixes work without a row in the Setup window's OSC action list. A message whose address begins with `/cmd.lxconsole/` runs the rest of the address as a command-line command. The setup page's example is `/cmd.lxconsole/1@50`, which it says is the same as typing `1@50`. `/key.lxconsole/` followed by one key sends that keystroke. The page spells `enter` and `clear` out as words. Its four-message version of the same channel command is `/key.lxconsole/1`, `/key.lxconsole/@`, `/key.lxconsole/5`, and `/key.lxconsole/0`.

`/cue/` messages are separate. The setup page says they must be enabled in Preferences and then need no other setup. `/cue/1/start` triggers cue 1. The preferences page says `/cue/n/pause` and `/cue/n/stop` ignore the cue number and pause or stop the cue that is running. The same setup table lists `/cue/n/what` and `/cue/n/when` as strings, and `/cue/n/uptime`, `/cue/n/downtime`, and `/cue/n/follow` as seconds. Under those rows it lists `/panic`, `/go`, `/stop`, `/pause`, `/togglePause`, and `/quickmode` (`1` enables, `0` disables). The table does not describe what `/go` or `/panic` do beyond listing them.

Mapped actions in Setup → OSC are a third path. A command of `GO` runs the next cue in the Live window. `GO:%f` runs the cue number in the next float argument. `BACK`, `HOLD`, and `STOP` map the other Live buttons. `SUB-1` sets submaster 1 to the next float, read as a percentage. The page says that form updates faster than the command-line equivalent `sub: 1@%v`.

If Echo command line and cue fade info is on, a cue start and a cue finish send a message to `/2/running_cue`, and a change of the Live window's next-cue field sends `/2/next_cue`.

## How to set it up

1. Check File → External → OSC In. Point the client at the OSC source in the OSC tab of Preferences. Do not use `127.0.0.1:9000` as the input port. That string is the preferences page's example of an OSC Out destination.
2. Enable `/cue/` messages in Preferences. The setup page says they need no action row after that.
3. Send `/cue/1/start` to run cue 1. Send `/cue/1/pause` or `/cue/1/stop` to pause or stop whatever cue is running. The number in those two addresses is ignored.
4. Send `/cmd.lxconsole/1@50` to put channel 1 at 50 without creating a Setup action. If you are sending keystrokes instead, end the sequence with `/key.lxconsole/enter`.
5. Turn on Echo command line and cue fade info if you want `/2/running_cue` when a cue starts and when it finishes. Read that message before you send another go.

Source: [Setup → OSC](https://www.claudeheintzdesign.com/lx/lxconsole_help/en.lproj/pgs/setup_osc.html), [External Connections preferences](https://www.claudeheintzdesign.com/lx/lxconsole_help/en.lproj/pgs/preferences_live.html), and [File → External](https://www.claudeheintzdesign.com/lx/lxconsole_help/en.lproj/pgs/menus.html).

## FAQ

### Which port do these pages tell me to send to?
They do not print the OSC In port. They say OSC In uses the source set in Preferences. `127.0.0.1:9000` is an OSC Out example on the preferences page.

### Does `/cue/2/stop` stop cue 2?
The preferences page says pause and stop ignore the cue number and act on the cue that is currently running. `/cue/n/start` is the address that carries a cue number, and the setup page's example is `/cue/1/start`.

### Do I have to build an action before `/cmd.lxconsole/` works?
No. The setup page says an address that begins with `/cmd.lxconsole/` runs on the command line with no Setup action. `/cue/` messages still have to be enabled in Preferences.
