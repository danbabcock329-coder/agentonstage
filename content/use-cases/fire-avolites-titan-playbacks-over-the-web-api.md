---
title: "Fire Avolites Titan playbacks over the Web API"
slug: fire-avolites-titan-playbacks-over-the-web-api
category: "Lighting"
tools: ["Avolites Titan", "HTTP"]
difficulty: Intermediate
source_url: https://api.avolites.com/19.2/index.html
summary: "Titan's Web API on port 4430 lets an agent read the show, list handles, and fire or kill playbacks with HTTP, once it has a Titan id or a user number."
---

## What it does

Avolites documents a Web API that controls Titan console functions over HTTP. The 19.2 introduction says it listens on port 4430, paths start with `/titan/`, and replies that carry data come back as JSON. The same page says property names are case sensitive.

Three shapes cover most calls. A get is a browser-friendly GET, such as `/titan/get/System/SoftwareVersion` or `/titan/get/Show/ShowName`. The introduction's sample replies for those two are `14.0` and `V10 Demo Show`. A set is an HTTP POST to `/titan/set/...` with the new value in the body. The page's example POSTs `False` to `/titan/set/Fixtures/ShowDmxAddress`. A script is a GET with typed query parameters. The page says a bad request returns an error message, and a script with nothing to return comes back blank.

Playback scripts are the part a show controller would call. `Playbacks/FirePlaybackAtLevel` takes an id, a level, and a refire flag. Level `0.5` is 50% and `1` is full. The id can be a `titanId` or a `userNumber`. The page says the call forces the playback to that level and loads it if it is not loaded, and that refire kills it before firing when the flag is set. `KillPlayback` kills one playback. `ToggleLatchPlayback` shows the current cue, and on a cue list the page says that moves on to the next cue. `KillAllPlaybacks` deactivates every playback. `Masters/SetMasterLevel` is the example for a master, with `level` replacing the value and `levelDelta` adding to it.

Handles are how you learn the ids. `/titan/handles/Colours/0` is the first page of the Colours group. The page index starts at 0, and the group name has to match the console's capitals. `/titan/handles/Fixtures` returns every page of that group. `/titan/handles` returns every programmed handle. Each handle in the sample JSON includes `titanId`, `type`, `Legend`, `Active`, and a `handleLocation` with group, index, and page.

The [AVOSUPPORT wiki](https://www.avosupport.de/wiki/webapi/start) adds limits the 19.2 introduction does not spell out. It says the API has been on Titan consoles since v10, on the T2 from v12.1, and is absent on Titan One and T1. It also says the API runs with its own programmer, that this programmer cannot be opened, and that functions which depend on the programmer are therefore not useful.

## How to set it up

1. Put the controller on the same subnet as the console. The introduction's test machine is `10.0.0.2` when the console is `10.0.0.1`. Open `http://<console>:4430/titan/get/System/SoftwareVersion` and confirm you get a version string back.
2. GET a handle page the introduction actually shows, such as `/titan/handles/Colours/0` or `/titan/handles/Fixtures`. Group names have to match the console's capitals. Read each handle's `titanId` and `Legend`. The sample handle JSON includes `titanId`, not a user number.
3. Fire one playback at a known level: `/titan/script/Playbacks/FirePlaybackAtLevel?titanId=<id>&level=1.0&bool=false`. The same page also accepts `userNumber` when you already know the number assigned on the console.
4. Sets are POSTs. A script or an HTTP client has to send them. The address bar only covers GETs.
5. Treat `KillAllPlaybacks` as a blackout of every playback. The 19.2 page does not describe a login step, so keep port 4430 on the show network.

Source: [Avolites Titan 19.2 Web API introduction](https://api.avolites.com/19.2/index.html) and the [AVOSUPPORT WebAPI notes](https://www.avosupport.de/wiki/webapi/start).

## FAQ

### Can this patch fixtures from an empty programmer?
The AVOSUPPORT wiki says the Web API's programmer cannot be opened, so programmer-based functions are not a useful remote. Playback fire, kill, and level, plus get and handle queries, are the calls the 19.2 introduction actually demonstrates.

### Which consoles answer on port 4430?
The official introduction describes the API and does not list models. The AVOSUPPORT wiki says it is there on Titan consoles from v10, on the T2 from v12.1, and not on Titan One or T1.
