---
title: "Mix a Behringer XR18 from an assistant"
slug: mix-a-behringer-xr18-from-an-assistant
category: "Audio"
tools: ["Behringer XR18", "OSC", "MCP"]
difficulty: Advanced
source_url: https://github.com/gdeber/xr18-mcp
labels: ["Experimental"]
summary: "xr18-mcp talks to a Behringer XR18 on UDP port 10024 so an assistant can move faders and sends in dB, with readback on request and a confirm gate on phantom, snapshots, and network changes."
---

## What it does

xr18-mcp is an MCP server for a Behringer XR18. The README says mixer commands go out as OSC on UDP port 10024. The command list is built from a parameters file in the repo, a supplied X AIR OSC protocol PDF, and the Behringer World X-Air OSC reference. Raw tools cover documented paths that do not have their own named tool, including paths that depend on firmware.

The mixing tools speak dB. `xr18_list_channels` and `xr18_resolve_channel` cover regular channels, the AUX return, FX returns, monitor buses, FX sends, LR, and DCAs. Fader tools get, set, and nudge a level. Send tools do the same for a bus. Sends 1 through 6 are the monitor buses. Sends 7 through 10 are FX sends 1 through 4. A destination can be a bus number, a name you configured, or an id such as `bus/5` or `fxsend/2`. The README says `fxsend/2` maps to channel send slot 08. Other ids it lists are `ch/10`, `rtn/aux`, `rtn/1`, `lr`, and `dca/1`.

Lower-level tools read mixer info and status, turn on `/xremote`, get or set a raw path, fire a trigger, list and describe commands, and read meter batches 0 through 9 in dB. Separate tools set a channel fader or mute, set headamp phantom, and load, save, delete, or scope a snapshot. The README says to call `xr18_describe_command` before writing a raw path you have not used. Native float values on the desk run from 0.0 to 1.0.

Writes do not wait for an echo. The README says XR18 firmware does not reliably echo set messages, so a write is fire-and-forget, while a query still waits for a reply. The absolute setters take `verify=true`, which sends the value and then reads it back. A relative change reads the current dB, sends the new value without waiting, and returns the dB it expects. `confirm=true` is required before console initialization, applying network settings, deleting a snapshot, or changing phantom power. The README says a network update can drop the server off the mixer, and that the XR18 ignores `/-action/setclock`. `/xremote` subscriptions expire after ten seconds, so `xr18_enable_remote` has to be called again while you are listening for changes.

The repo also includes a Google ADK mixer assistant that runs against a local llama.cpp server and accepts English and Italian. The README says that agent is limited to nine tools, that gain math stays in Python, and that the agent cannot enable phantom, initialize the console, delete snapshots, or change network settings. Ambiguous strip names are rejected.

## How to set it up

1. Install Python 3.12 or newer and uv. Clone the repo, run `uv sync`, and set `XR18_HOST` to the mixer. `XR18_PORT` defaults to 10024. `XR18_TIMEOUT` defaults to 2 seconds.
2. Start it with `uv run xr18-mcp`. For a client config, the README uses `uv run --directory` with the repo path and passes `XR18_HOST` in `env`.
3. Ask for a channel list before the first move. Pass `verify=true` on `xr18_set_fader_db` or `xr18_set_send_db` when you need a readback.
4. Leave phantom, snapshot deletion, console initialization, and network changes alone unless you pass `confirm=true` and you are on a desk you can reset.
5. The optional local agent needs `llama-server --jinja` and a model with a tool-calling template. Copy `agents/.env.example` to `agents/.env`, set the host, then from `agents` run `uv run adk run mixer_assistant`.

Source project: [gdeber/xr18-mcp](https://github.com/gdeber/xr18-mcp)

## FAQ

### Does a fader move get confirmed by the desk?
A normal write does not wait for an echo. The README says the firmware does not reliably echo sets. Pass `verify=true` on the absolute dB setters when you want a separate read after the write.

### Can the assistant turn phantom on?
The MCP server can, and only with `confirm=true`. The README's local ADK agent is a narrower surface: it cannot enable phantom, initialize the console, delete snapshots, or change network settings.
