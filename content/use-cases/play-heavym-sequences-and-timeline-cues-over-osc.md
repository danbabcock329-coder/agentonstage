---
title: "Play HeavyM sequences and timeline cues over OSC"
slug: play-heavym-sequences-and-timeline-cues-over-osc
category: "LED/Video"
tools: ["HeavyM", "OSC"]
difficulty: Intermediate
source_url: https://help.heavym.net/hc/en-us/articles/11763711559058-OSC-API-Pro
labels: ["Commercial product"]
summary: "HeavyM Pro publishes OSC for master opacity, sequence play, and timeline cues. Turn OSC Control on and send those addresses to the incoming port you chose."
---

## What it does

HeavyM Pro ships a default OSC address for each assignable control, so a show file can be driven without a learning pass. The OSC API article says the same control often has two addresses: one by name and one by position. Arguments are floats unless a table says otherwise, and the value you send is also what HeavyM sends back as feedback. Coordinates and dimensions are the exception: feedback is off there, because the article says it can loop.

Names inside an address drop their spaces, and the article's examples are lowercase. A sequence named "Seq 1-2" is `seq1-2`. A cue named "Play Seq 1-2" is `playseq1-2`. A shader named "Chroma Zoom" is `chromazoom`. Indexes for shader and group lists start at 1 from the bottom of the list.

Master opacity is `/master/opacity/value`, from 0.0 (0%) to 1.0 (100%). Sequence play is `/sequences/seq1-2/play` or `/sequences/tabs/2/rows/2/columns/2/play`, with 1 to play and 0 to stop. The article's example puts "Seq 1-2" on tab 2, row 2, column 2. `/sequences/playnext` and `/sequences/playprevious` take 1. `/sequences/blackout` takes 1.

Timeline transport is `/timeline/play` with 1 to play and 0 to pause, and `/timeline/stop` with 1. `/timeline/playhead/position` runs from 0.0 at the start to 1.0 at the end. Jumping to a cue is `/timeline/cues/playseq1-2/goto` or `/timeline/cues/2/goto` with 1. `/timeline/next` and `/timeline/previous` take 1. A cue's place on the timeline is `/timeline/cues/playseq1-2/timestamp`, again 0.0 to 1.0.

OSC itself is turned on in Controls, Controls Settings, on the OSC tab. The companion article for a phone or tablet says the OSC Control toggle has to be on, the incoming port has to match the sender's send port, and the outgoing port and output IP are where HeavyM sends feedback. That article tells you to pick send and receive ports between 7000 and 10000, and to use a different number for each. It does not publish one fixed port.

## How to set it up

1. Use a HeavyM Pro license. The OSC API article is marked as a Pro feature. Open Controls, then Controls Settings, then the OSC tab, and switch OSC Control on.
2. Set the incoming port to the port your sender will use. If you also want feedback, set the outgoing port to a different number in the 7000–10000 range the TouchOSC article uses, and set the output IP to the machine that is listening.
3. Send `/master/opacity/value` with a float from 0.0 to 1.0 and confirm the master opacity moves before you play anything.
4. Play a sequence by the address built from its name: `/sequences/seq1-2/play` with 1, then 0 to stop. Or use the grid address `/sequences/tabs/2/rows/2/columns/2/play` when you know the tab, row, and column. Blackout is `/sequences/blackout` with 1.
5. For a timeline show, pause with `/timeline/play` and 0, stop with `/timeline/stop` and 1, and jump with `/timeline/cues/playseq1-2/goto` and 1. Rebuild the name if you rename the cue: spaces come out, and the article's examples are lowercase.

Source: [HeavyM OSC API](https://help.heavym.net/hc/en-us/articles/11763711559058-OSC-API-Pro) and [Controlling HeavyM over OSC](https://help.heavym.net/hc/en-us/articles/4402781178642-Controlling-HeavyM-with-a-mobile-or-tablet-via-OSC-Pro).

## FAQ

### Is the sequence address the name I typed?
Not always. The article says a sequence named "Act 1-2" becomes `act1-2`, and "Seq 1-2" becomes `seq1-2`. Spaces are removed. The position form (`/sequences/tabs/2/rows/2/columns/2/play`) does not depend on that name.

### Will HeavyM answer on the same port?
The setup article uses two ports. Incoming is the port HeavyM listens on. Outgoing is the port it sends feedback to, and the output IP is the other machine. The API article says the float you send is what comes back, except for coordinates and dimensions.

### Does play on the timeline also stop it?
`/timeline/play` uses 1 for play and 0 for pause. Stop is a different address, `/timeline/stop`, with 1.
