---
title: "Trigger a Vezér composition over OSC"
slug: trigger-a-vezer-composition-over-osc
category: "Show Control"
tools: ["Vezér", "OSC"]
difficulty: Intermediate
source_url: https://imimot.com/help/vezer/controlling-vezer/osc
labels: ["Commercial product"]
summary: "Vezér runs /vezer/triggercompwithname with a string. A playhead float of 0.5 jumps to the middle. Cue OSC indexes start at 1."
---

## What it does

Vezér's OSC help says most items can be controlled with OSC. Turn on Show OSC Namespaces in the Project menu and the controllable items turn yellow. Select one and the Info Field at the bottom of the window shows that item's namespace and the values that go with it. The same page, the cue page, and the feedback page do not print the UDP port those messages use.

`/current/` stands in for the composition selected in the Compositions List. `/vezer/current/playhead` moves that composition's playhead. A named composition uses its own address, such as `/vezer/composition1/playhead`.

Transport messages that are not tied to one on-screen control:

- `/vezer/triggercompwithname` takes a string and triggers that composition.
- `/vezer/selectcompwithname` takes a string and selects one.
- `/vezer/triggercompatindex` and `/vezer/selectcompatindex` take an int. Indexes start at 1.
- `/vezer/triggernextcomp`, `/vezer/triggerprevcomp`, and `/vezer/stopcomps` take no parameter. `stopcomps` stops every composition.

Playhead messages on a composition address: `playhead` is a float from 0.0 to 1.0, and 0.5 is the middle. `jumptoframe` is an int. The help's example sends 30 and says that is frame 30, the first second of a 30 fps composition. `nextframe` and `prevframe` step one frame for any value.

Cue addresses are on the jumping-to-a-cue page. `/vezer/composition1/playcueatindex` with int 12 jumps to that cue and starts playback. `/vezer/composition1/jumptocueatindex` jumps without the play. Both indexes count from 1. `playcuewithname` and `jumptocuewithname` take the cue name as a string. `resetcuestates` clears loop counts and the processed state of every cue in that composition.

OSC Feedback, enabled at the bottom right of the OSC preferences with one of Vezér's OSC outputs selected, sends state out. `/vezer/composition1/playhead` goes out as a float from 0.0 to 1.0. `/vezer/composition1/pausedbycue` is a string, the cue name, when playback stops on a cue. `/vezer/current/name` is sent when the selected composition changes. Queries: `/vezer/countofcomps` replies on `/vezer/compcount` with an int. `/vezer/currentcompinfo` replies on `/vezer/compinfo/name` and `/vezer/compinfo/duration`. Duration is an int, the length in seconds.

## How to set it up

1. In the Project menu, turn on Show OSC Namespaces. Select the control you care about and read the namespace from the Info Field. These help pages do not print a port.
2. Send `/vezer/triggercompwithname` with the composition name as a string. `/vezer/triggercompatindex` with an int does the same by index, starting at 1. `/vezer/stopcomps` stops every composition and takes no argument.
3. Send `/vezer/composition1/playhead` with float 0.5 to jump to the middle of that composition. `/vezer/current/playhead` does it for whichever composition is selected. `/vezer/composition1/jumptoframe` with int 30 is the help's example of frame 30.
4. Send `/vezer/composition1/playcueatindex` with an int to jump to that cue and start playback. Use `playcuewithname` when you have the cue's name. Indexes on this page start at 1.
5. Turn on OSC Feedback, pick an OSC output, and send `/vezer/countofcomps`. Read `/vezer/compcount`. Send `/vezer/currentcompinfo` and read `/vezer/compinfo/name` and `/vezer/compinfo/duration` before you treat a trigger as landed.

Source: [Vezér OSC](https://imimot.com/help/vezer/controlling-vezer/osc), [jumping to a cue](https://imimot.com/help/vezer/cues/jumping-to-a-specific-cue), and [OSC feedback and query](https://imimot.com/help/vezer/controlling-vezer/osc-feedback-and-query).

## FAQ

### Do these pages name the UDP port?
No. They name addresses, argument types, and the Project menu toggle that shows namespaces. They do not name a port.

### What does `/current/` point at?
The composition selected in the Compositions List. `/vezer/current/playhead` moves that one. A composition that is not selected needs its own name in the address.

### Will `/vezer/loadproject` ask before it closes the open show?
No. The OSC page says Vezér 1.4.2 added `/vezer/loadproject` with a string path, and that it forces the load: the current project closes even if there are unsaved changes. A path may start with `~` for the current user's home folder.
