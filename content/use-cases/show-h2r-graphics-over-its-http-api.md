---
title: "Show H2R Graphics over its HTTP API"
slug: show-h2r-graphics-over-its-http-api
category: "LED/Video"
tools: ["H2R Graphics", "HTTP"]
difficulty: Intermediate
source_url: https://h2r.graphics/docs/api/http/
summary: "H2R Graphics listens on port 4001. A client POSTs to the project API to run the rundown, show or hide one graphic, and update text, scores, and speaker timers."
---

## What it does

H2R Graphics is a live-graphics app from Here to Record. The HTTP API page builds the base URL from the host, port 4001, and the project id: `http://<host>:4001/api/<project-id>/`. The worked example on that page starts from a rundown URL of `http://192.168.8.153:4001/rundown/ABCD/` and uses `http://192.168.8.153:4001/api/ABCD/` as the API base. The Companion module page says the project id defaults to `ABCD` and changes when you create a new project, and that the target IP is the Network address shown in the launcher.

The same HTTP page says a failed request returns an error when the project id does not exist, the graphic id is not in that project, or the verb on an update is one the graphic does not understand. The practical way to get a URL is a right-click on the rundown row: Copy "Show" URI, Copy "Hide" URI, Copy "Update" URL, and Copy body JSON.

`POST .../run` runs the rundown. `POST .../clear` hides every graphic. `POST .../graphic/<graphic-id>/show` and `.../hide` take one graphic to air or off. `POST .../graphic/<graphic-id>/update` sends a JSON object. The page does not print a sample body. It tells you to copy the body from the rundown, so an agent should paste that object rather than invent keys.

Score graphics use a path, not a JSON body. The page's example `graphic/1234/updateScore/1/1/up/10` changes team 1, level 1, by adding 10. `team` is described as likely 1 or 2. `level` is likely 1, 2, 3, or 4. `type` is `set`, `up`, or `down`.

Text variables are a separate POST, `.../updateVariableText/<variable-text-id>`, with a JSON body whose `text` field is a string. The variables page says the app has three text-variable slots, used in a graphic as `[text.1]`. `POST .../updateVariableList/1/selectRow/next` selects the next row of list 1. Replace `next` with `previous` or a row number.

`POST .../output/<output_number>/open` takes `1`, `2`, `3`, or `4`. The Pro page says the app comes with one free output, and both that page and the Pro docs list multiple outputs as a licence feature. Treat outputs 2 through 4 as available only where that licence is on.

Speaker-timer paths under a graphic id are `timer/run`, `timer/pause`, `timer/reset`, `timer/jump/<seconds>`, and `timer/duration/<seconds>`. The page says `10` adds ten seconds and `-10` subtracts ten. While the timer is paused the jump edits the duration. While it is playing the jump edits the time left. Lyric graphics have `lyric/next`, `lyric/previous`, and `lyric/start`.

The HTTP page does not describe a password. Anything that can reach port 4001 can show a graphic.

## How to set it up

1. Install H2R Graphics and open the project. Read the Network address and the project id in the launcher. The [Companion module page](https://h2r.graphics/docs/api/companion/) uses that address, port 4001, and the project id.
2. Build the base URL exactly as the [HTTP API page](https://h2r.graphics/docs/api/http/) shows: host, port 4001, `/api/`, project id, trailing slash. Right-click one graphic and copy the Show URI. POST it with an empty body and confirm that graphic, and only that graphic, appears on the output.
3. For a text change, right-click the same graphic and copy the Update URL and the body JSON. POST that body. Do not substitute a guessed schema.
4. Keep `clear`, score `set`, and timer `duration` off an unattended client until a rehearsal has used the copied URIs. `clear` hides everything that is on air.
5. Leave the host on the show network. The docs page does not document authentication on port 4001.

Source: [H2R Graphics HTTP API](https://h2r.graphics/docs/api/http/), the [Companion module](https://h2r.graphics/docs/api/companion/), [variables](https://h2r.graphics/docs/control/variables/), [What is Pro?](https://h2r.graphics/docs/pro/what-is-pro/), and the [Pro page](https://h2r.graphics/pro/).

## FAQ

### Does a free install have four outputs?
The HTTP page lists output numbers 1 through 4. The Pro page lists multiple outputs as a licence feature, and the product page says the free app includes one output. Open output 1 first.

### How does an agent know the update JSON?
The HTTP page says to copy the body JSON from the rundown right-click. The error section says an update verb the graphic does not understand returns an error.

### Is the project id always ABCD?
The Companion page says it defaults to ABCD and is different after you create a new project. Read it from the launcher or from the rundown URL.
