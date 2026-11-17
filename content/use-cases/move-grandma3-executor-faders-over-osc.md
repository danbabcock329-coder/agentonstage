---
title: "Move grandMA3 executor faders over OSC"
slug: move-grandma3-executor-faders-over-osc
category: "Lighting"
tools: ["grandMA3", "OSC"]
difficulty: Intermediate
source_url: https://help.malighting.com/grandMA3/2.5/HTML/remote_inputs_osc.html
labels: ["Commercial product"]
summary: "grandMA3 2.5 OSC defaults to port 8000, on UDP or TCP. /Page1/Fader201 with an integer sets executor 201. /cmd with a string runs a command."
---

## What it does

The grandMA3 2.5 help describes OSC as a peer-to-peer message protocol. The software supports the data types added in OSC 1.1. A message is written as `(/prefix)/[OSC Address],[OSC Type],[Value]`. The prefix is optional. It must not contain a slash. When a prefix is set, only messages that begin with it are processed, and the same prefix is added to outgoing messages. The help says OSC bundles are not supported for receive or send. Only OSC messages are.

The address example for a fader is `/Fader201`, which moves the fader for executor 201. `/Page1/Fader201` is executor 201 on page 1. The worked example is `/Page1/Fader201,i,100`, which sets that fader to 100. With a prefix the same command is `/gma3/Page1/Fader201,i,100`. Types named on the page are `i` integer, `f` float, `s` string, `T` true, and `F` false.

The OSC menu is Menu, In & Out, OSC. Enable Input must be on to receive. Enable Output must be on to transmit. The title bar of the matching button highlights yellow while that direction is in use. Each configuration line has a name, a destination IP, a mode of UDP or TCP, and one port used for the packets on that line. The 2.5 protocol-details page lists OSC as TCP or UDP on port 8000, and says the transport, address, and port can be changed in the OSC menu. The OSC page says a different send port and receive port means a second configuration line.

Receive and Receive Command are separate. Receive is OSC data and not commands. Receive Command is the command line, and it does not follow the general receive setting. Send and Send Command are split the same way. FaderRange sets the incoming scale. The page's example is FaderRange 255, which maps OSC 0 to 255 onto 100%.

The command-line address is `/cmd` with type `s`. The help's examples, sent with `SendOSC 1`, are `FaderMaster Page 1.201 At 50`, the same command with `Fade 5`, `Fixture 1 At 75`, `Go+ Exec 402`, and `Patch Fixture 1 3.42`. Pool objects such as sequences can also be addressed by their enumerated path. The sequence example is `/13.13.1.6.1,si,Flash,1`, which presses the Flash key function. The page says those directory addresses may change between software versions.

## How to set it up

1. Put the console and the sender on the same network and enable the interface on both. Open Menu, In & Out, OSC. Turn Enable Input on. Set Mode to UDP or TCP. Leave Port at 8000 unless you have changed it. The protocol-details page lists 8000, and says that port can be changed in this menu.
2. Two-finger tap the first row under Receive and set it to Yes. Leave Prefix empty unless you want to ignore messages that do not start with that prefix. The receive example on the help page uses no prefix.
3. Send `/Page1/Fader201` as an integer `100` to put executor 201 on page 1 at 100. If this line's FaderRange is 255, the same full position is the integer 255, because that setting maps 0 to 255 onto 100%.
4. For a command, set Receive Command to Yes on that line. Send `/cmd` as a string. `Go+ Exec 402` is the help's example for triggering executor 402. `Fixture 1 At 75` is the example that sets fixture 1 to 75.
5. Turn Echo Input on and open Add Window, More, System Monitor to see the received argument. Before you store an enumerated path such as `/13.13.1.6.1`, read it on that software version. The help's command is `Lua "Printf( ObjectList( 'Master 1' )[ 1 ]:Addr() )"`, with `Master 1` replaced by the object you want.

Source: [grandMA3 OSC](https://help.malighting.com/grandMA3/2.5/HTML/remote_inputs_osc.html) and [protocol details](https://help.malighting.com/grandMA3/2.5/HTML/network_design_protocols.html).

## FAQ

### Are OSC bundles accepted?
The restriction on the OSC page says only OSC messages are supported when receiving or sending a packet. OSC bundle messages are not supported.

### Can one configuration line use two ports?
The page says the port on a line is used for both sending and receiving. A separate send port and receive port means another configuration line.

### Is this the grandMA3 MCP plugin?
No. [Control a grandMA3 console with an AI assistant](/use-cases/control-a-grandma3-console-with-an-ai-assistant) is a separate plugin and MCP server. This page is the OSC menu and addresses in the 2.5 help.
