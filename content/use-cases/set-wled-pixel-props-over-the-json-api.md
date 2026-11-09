---
title: "Set WLED pixel props over the JSON API"
slug: set-wled-pixel-props-over-the-json-api
category: "LED/Video"
tools: ["WLED", "HTTP", "MCP"]
difficulty: Intermediate
source_url: https://kno.wled.ge/interfaces/json-api/
summary: "A POST to /json/state turns a WLED controller on and sets brightness from 1 to 255. Preset 4 is ps set to 4. An early MCP can send the same calls."
---

## What it does

WLED's JSON API is how a show controller talks to the pixel props and practicals that run the firmware. The project documentation says a POST to `/json/state`, or to `/json`, updates only the fields you include. A GET of `/json/state` is the current state. `/json/info` is the device, including the firmware version, the LED count, and the name. `/json/eff` and `/json/pal` are the effect and palette name lists.

The documented full-brightness body is `{"on":true,"bri":255}`. Brightness runs from 0 to 255. The page says `bri` of 0 is accepted and still recommends 1 to 255 with `on` set to false to turn the controller off. `"t"` toggles `on`. The first segment turns teal with `{"seg":[{"col":[[0,255,200]]}]}`. A segment id toggles with `{"seg":[{"id":1,"on":"t"}]}`. Effect ids that the effect list names `RSVD` or `-` fall back to Solid. Those names are how a build marks an effect it did not compile.

Preset ids run from -1 to 250. `{"ps":4}` recalls preset 4. The page says `1~17~` walks presets 1 through 17, and `4~10r` picks at random inside that range. `{"psave":4}` stores the current state into slot 4. A playlist is a `playlist` object posted with the state. The sample plays preset 26, then 20, then 18, then 20 again: `ps` is `[26,20,18,20]`, `dur` is `[30,20,10,50]`, and the page says each `dur` value is in tenths of a second. `repeat` of 10 runs that list ten times. `end` is the preset applied when the list finishes. `{"v":true}` makes the POST return the state instead of `{"success":true}`.

The curl line in the docs is `curl -X POST "http://[WLED-IP]/json/state" -d '{"on":"t","v":true}' -H "Content-Type: application/json"`. The light API has no login of its own. The wled-mcp README quotes the WLED docs on that point: anyone who can reach the IP and port can control the lights.

[descipar/wled-mcp](https://github.com/descipar/wled-mcp) is an unofficial MCP server in front of that API. The README calls it early `0.x` software, not affiliated with WLED. PyPI listed 0.1.2 on 9 November 2026. The README says to pin the release, because an unpinned `uvx` install follows `main`. It requires Python 3.13. Linux is the supported host. Windows and macOS are marked experimental. The firmware row says WLED 16.0.1 was tested, other 16.x builds are unknown, and builds below 16.0.0 are unsupported. Unsupported firmware is still served, with a warning that `wled_get_state` reports. Hardware notes in the README cover one RGB controller. There is no device login support, and a URL that contains credentials is rejected.

The README's stdio check is `uvx --isolated --python 3.13 --from wled-mcp==<version> wled-mcp --version`. `wled-mcp config init` writes a TOML inventory with a device id, a name, and a base URL, and the README says that command contacts nothing. The first read it names is `wled_list_devices`. Write tools take `dry_run=true`. `wled_patch_segments` changes named segments. `wled_replace_layout` is the call that removes segments you did not list. Profiles are `read-only`, `control`, and `full`.

## How to set it up

1. On a bench controller, GET `http://<controller>/json/info` and read `ver`, the LED count, and the name. GET `/json/state` and `/json/eff` before you send a look. Keep this HTTP port on the show network. The API does not ask for a password.
2. Turn the prop on at full with POST `/json/state` and `{"on":true,"bri":255}`. Add `"v":true` when you want the new state in the response. Turn it off with `{"on":false}` rather than brightness 0. Set the first segment color with `{"seg":[{"col":[[0,255,200]]}]}`.
3. Recall a look you already stored with `{"ps":4}`. Walk a range only when you mean to, because the page says `1~17~` iterates. A playlist uses tenths of a second in `dur`: the sample's `30` is the three seconds it describes for preset 26.
4. For an assistant, pin wled-mcp to the release you read, not to `main`. The README's host is `uvx` with `--python 3.13` and `--from wled-mcp==<version>`. Init the inventory with the controller's base URL, ask for `wled_list_devices`, and send the first write with `dry_run=true`. The README says a write is checked against the current state first, then read back, and a timed-out write is reported as possibly applied and is not retried. Treat builds other than the tested 16.0.1 as unproven.

Source: [WLED JSON API](https://kno.wled.ge/interfaces/json-api/) and [descipar/wled-mcp](https://github.com/descipar/wled-mcp). [Show Designer](/use-cases/edit-an-led-and-dmx-timeline-with-show-designer) can list a WLED controller as an output target. This page is the controller's own HTTP API.

## FAQ

### Does brightness 0 turn it off?
The state table says a `bri` of 0 is accepted, and it recommends the range 1 to 255 plus `"on":false` to turn the light off. The state you read back will not show `bri` as 0.

### What does a playlist duration of 30 mean?
The playlist table says `dur` is in tenths of a second. The sample array `[30,20,10,50]` is the one the page describes as 3 seconds, then 2, then 1, then 5. `repeat` counts how many times the whole list cycles. `0` repeats without end.

### Is the MCP a WLED project?
No. The README says it is unofficial, early, and tested against one controller on firmware 16.0.1. Pin the PyPI release. The JSON calls above are the API that server sends, and they work without it.
