---
title: "Adjust Allen & Heath dLive in-ear mixes from an assistant"
slug: adjust-allen-and-heath-dlive-in-ear-mixes-from-an-assistant
category: "Audio"
tools: ["Allen & Heath dLive", "MCP"]
difficulty: Advanced
source_url: https://github.com/Benjamin-Davies/mcp-server-allenheath-dlive
labels: ["Experimental"]
summary: "A Rust MCP server for a dLive mix rack lists the inputs and mixes you name in config and reads, sets or nudges their send and mix levels in dB."
---

## What it does

`mcp-server-allenheath-dlive` is a Rust server, version 0.1.0 in its Cargo manifest, that exposes a small slice of an Allen & Heath dLive mix rack to an MCP client. The repo has no README. What follows is the server source, including `mcp-server/src/instructions.md`, which is also the text served at `/api/instructions.md` and handed to the model as the server instructions.

Those instructions say the server can change the level of vocals and instruments in one or more mixes, and the overall level of a mix. The first use case they describe is musicians asking for in-ear changes, with the agent taking part of the role a front-of-house operator would otherwise do by hand. They tell the model to assume a request is for the speaker's own ears unless the person says otherwise, and to defer to the operator when something is outside what it can do.

The MCP tools in `handler.rs` are `list_inputs`, `list_mixes`, `get_input_level`, `set_input_level`, `adjust_input_level`, `get_mix_level`, `set_mix_level` and `adjust_mix_level`. Input and mix arguments are channel names, and the lookup requires an exact match against the names read from the rack for the channels in your config. A level is a number of dB. The deserializer accepts a float from -50 to 10, or the string `-inf`. The instructions say setting the level to `-inf` mutes that input or mix. The library comment on the conversion says dLive's 7-bit fader value maps `0x00` to -inf, `0x6B` to 0 dB and `0x7F` to +10 dB. A relative change carries a unit of `Decibels` or `Percentage`. The percentage path adds `20 * log10(1 + amount/100)` decibels. The instructions tell the model that "a little" is normally 2 to 4 dB, an unspecified or moderate change is 4 to 6 dB, and something described as painful can be 10 dB or more. They also say to drop the inputs first, then raise the mix master, when a move would otherwise pass +10 dB.

The same instructions mention panning only as something you may or may not be able to change. None of the MCP tools above is a pan control. The library speaks more of the mix rack (mutes, main assign, channel names), and those calls are not wrapped as tools.

## How to set it up

1. The binary is the `mcp-server` crate. `main.rs` loads a `.env` with dotenvy, prints `Couldn't load env file` if that fails, then parses arguments. There is no documented installer in the repo.
2. `DLIVE_IP` is the mix rack address. `DLIVE_INPUTS` and `DLIVE_MIXES` are comma-separated channel ranges. The parser takes a type prefix and a number or a start-end pair. Prefixes in the library include `Ip`, `Aux`, `StAux`, `Grp`, `StGrp`, `Mtx`, `StMtx`, `FXRet`, `Main`, `DCA`, `UFX` and `UFXR`. A range that starts with `StIp` steps by 2. Input numbers are checked against 1 to 128. The channel-name type holds 8 bytes, and parsing a longer string fails.
3. `AUTH_TOKEN` is optional. When it is set, every request must carry that token as a `Bearer` authorization header or as a `token` query parameter, or the middleware returns 401. When it is unset, the middleware does not check a token.
4. The process binds `0.0.0.0:3000`. MCP is mounted at `/mcp` (streamable HTTP). The same level calls are also plain HTTP under `/api`. Sending SIGHUP re-reads `DLIVE_INPUTS` and `DLIVE_MIXES` from `.env` and drops the cached name lists. The mix-rack client is reconnected every 5 minutes.
5. Ask for the input list and the mix list before the first level change, and keep the first writes off a show. The instructions are written for live in-ear requests. The crate version is 0.1.0.

Source project: [Benjamin-Davies/mcp-server-allenheath-dlive](https://github.com/Benjamin-Davies/mcp-server-allenheath-dlive)

## FAQ

### Can it rename channels or set preamp gain?
The MCP tool list is the eight level calls above. Preamp gain is not one of them. The instructions use "level" for send level and mix master level, and they say technical users usually reserve "gain" for the preamp.

### What happens if the token is left blank?
The auth middleware only rejects a request when `AUTH_TOKEN` is set and the caller did not present that same token. With the variable unset, it calls the handler anyway. The listener is on all interfaces, port 3000.

### Do two mixes share one send level?
The instructions say the volumes for each mix do not interact, and that they are still affected by how loud the incoming signal is. An input that is far too loud in one mix will likely be too loud in another mix with a similar send.
