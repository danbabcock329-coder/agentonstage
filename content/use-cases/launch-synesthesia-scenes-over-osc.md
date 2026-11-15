---
title: "Launch Synesthesia scenes over OSC"
slug: launch-synesthesia-scenes-over-osc
category: "LED/Video"
tools: ["Synesthesia", "OSC"]
difficulty: Intermediate
source_url: https://synesthesia.live/docs/manual/osc.html
labels: ["Commercial product"]
summary: "Synesthesia Pro listens on the OSC input port you set. /scenes/hexarray launches Hex Array. /playlist/next steps the playlist."
---

## What it does

Synesthesia's OSC page says input and output are a Pro feature, and that the API is still in development and can change. There is no fixed port. In Settings, OSC, turn Input on and set Input Port to any integer up to 65535. The sender has to use that same port.

Scene names in an address are lowercase, with no spaces, underscores, or hyphens. `/scenes/hexarray` launches Hex Array. `/scenes/{sceneName}` can take a preset name as a second argument. That name is case-sensitive and has to match the preset. `/scenes/churning "hectic"` launches Churning with the preset hectic. Leave the preset off and the page says the scene opens on your custom gold preset, the first fav-slot.

Controls use `/controls/{bank}/{name}` plus a value. The bank is `scene`, `meta`, or a scene name. The page says a control name should be lowercase without underscores or hyphens. A value is normalized from 0 to 1 unless you add `/raw`, and a control can take up to three numbers. `/controls/meta/brightness 0.` sets brightness to 0. `/controls/hexarray/separation 1.0` is the page's example of an address that applies only to Hex Array. `/controls/scene/xy1 0.5 0.5` centers the scene control `xy1`. The same page also prints `/controls/meta/high_color 0.0 1.0 1.0` for cyan, underscore and all. Add `/x` or `/y` on an xy control, or `/r`, `/g`, or `/b` on a color. `/default`, `/random`, `/preset`, and `/lock` are the other suffixes. `/lock` takes the lock state as the value.

Global scene controls ignore the scene name. `/controls/global/{type}/{position}` uses `slider`, `knob`, `toggle`, `bang`, `xy`, `color`, or `dropdown`, and the position starts at 1. `/controls/global/slider/1 0.0` sets the first slider. Meta controls do not get a global address. The page's example of a fixed meta address is `/controls/meta/brightness`.

`/controls/banks/scene/default` resets every scene control. The bank is `scene` or `meta`. The action is `default`, `random`, `undo`, or `lock`. Lock takes 0 or 1. `/controls/groups/{bank}/{group}/{action}` is the same idea for one group. The group name follows the lowercase rule. Its actions are `default`, `random`, or `lock`.

`/playlist/next` and `/playlist/previous` step the playlist. `/playlist/position 5` goes to the fifth scene. A negative position counts back from the end, so `/playlist/position -2` is the second to last. `/playlist/play 1` starts playback. `/playlist/toggleplay` flips the play button. `/playlist/select "Demo Scenes"` launches that playlist by name.

`/presets "Good Stuff"` recalls that preset on the current scene. `/presets/media "cool media"` recalls only the media channel. `/presets/new "Better Stuff"` stores the current controls under that name. With no name, the page says the preset is named with the current date and time. `/favslots/1` triggers fav-slot 1.

`/media/name` takes a filename, a full path, or a path to a file on disk. The page says media that is not loaded in Synesthesia will not be stored and recalled in presets. `/media/position 3` selects the third loaded media item. `/render/enabled 0` is the pause button under the preview. The argument is 0 or 1.

Output is a separate switch in the same OSC section. `127.0.0.1` stays on the machine. `255.255.255.255` broadcasts on the local network. Any other target needs that machine's private IPv4. The output port is any integer up to 65535 and has to match the receiver. Output Audio Variables sends the audio-engine analysis. Control values go out on the same addresses that accept input. Normalized output is 0 to 1 and skips motion such as smoothing or speed. Raw output appends `/raw` and sends the scaled shader value.

## How to set it up

1. Confirm a Pro license. In Settings, OSC, turn Input on and pick an input port at or below 65535. Point the sender at that port.
2. Turn on the OSC button beside MIDI in the control panel. Click a highlighted control and copy the address from the tooltip instead of guessing the spelling.
3. Launch with `/scenes/hexarray`, or `/scenes/churning "hectic"` when you need that preset. Step a playlist with `/playlist/next` or `/playlist/position`.
4. Set one control with `/controls/meta/brightness` and a normalized float, or `/controls/global/slider/1`. Add `/raw` when the number is already in the control's own range.
5. Turn on log OSC in the console if a message seems to vanish. The page says a failed bind prints an error there, and that a matching port can still go dead until you change the number. Between machines, it says to try with the firewall off and to use the private IPv4, usually a `192.168` address.

Source: [Synesthesia OSC](https://synesthesia.live/docs/manual/osc.html).

## FAQ

### Does a scene address keep its spaces?
No. The page says the scene name is lowercase with no spaces, underscores, or hyphens, so Hex Array is `/scenes/hexarray`. Preset names stay case-sensitive and have to match the preset text.

### What is the default port?
The page does not print one. Input Port and Output Port are whatever integer you set, up to 65535, and the two programs have to agree.

### Will a global slider address hit a meta control?
No. The page says only scene controls have a global address. Meta controls keep one address, such as `/controls/meta/brightness`.
