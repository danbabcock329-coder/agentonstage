---
title: "Run Spikemark cues over OSC"
slug: run-spikemark-cues-over-osc
category: "Show Control"
tools: ["Spikemark", "OSC"]
difficulty: Intermediate
source_url: https://docs.creativeconners.com/docs/spikemark/show-control/osc/osc-input-tirgger/cue-commands
labels: ["Commercial product"]
summary: "Spikemark listens for OSC on the port set under Show Control. /cue/{n}/go runs that cue. /cue/stop soft-stops every stagehand. Prefer hold-to-run."
---

## What it does

Creative Conners documents OSC Input triggers as the way other software controls Spikemark. The configuration window is Show Control, then OSC Input Trigger. Listen Port is the UDP port Spikemark listens on. Respond Port is where it sends response and data messages. Send Status Messages turns those responses on or off. Enable starts listening, and Disable stops it. The page does not publish a default port number.

The same page's danger note says it can be dangerous to trigger motion automatically, because the other computer will not know if a person is in the way, and that they strongly encourage hold-to-run. The cue-command page does not print a hold-to-run address.

`/cue/stop` soft-stops all the stagehands in the show. `/cue/{cue_number}/go` attempts to load and execute that cue. `/cue/{cue_number}/ramptime` sets the cue ramp time when a number is present, and sends a data message back with the current ramp time when the number is absent. `/cue/{cue_number}/totaltime` works the same way for the cue's total time.

A single movement is `/cue/{cue_number}/movement/{motor_name}/position`. With a number, Spikemark tries to set that motor's position in the cue. Without a number, it sends the current position back. The page warns that updating the position this way removes the existing spike, and points at the cue spike command or the motor spike command when the change should stay on a named spike. `/cue/{cue_number}/movement/{motor_name}/position/scaled` takes a position integer and a scale float, and sets the position to the product. The same warning applies. Speed, acceleration, ramp time, and total time are the same pattern under `speed`, `acceleration`, `ramptime`, and `totaltime`.

The spike-position line on that page is printed as `/cue/{cue_number/movement/{motor_name}/spike/position`, with the brace after the cue number left open. The movement commands above it are printed as `/cue/{cue_number}/movement/{motor_name}/...`. The warning under the spike commands says a spike position, factor, or offset change affects every cue that uses that spike.

## How to set it up

1. Open Show Control, OSC Input Trigger, and read the Listen Port and Respond Port that are actually filled in. Enable listening only for the session that should receive commands.
2. Turn Send Status Messages on if you need the data messages. A ramptime or totaltime address with no number is the page's read. Send that before you trust a cue number.
3. Do not send `/cue/{cue_number}/go` from an unattended agent. The input-trigger page says the other computer cannot see whether a person is in the way, and it tells you to prefer hold-to-run. This command page does not document that address.
4. `/cue/stop` is the documented soft stop for every stagehand in the show. Keep it available to the operator who can see the scenery.
5. Leave spike writes alone unless you mean to change every cue that uses the spike. A position write that is not a spike command removes the existing spike, which is the warning printed on the command page.

Source: [Spikemark cue commands](https://docs.creativeconners.com/docs/spikemark/show-control/osc/osc-input-tirgger/cue-commands) and [OSC Input Trigger](https://docs.creativeconners.com/docs/spikemark/show-control/osc/osc-input-tirgger).

## FAQ

### Is there a fixed OSC port?
The input-trigger page lists Listen Port and Respond Port as configuration fields. It does not give a factory port. Use the numbers in that window.

### What does a ramptime message without a number do?
The cue-command page says that if the number is absent, Spikemark sends a data message back with the cue's current ramp time. The same sentence is used for total time. With a number, it tries to set the time.

### Does /cue/12/go only load the cue?
The page says `/cue/{cue_number}/go` attempts to load and execute the cue. `/cue/stop` is the separate command that soft-stops all stagehands in the show.
