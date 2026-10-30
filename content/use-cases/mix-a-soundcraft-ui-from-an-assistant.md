---
title: "Mix a Soundcraft Ui from an assistant"
slug: mix-a-soundcraft-ui-from-an-assistant
category: "Audio"
tools: ["Soundcraft Ui", "WebSocket"]
difficulty: Intermediate
source_url: https://fmalcher.github.io/soundcraft-ui/usage/quickstart
summary: "soundcraft-ui-connection drives a Ui12, Ui16, or Ui24R through the mixer's web protocol, with channel mutes, dB faders, and a readable level."
---

## What it does

`soundcraft-ui-connection` is Ferdinand Malcher's TypeScript library for the Soundcraft Ui12, Ui16, and Ui24R. The project is MIT licensed. The documentation says it is a community project and is not associated with Soundcraft.

The library copies the text protocol the mixer's own web app uses over a WebSocket. A mute of master input 1 sends `SETD^i.0.mute^1`. A fader at half on that same strip arrives as `SETD^i.0.mix^0.5`. `SETD` carries numbers. `SETS` carries strings, such as a channel name. The docs ask you to prefer the typed methods, and they publish the raw helpers `conn.conn.setd(path, value)` and `conn.conn.sets(path, value)` for anything the objects do not wrap.

Construct the client with the mixer IP, either `new SoundcraftUI(mixerIP)` or `new SoundcraftUI({ targetIP: mixerIP })`. `connect()`, `disconnect()`, and `reconnect()` each return a Promise that resolves when the operation finishes. The connection page says those Promises do not reject. Errors show up on `status$`. The `status` field is a `ConnectionStatus`: `Opening`, `Open`, `Closing`, `Close`, `Error`, or `Reconnecting`. An `Error` message carries the error object on `payload`. Calling `connect()` again while a connection is open, or still opening, only returns a Promise that resolves when the socket is open.

`conn.master.input(2)` is input 2 on the master bus. The quick start toggles that strip with `toggleMute()` and says the web app shows Channel 2. The same numbering is why `input(1).mute()` lands on wire path `i.0`. Master also exposes `line`, `player`, `aux`, `fx`, `sub`, and `vca`. `conn.master.mtx(7)` is documented as Ui24R only. `conn.aux(3).input(2).mute()` mutes input 2 on aux 3.

Every channel shares fader and mute calls. `setFaderLevel` takes a linear value from `0` to `1`. `setFaderLevelDB` takes dB from `-Infinity` to `10`. `faderLevel$` and `faderLevelDB$` are the matching reads. `mute()`, `unmute()`, `toggleMute()`, and `mute$` cover mute. `setName` is limited to 20 characters. `fadeTo(value, fadeTime)` and `fadeToDB(value, fadeTime)` move a fader over `fadeTime`. The page names that argument and does not state its unit. Pan is also clamped to `0..1`. The notes page says most other values are not checked.

Feedback is an RxJS Observable. `firstValueFrom` from RxJS turns one emission into a Promise, and that Promise resolves once.

## How to set it up

1. In an empty Node project, run `npm install soundcraft-ui-connection`. The quick start puts the script in `index.mjs` so it can use top-level `await`.
2. Create the client with the mixer IP and wait for `connect()`. Read `conn.status`. Treat `ConnectionStatus.Open` as the ready state. Subscribe to `status$` if you need the `Error` payload, because `connect()` resolves either way.
3. Read before you write. `await firstValueFrom(conn.master.input(2).faderLevel$)` is one linear level. `mute$` is the mute state. The number you pass to `input()` is the channel number on the desk. `input(1)` is wire index `i.0`.
4. Move one strip. `conn.master.input(2).setFaderLevelDB(0)` sets that fader in dB, inside `-Infinity` to `10`. `setFaderLevel(0.5)` is the linear form. `mute()` and `unmute()` are the explicit mute calls.
5. Keep the quick start's one-second `toggleMute()` loop off a live show. It is a connection demo. `setName` stops at 20 characters. `mtx` is documented for the Ui24R.

Source: [soundcraft-ui-connection quick start](https://fmalcher.github.io/soundcraft-ui/usage/quickstart), [connection](https://fmalcher.github.io/soundcraft-ui/usage/connection), [how the library works](https://fmalcher.github.io/soundcraft-ui/more/howitworks), and [generic channel operations](https://fmalcher.github.io/soundcraft-ui/buses/channel).

## FAQ

### Does input(1) mean the first channel?
The quick start says `input(2).toggleMute()` toggles Channel 2 in the web app. The protocol page says `master.input(1).mute()` sends `SETD^i.0.mute^1`. Pass the channel number you see on the mixer. The wire index is one lower.

### Will connect() throw if the mixer is offline?
The connection page says `connect()`, `disconnect()`, and `reconnect()` do not reject. Watch `status$`. An error message has type `ConnectionStatus.Error`, and the error object is on `payload`.

### Is this a Soundcraft product?
The documentation says the library is not associated with Soundcraft, and that the mixer names and trademarks belong to their owners. The license is MIT.
