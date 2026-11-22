---
title: "Cue a Ventuz Director channel over its remoting API"
slug: cue-a-ventuz-director-channel-over-its-remoting-api
category: "LED/Video"
tools: ["Ventuz Director", "WebSocket", "HTTP"]
difficulty: Intermediate
source_url: https://www.ventuz.com/support/help/latest/Director/DirectorRemoting.html
labels: ["Commercial product"]
summary: "Ventuz Director remoting on port 22404 takes show.open, show.cue, and show.take as JSON under DirectorRemoting_Service/1.0. Code 4 means no show is open."
---

## What it does

Ventuz's Director Remoting page says Director has been controllable since version 5.4.0 with GPI triggers, and that a remoting API now extends that over WebSocket or REST. Remoting has to be enabled in Tools, Options, Application Settings.

The websocket URL on that page is `ws://<Machine IP>:22404/DirectorRemoting_Service/1.0/commands/ws`. A request is JSON. `Command` and `RequestID` are mandatory. Other fields are that command's parameters. The REST form puts the command in the path: `http://<Machine IP>:22404/DirectorRemoting_Service/1.0/commands/api/:<command>`. The printed sample for activating a topology is that path ending in `:topology.set`, with a JSON body whose field is `Name`. The page says command parameters travel as that JSON body. It does not print an authentication header.

`status.get` is a POST with no parameters. The printed result includes `Version`, `TopologyName`, `TopologyState`, `ShowName`, `ShowUri`, `ProjectName`, and `ChannelCount`. The sample `Version` on the page is `6.9.0.0`. `topology.get` is a GET and returns each topology's `Name` and `SourceType`. The sample types are `DefaultTopology`, `LocalFile`, and `EmbeddedInProject`. `topology.set` is a POST. `Name` is required. `SaveTopology` and `TimeOut` are optional. `TimeOut` is milliseconds to wait for Ventuz Presenter to load and validate scenes. The page says a timeout comes back as succeeded with warnings.

`show.open` is a POST. `Uri` is required and is the local path of the show file. The printed websocket example uses `C:\\Users\\Public\\Documents\\Ventuz6\\Content\\Projects\\Hockey\\Hockey.show` and `RequestID` 32. `show.getchannels` returns `ChannelIndex` and `Name`. The sample channels are index 0, `Background`, and index 1, `Content`. `show.cue` needs one of `Uri`, `TemplateData`, `TemplateDisplayName`, or `PageDisplayName`. `show.take`, `show.clear`, and `show.takeout` take an optional `ChannelIndex`. The page says that when `ChannelIndex` is left out, the action runs on every channel. `playlist.activate` requires `ChannelIndex` and one of `Index`, `Id`, `Name`, or `DisplayName`. `timeline.play`, `timeline.pause`, `timeline.rewind`, and `timeline.jumpstart` take no parameters. `macro.execute` needs `Id` or `Name`.

Channel commands are the ones the page says run in parallel. The others run one after another. The channel list includes `show.cue`, `show.take`, `show.clear`, `playlist.activate`, and `playlist.restart`. A channel result carries `ChannelIndex`, `ChannelName`, `Code`, `TakeIndex`, and `TakeCount`.

The response code table is `Ok` 0, `ErrorException` 1, `ErrorValidation` 2, `ErrorNotFound` 3, `ErrorNoShow` 4, and `ErrorInvalidOperation` 5. The page's no-show example is code 4 with the message `No show open`. A mixed `show.cue` example prints main code 0 while channel 1 is code 5, with the message `Unable to perform desired action due to a blocking channel rule.` The example where every channel fails prints main code 1.

## How to set it up

1. In Director, enable remoting under Tools, Options, Application Settings. Point the client at the machine IP on port 22404.
2. Open the websocket at `/DirectorRemoting_Service/1.0/commands/ws`, or POST and GET the REST path `/DirectorRemoting_Service/1.0/commands/api/:` plus the command name. Send `status.get` before a cue. Read `ShowName` and `ChannelCount`.
3. Send `show.getchannels` and keep the `ChannelIndex` values. Send `show.cue` with one identifier the table allows, plus `ChannelIndex` when the cue should hit one channel. Send `show.take` with that same index.
4. Treat main code 0 as the success value in the printed examples. Code 4 is the no-show case. Code 5 on a channel is the blocking channel-rule case printed with `show.cue`. Read `Errors` before issuing the next take.
5. Leave `TimeOut` off until a show load has been timed on that system. The page says a timeout is a warning, not a failed code, and that the warning can cause unexpected behavior later.

Source: [Director Remoting](https://www.ventuz.com/support/help/latest/Director/DirectorRemoting.html).

## FAQ

### Does every command accept a missing ChannelIndex?
`show.take`, `show.cue`, and `show.clear` run on every channel when `ChannelIndex` is omitted. `playlist.activate` marks `ChannelIndex` required, and it also requires one of `Index`, `Id`, `Name`, or `DisplayName`.

### Which code means the show is not open?
The table assigns 4 to `ErrorNoShow`. The printed body for that case has `"Code": 4` and the message `No show open`. A channel rule in the mixed example is code 5 on that channel, with the main code still 0.

### Is the REST body a query string?
The page puts the command in the URL and says parameters are added in JSON. The topology sample body is an object with `Name`. The websocket puts `Command`, `RequestID`, and the parameters in one JSON object.
