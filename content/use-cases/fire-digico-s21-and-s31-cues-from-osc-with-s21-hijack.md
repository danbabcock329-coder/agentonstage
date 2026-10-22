---
title: "Fire DiGiCo S21 and S31 cues from OSC with S21 HiJack"
slug: fire-digico-s21-and-s31-cues-from-osc-with-s21-hijack
category: "Audio"
tools: ["DiGiCo S21", "DiGiCo S31", "OSC"]
difficulty: Advanced
source_url: https://github.com/pob31/S21_HiJack
labels: ["Experimental"]
summary: "S21 HiJack sits in front of a DiGiCo S21 or S31 and recalls scoped snapshots, macros, and a cue list from OSC, including from QLab."
---

## What it does

S21 HiJack is a Rust daemon and desktop UI for a DiGiCo S21 or S31. It keeps its own snapshots, cue list, macros, and channel palettes, then sends them to the console. Default mode is GP OSC, which the README calls the documented open protocol. Two further modes use the console's iPad protocol, which the README calls reverse-engineered, for parameters GP OSC does not expose. Mode 3 can sit between a real iPad and the console. Start in mode 1 unless you have a reason to leave it.

The part an assistant or a show controller can call is the trigger listener. The default port is 53001. `/cue/go` and `/cue/previous` move the app's cue list and recall. `/cue/fire` takes a cue number. `/macro/fire` takes a macro name or id. `/snapshot/recall` takes a snapshot name or UUID and honours that snapshot's scope. `/snapshot/recall_full` recalls the whole stored state. The same paths are also accepted under `/s21`, so `/s21/cue/go` is `/cue/go`. The README also describes building QLab network cues from those snapshots, and a Go.dot path that declares the app as the device `/s21`.

Offline mode drops OSC in both directions so you can edit the show file without moving the live desk. It defaults to off on every launch. Recalls can crossfade continuous parameters and fire mutes immediately. Each recall keeps one undo of the previous live values. A browser monitor on port 8080 is plain HTTP for the LAN, with optional per-profile PINs and optional source-IP allowlists. The README says the project is aimed at a 64-bit Raspberry Pi as well as a desktop, and that its test suite is 960 or more tests.

## How to set it up

1. Install Rust 1.88 or newer. Clone the repo and run `cargo build --release`. The binary is `target/release/s21_hijack`.
2. Point it at the console: `cargo run --release -- --console-ip 192.168.1.1`. The GP OSC port default is 8000, and the local bind port default is 8001. Add `--headless` when you do not want the GUI.
3. Leave `--mode` at `mode1` for GP OSC only. The trigger listener stays on 53001 unless you change `--trigger-port`.
4. Send a recall from QLab, Companion, or any OSC sender to that port. Ask `/cue/current` if you need the cue number back. The reply uses the same address.
5. Without a console, the repo includes a mock: `cargo run --bin mock_console -- --port 8000`, then connect the app to `127.0.0.1` on that port. Try a recall there before you point the trigger port at a show.

Source project: [pob31/S21_HiJack](https://github.com/pob31/S21_HiJack)

## FAQ

### Does this replace DiGiCo's own snapshots?
It keeps a separate show file. A snapshot can also name a console memory row. On recall, the README says the daemon can fire that memory over the iPad protocol, wait about 250 ms, then write the app's stored parameters on top. Mode 1 does not use that path.

### Who can open the browser monitor?
Anything that can reach port 8080 on the daemon. The README says to keep it on the LAN. `--web-allow-cidr` and `--trigger-allow-cidr` can limit the source addresses. An empty allowlist accepts every source.
