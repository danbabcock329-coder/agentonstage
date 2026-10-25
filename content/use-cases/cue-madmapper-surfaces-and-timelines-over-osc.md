---
title: "Cue MadMapper surfaces and timelines over OSC"
slug: cue-madmapper-surfaces-and-timelines-over-osc
category: "LED/Video"
tools: ["MadMapper", "OSC"]
difficulty: Intermediate
source_url: https://docs.madmapper.com/madmapper/6/11.-live-performance-and-control/osc-commands-and-channels-list
summary: "MadMapper takes OSC on the port set under Preferences, typically 8000. Sending 0 to /surfaces/*/opacity blacks out every surface, and OSC Query lists the addresses for the open project."
---

## What it does

MadMapper's live-performance guide documents an OSC API for surfaces, media, timelines, and master levels. Incoming and feedback ports are set under Preferences, OSC / MIDI. The channel list says incoming OSC is typically port 8000. Predefined addresses bypass any input range, output range, or filtering that a learned control would apply.

The same preferences tab turns on OSC Query. An OSC Query client, the guide names the OSC Query Browser, Chataigne, TouchDesigner, Vezér, or another MadMapper, can browse the address tree of the project that is open and read current values. A right-click on a widget also copies that widget's OSC address. Addresses that include a surface or media name use the name in the project, so `/surfaces/Quad-1/opacity` is the opacity of a surface named Quad-1.

A `*` in the address hits every match. The guide's example sends `0` to `/surfaces/*/opacity` and says that blacks out every surface.

Values follow the parameter. The channel list uses BOOL as 1 or 0, FLOAT for continuous values such as opacity, INT for an index, STRING for a name or path, and nil when the address itself is the trigger. `/media/select_by_name` takes a STRING. `/media/[media_name]/restart` is nil. `/master/master_level` is a FLOAT. `/master/freeze_video_output` is a BOOL. `/timelines/Bank-1/columns/1` is a BOOL that triggers column 1, and columns run from 1 to 16. `/timelines/Bank-1/conductor/play` is a BOOL. A cue cell is `/timelines/Bank-1/by_cell/col_1/cue_row_1/play`, also a BOOL. The list says `col_current` targets the column that is active.

The channel list says a row is exclusive. Starting a scene, cue, or timeline on a row stops whatever timeline is already playing on that same row. If the new timeline has a fade time, audio and montage on the stopped timeline fade out across that duration, and the previous timeline keeps running internally for the length of the fade.

## How to set it up

1. In MadMapper, open Preferences, then OSC / MIDI. Set the incoming port, typically 8000, and a feedback port if a controller needs state back. Turn on OSC Query when the sender should discover the tree.
2. Right-click a surface, media, or timeline control and choose Copy OSC address, or browse the project with an OSC Query client.
3. Set one surface with its own address, such as `/surfaces/Quad-1/opacity`. Send `0` to `/surfaces/*/opacity` when every surface should go to black.
4. Select media with `/media/select_by_name` and the bin name. Restart that media with `/media/[media_name]/restart` and no argument.
5. Run a timeline column with `/timelines/Bank-1/columns/1` as a BOOL, or a cue cell with `/timelines/Bank-1/by_cell/col_1/cue_row_1/play`. A new cue on a row stops the timeline already playing on that row.

Source: [MadMapper OSC commands and channels](https://docs.madmapper.com/madmapper/6/11.-live-performance-and-control/osc-commands-and-channels-list) and [Live performance and control](https://docs.madmapper.com/madmapper/6/11.-live-performance-and-control).

## FAQ

### Do learned control ranges apply to these addresses?
The channel list says a predefined address bypasses the input range, output range, and filtering of a control created in the Controls dialog. The value you send is the parameter's own value.

### Where does a surface address come from?
From the surface name in the open project. The guide's example is `/surfaces/Quad-1/opacity`. Copy OSC address on the widget, or read the tree over OSC Query, when the project uses different names.
