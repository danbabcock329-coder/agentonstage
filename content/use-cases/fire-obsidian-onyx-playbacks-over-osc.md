---
title: "Fire Obsidian ONYX playbacks over OSC"
slug: fire-obsidian-onyx-playbacks-over-osc
category: "Lighting"
tools: ["Obsidian ONYX", "OSC"]
difficulty: Intermediate
source_url: https://support.obsidiancontrol.com/Content/Onyx_Manual/Networking/OSC.htm
summary: "ONYX OSC Mapping V1.20 fires a playback-page cue with /Mx/playback/page1/0/go and the value 1. The grand master is /Mx/fader/2202, from 0 to 255."
---

## What it does

Obsidian's ONYX manual documents OSC as remote control of playbacks, playback buttons, F-keys, and command keys. The command list is OSC Mapping V1.20, revision 5. Setup is on the console: Main Menu, Network, Settings, Interfaces. IP settings stay on AUTOMATIC, and OSC is enabled on the REMOTE adapter. On the OSC page, OSC is enabled on the Remote interface, the first OSC device is activated, and that device gets a name, the sender's IP address, and an incoming port that matches the sender. The manual does not publish a fixed port.

In FREE and NOVA, the manual says OSC is locked. The license page says MIDI, timecode, and OSC are disabled there until an Essential or greater license, and that a trial can unlock them for 5 minutes. After those 5 minutes, ONYX has to be restarted to start the trial again. The mapping PDF says playback execute messages require a license, and playback-page execute messages require a license.

Playback pages are the cuelist addresses. The form is `/Mx/playback/page<page>/<button>/<action>`. Page index runs from 1 to 100 and is one-based. Button index runs from 0 to 99 and is zero-based. The PDF's example `/Mx/playback/page1/0/go 1` is a key down, go, on page 1, button 1. `/Mx/playback/page5/9/release 1` is a key down, release, on page 5, button 10. Actions are not case sensitive. The table's strings are GO or PLAY, PAUSE, RELEASE, SELECT, SNAPGO, TOGGLE, and BACK. The PDF says no update messages exist for playback pages.

The main playback bank is a separate set of button and fader ids. Playback 1's level is `/Mx/fader/4203`, a float from 0 to 255. Playback 1's buttons are `/Mx/button/4201` (PFA), `/Mx/button/4202` (PFB), `/Mx/button/4204` (PFC), and `/Mx/button/4205` (PFD), each up/down with 0 or 1. The console GO key is `/Mx/button/5513`, also 0 or 1. The grand master level is `/Mx/fader/2202`, a float from 0 to 255. The mapping continues through playback 20, whose level fader is `/Mx/fader/4693`. Playback 10's level is `/Mx/fader/4293`, and playback 11's is `/Mx/fader/4603`.

Update addresses are listed apart from execute addresses. `/Mx/button/4201/led` is an int, 0 or 1. `/Mx/button/4201/led/color` is blue or red. `/Mx/button/4204/text` is the PFC name string.

## How to set it up

1. On the console, open Main Menu, Network, Settings, Interfaces. Leave IP on AUTOMATIC, enable OSC on the REMOTE adapter, and apply.
2. Open the OSC page, enable OSC on the Remote interface, and activate an OSC device. Enter the sender's IP and the incoming port the sender will use. Apply.
3. In FREE or NOVA, start the OSC trial from the license indicator or from the OSC page before sending playback commands. The license page says the trial lasts 5 minutes.
4. Go on the first button of playback page 1 with `/Mx/playback/page1/0/go` and the value 1. Release page 5, button 10, with `/Mx/playback/page5/9/release` and the value 1.
5. Set the grand master with `/Mx/fader/2202` and a float from 0 to 255. Set playback 1's level with `/Mx/fader/4203` in the same range. Read `/Mx/button/4201/led` when you need that button's LED state back.

Source: [ONYX OSC](https://support.obsidiancontrol.com/Content/Onyx_Manual/Networking/OSC.htm), [OSC Mapping V1.20 revision 5](https://files.obsidiancontrol.com/s/yndNn7FsaB9Fyay), and the [OSC playback trial](https://support.obsidiancontrol.com/Console_Manual/License_Information/OSC_MIDI_Timecode_Trial.htm).

## FAQ

### Is button 0 the first button on a page?
The mapping says the button index is 0 through 99 and zero-based. Its example `/Mx/playback/page1/0/go 1` is button 1 of page 1, and `/Mx/playback/page5/9/release 1` is button 10 of page 5. Page numbers start at 1.

### Will FREE mode answer these messages?
The manual says OSC is locked in FREE and NOVA. The license page says an Essential or greater license enables it, and a trial unlocks it for 5 minutes. The mapping PDF also says playback execute messages, and playback-page execute messages, require a license.
