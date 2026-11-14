---
title: "Run a LightFactory cue over Telnet"
slug: run-a-lightfactory-cue-over-telnet
category: "Lighting"
tools: ["LightFactory", "Telnet"]
difficulty: Intermediate
source_url: https://www.lightfactory.net/download/LightFactory2_User_Guide.pdf
labels: ["Commercial product"]
summary: "LightFactory's Telnet command line binds to port 3100 unless you change it. goto 7 runs cue 7 in the master playback. Go runs the next cue."
---

## What it does

The LightFactory 2 user guide's Network Access tab describes a Telnet command line for remote devices. Enable Telnet Command Line Interface is factory default On. The guide says you then connect through port 3100, or through the port in the Telnet & UDP Port Number box. Echo Telnet Characters is the option to turn on when a client does not show what it types. Enable Discovery by Remote Systems is default On and broadcasts so a remote can find the system without an address.

Remote Commands are Separate User is factory default On. The guide says commands then run as an external user: a channel selection does not show as selected on the local screen, level changes show in green, and a local release does not release channels that user still holds. Those channels are released by the remote, or with Release All Control. Turning the option off makes the remote text act as if it were typed on the console.

Send Cue Execution Messages to Telnet Clients defaults to on. Connected clients then receive a message each time a cue is executed. The guide does not print the text of that message.

Chapter 7 is the command text that session accepts. Reserved words are case insensitive. `Go`, `Stop`, `Back`, and `Reset` match the buttons on the Master Playback and the Cue List windows. `goto` runs a cue out of order. The syntax is `goto [{cue list #}/]{cue number}`. `goto 7` runs cue 7 in the master playback. `goto 2/5` loads cue list 2 into the master playback and runs cue 5. `load` with the same number form only selects the cue that the next `Go` will run.

Channel text uses the same chapter. `1/6` selects channels 1 through 6. `@ 50` sets the previously selected channels' intensity to 50%. `3 solo time 10` sets channel 3 to the on level over 10 seconds and the other channels to 0. `LX Bridge 2 @ 25` sets the channels in the group named LX Bridge 2 to 25%.

UDP receive is a different switch, Enable Receiving UDP Based Commands. The guide says that path is connectionless and sends no acknowledgement.

## How to set it up

1. Open System Properties, Network Access. Leave Enable Telnet Command Line Interface on unless someone has cleared it. Connect to port 3100, or to whatever the Telnet & UDP Port Number box shows.
2. Leave Remote Commands are Separate User on for a show. The guide says a local release will not take those channels back. Turn on Echo Telnet Characters if the session is silent while you type.
3. Send `goto 7` to run cue 7 on the master playback. Send `goto 2/5` to load cue list 2 and run cue 5. Send `Go` for the next cue, and `Stop`, `Back`, or `Reset` for the matching playback button.
4. Set a level with the command-reference text. `1/6` selects. `@ 50` sets those channels to 50%. Group names go on the left of `@`, as in `LX Bridge 2 @ 25`. Do not name a group with a reserved word. The list includes `go`, `cue`, `full`, and `off`.
5. Keep Send Cue Execution Messages to Telnet Clients at its default if you want a message on each cue. The guide does not document that message's bytes. Prefer Telnet over the UDP switch when you need a session. UDP does not acknowledge.

Source: [LightFactory 2 User Guide (PDF)](https://www.lightfactory.net/download/LightFactory2_User_Guide.pdf), Network Access and Chapter 7.

## FAQ

### Does a local Release clear what Telnet just set?
Not while Remote Commands are Separate User is on. The guide says those channels stay with the remote until the remote releases them or someone uses Release All Control.

### Is port 3100 fixed?
The guide says you connect through port 3100 or a user-specified port. The Telnet & UDP Port Number box is where that port is set. Discovery can remove the need to type the IP. It does not change the port.

### What does `load 7` do compared with `goto 7`?
`goto 7` executes cue 7 in the master playback. `load`, with the same number form, only selects the cue the next `Go` will run.
