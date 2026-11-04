---
title: "Trigger Hippotizer timelines over HippoAPI REST"
slug: trigger-hippotizer-timelines-over-hippoapi-rest
category: "LED/Video"
tools: ["Hippotizer", "HTTP"]
difficulty: Intermediate
source_url: https://www.manula.com/manuals/green-hippo/hippotizer-v4/4.8.1/en/topic/hippoapi
labels: ["Commercial product"]
summary: "HippoAPI's web GUI is at localhost:40512. REST plays a timeline with GET /timelines/{index}/play. Read /timelines and /info before a play or cue jump."
---

## What it does

Hippotizer V4.8.1's manual calls HippoAPI a RESTful API for the Hippotizer software. HTTP commands go to a web page that controls parameters in Hippotizer. The Web GUI is at `http://localhost:40512`. That page lists commands and syntax, and it has try-it-now triggers for a selection of command types. The same topic says you can use the IP address shown in the ZooKeeper component UI instead of localhost. Dragging the Hippo API pin onto a pinboard shows instructions for opening that page. The English page and the German URL of the same topic carry this text. The page points to the complete REST documentation at Green Hippo's API site.

That linked spec is Hippotizer API 1.2, described as a RESTful API for Hippotizer Media Server. It defines no security scheme. `GET /info` returns server information, including `computerName`, `hostName`, `iP`, `product`, `productFamily`, `softwareVersion`, and `softwareRevision`, plus `engineStatus` and `mediaManagerStatus`. `GET /timelines` returns a timeline collection. In the 1.2 file the collection object's properties are not listed, so the field names have to come from the response you actually get, or from the list in the Web GUI.

Playing one timeline is `GET /timelines/{timeline}/play`. The `{timeline}` parameter is an integer index. Stopping it is `GET /timelines/{timeline}/stop`. `GET /timelines/{timeline}/reset` resets it. `GET /timelines/{timeline}/gocue/{cuenumber}` jumps it to a cue, and `cuenumber` is a number. The all-timeline forms are `GET /timelines/all/play` and `GET /timelines/all/stop`, plus reset, mute, unmute, next cue, previous cue, and `GET /timelines/all/gocue/{cuenumber}`. These play, stop, reset, and cue operations are GET. A GET here changes the show.

Green Hippo's REST API feature page says the interface is for custom web controls that trigger timelines and presets, upload and manage media, and read status. The 1.2 spec matches that shape: timeline routes as above, preset routes under `/presets`, and media routes that include `GET /media` and `POST /media/upload`.

The Timeline API page in the 4.5.5 manual is a different interface, HippoNet. It documents `Play`, `Stop`, `Pause`, `Rewind`, and `GotoCue(cuenumber)` on one timeline, plus `StopAll` and `PlayAll` on the timeline component. `GotoCue` accepts a decimal cue number. The page's example is 4.5, and the call it prints is `HippoNet.LocalHost.Timeline.Timelines['Colour']:GotoCue(2)`. `Play` on that timeline is `HippoNet.LocalHost.Timeline.Timelines['Colour']:Play()`. `PlayAll` is `HippoNet.LocalHost.Timeline:PlayAll()` and `StopAll` is `HippoNet.LocalHost.Timeline:StopAll()`. The same table includes `RewindAll`, `Mute`, `UnMute`, `MuteAll`, and `UnMuteAll`. Pause and Rewind are on this HippoNet page. The REST 1.2 file lists play, stop, reset, and gocue, and it does not list pause or rewind.

## How to set it up

1. On the Hippotizer machine, open `http://localhost:40512`, or the IP shown in the ZooKeeper component. The 4.8.1 manual says that GUI lists the commands. Keep that port on a trusted control network. The published Hippotizer API 1.2 spec defines no security scheme.
2. Read first. `GET /info` and check `product` and `softwareVersion`. `GET /timelines` and take the index from that payload, or from the GUI list. The 1.2 schema does not name the collection fields, so do not assume a name string is the path index.
3. After the operator confirms the index, play it with `GET /timelines/1/play` only when 1 is the index you just read. Stop with `GET /timelines/1/stop`. Jump to cue 2 with `GET /timelines/1/gocue/2`. The REST parameter is a number. The 4.5.5 HippoNet page is the one that shows a decimal cue, 4.5, on `GotoCue`.
4. `GET /timelines/all/play` and `GET /timelines/all/stop` affect every timeline. Confirm that explicitly. Reset, mute, and cue-all are the same kind of GET. They are not reads.
5. If the show is being driven by HippoNet rather than HippoAPI, use the 4.5.5 functions: `Play`, `Stop`, `Pause`, `Rewind`, `GotoCue`, `PlayAll`, and `StopAll`, addressed by timeline name. Those names are not the REST paths above.

Source: [Hippotizer V4.8.1 REST API](https://www.manula.com/manuals/green-hippo/hippotizer-v4/4.8.1/en/topic/hippoapi) (the [German URL](https://www.manula.com/manuals/green-hippo/hippotizer-v4/4.8.1/de/topic/hippoapi) has the same wording), the [Hippotizer API 1.2 spec](https://api.tvone.com/products/green-hippo/hippotizer-media-servers/rest_api.html) that page links, [Timeline API 4.5.5](https://www.manula.com/manuals/green-hippo/hippotizer-v4/4.5.5/en/topic/timeline-api), and [Green Hippo's REST API feature page](https://www.green-hippo.com/hippotizer-key-features/rest-api/).

## FAQ

### Does GET /timelines/1/play only read the timeline?
In Hippotizer API 1.2 that path is the play operation. `GET /timelines` and `GET /info` are the reads. Play, stop, reset, and gocue change the timeline, even though the method is GET.

### Where are Pause and Rewind?
The 4.5.5 Timeline API documents `Pause()` and `Rewind()` as HippoNet functions on a named timeline, with `Colour` as the example name. The REST 1.2 path list has play, stop, reset, mute, unmute, next cue, previous cue, and gocue. It does not list pause or rewind.

### Is the timeline argument a name?
In the REST 1.2 spec, `{timeline}` is an integer index. The HippoNet examples address a timeline by name, such as `Timelines['Colour']`.
