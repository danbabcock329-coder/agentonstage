---
title: "Play an SPX Graphics rundown item over HTTP"
slug: play-an-spx-graphics-rundown-item-over-http
category: "LED/Video"
tools: ["SPX Graphics", "HTTP"]
difficulty: Intermediate
source_url: https://docs.spxgraphics.com/Documentation/Control+Interfaces/REST/Overview+of+SPX+API
labels: ["Commercial product"]
summary: "SPX Graphics serves /api/v1. The overview's play example is GET /rundown/play. That page prints port 5660 as typical and port 5656 in the examples."
---

## What it does

SPX Graphics Controller's API overview says external devices can control rundowns, items, and playout over a REST API at `spx-host:port/api/v1`. The same page says that address is typically `http://localhost:5660/api/v1`. The play, status, and load examples on that page, the interactive-docs steps, and the External Control page all print `http://localhost:5656/api/v1`. The overview also says each SPX version serves its own current list at `/api/v1`, from the main menu or in a browser.

The overview splits the API into three groups. Common API is on every SPX GC version and includes `panic`, which force-clears graphics, and `feedproxy`. Control API drives the Graphics Controller interface and is available in SPX Production and SPX Broadcast. Server API sends playout to the SPX server for automated workflows, including MOS, and is available in SPX Broadcast. The Server API page says those calls do not need an open browser with Graphics Controller. The overview says every endpoint is compatible with SPX and OGraf formats.

The overview's play example is `GET http://localhost:5656/api/v1/rundown/play`. Status is `GET /api/v1/rundown/status`. Load is `POST /api/v1/rundown/load` with JSON `{"project": "My Project", "rundown": "My Rundown"}`.

SPX 1.1.4 added an API key. It is a string in `config.general.apikey` inside `config.json`. An empty string means no restriction, and the page says any computer on the network can send commands. If the value is set, the same string has to be the `apikey` query parameter. The printed example is `http://localhost:5656/api/v1/panic?apikey=MyVerySecretKey`.

The overview's template example is `GET /api/v1/invokeTemplateFunction?webplayout=6&function=setValue&params=50`. It says a parameter that is not a number is treated as zero. `changeValue` with `params=10` adds 10. SPX 1.3.0 adds `invokeExtensionFunction`. The printed call is `GET /api/v1/invokeExtensionFunction?function=sendCmd&params=incrementNumber`, and the extension page has to load `/js/socket.io.js`, open `io()`, and load `/js/spx_gc.js`.

On a Broadcast license, the Server API page documents `GET /api/v1/controlRundownItemByID?file=MyFirstProject/MyFirstRundown&item=1234567890&command=play` for play, next, stop, preview, or preview-next of one item. `POST /api/v1/directplayout` fills a template and runs play, continue, or stop. The example body uses `casparServer` `OVERLAY`, `casparChannel` `1`, `casparLayer` `20`, and `command` `play`. That page says special characters in values are not supported. `GET /api/v1/rundown/get` returns the active rundown as JSON.

External Control says SPX 1.0.8 and later can load and control rundowns with HTTP GET and POST, including from a Stream Deck or Bitfocus Companion. For a Stream Deck Website button it says to set Open with to "GET request in background" so the browser does not open on every press. It says Companion version 2 will have a built-in module with presets for SPX.

## How to set it up

1. Start SPX and open `/api/v1` on that machine. The overview calls port 5660 typical and then uses port 5656 in every example. Use the port that page actually loads.
2. Read `config.general.apikey`. If it is empty, the overview says the API is open to the network. If it is set, add `apikey` to every URL.
3. `GET /api/v1/rundown/status` before a take. Play the current item with `GET /api/v1/rundown/play`. Load a named rundown with `POST /api/v1/rundown/load` and the project and rundown strings from the overview example.
4. On SPX Broadcast, play one known item with `GET /api/v1/controlRundownItemByID`, passing `file`, `item`, and `command=play`. The Server API page says this group is the Broadcast license.
5. Keep `panic` for a deliberate clear. The overview describes it as a force clear. Do not put `directplayout` values with special characters on a button. That page says those values are not supported.

Source: [SPX API overview](https://docs.spxgraphics.com/Documentation/Control+Interfaces/REST/Overview+of+SPX+API), [Server API](https://docs.spxgraphics.com/Documentation/Control+Interfaces/REST/Server+API), and [External Control](https://docs.spxgraphics.com/Documentation/Control+Interfaces/External+Control).

## FAQ

### Which port is the API on?
The overview says the API is typically at `http://localhost:5660/api/v1`. The curl examples on that page, the interactive-docs steps, and the External Control page all use port 5656. Open `/api/v1` on the machine and use the port that responds.

### Which calls work without a Broadcast license?
The overview says Common API, including `panic`, is on every SPX GC version. Control API, which drives the controller UI, is SPX Production and SPX Broadcast. Server API, including `controlRundownItemByID` and `directplayout`, is SPX Broadcast, and that page says it does not need the Graphics Controller browser open.

### Does a Stream Deck button have to be a POST?
The External Control page says rundowns can be loaded and controlled with GET or POST. For the Stream Deck Website action it specifically says to use "GET request in background". The overview's play example is a GET with no body.
