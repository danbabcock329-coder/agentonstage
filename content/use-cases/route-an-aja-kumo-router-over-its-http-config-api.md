---
title: "Route an AJA KUMO router over its HTTP /config API"
slug: route-an-aja-kumo-router-over-its-http-config-api
category: "LED/Video"
tools: ["AJA KUMO", "HTTP"]
difficulty: Intermediate
source_url: https://github.com/bitfocus/companion/issues/407
labels: ["Commercial product"]
summary: "AJA KUMO sets 1-based crosspoints with HTTP GET /config on port 80. Read labels and routes first, and keep the unauthenticated interface on a trusted network."
---

## What it does

AJA's KUMO routers answer an HTTP `/config` interface. Riedel's hi manual for the AJA KUMO compatible router says that interface discovers the matrix, reads and writes labels, monitors crosspoints, and sets routes. The default port is 80. Riedel configures that connection as plain HTTP, with no encryption in transit and no credential fields in hi. The same page tells you to keep the unauthenticated interface on a trusted management network.

The request that takes a crosspoint is an HTTP GET, documented on a Bitfocus Companion module request rather than as a Grass Valley native-protocol command. The comment writes it as `/config?action=set&configid=0&paramid=eParamID_XPT_Destination[DST 1-64]_Status&value=[SRC 1-64]`. Destination and source numbers start at 1. The same comment caps both at the router's own count, and it names 16, 32, or 64 depending on the model. A take of destination 1 from source 2 is therefore:

```
GET /config?action=set&configid=0&paramid=eParamID_XPT_Destination1_Status&value=2
```

A salvo uses the same GET with `paramid=eParamID_TakeSalvo` and `value` set to the salvo id. The Companion comment records that form as `/config?action=set&configid=0&paramid=eParamID_TakeSalvo&value=[ID]`.

Riedel reads source and destination counts, reads current routes, and reads source and destination labels on this interface. Label writes from hi update the primary label line only. The secondary line is not writable there. hi polls a KUMO change-event interface for crosspoint and label changes. That integration does not expose destination locks or salvos, and it does not do engineering network setup or firmware updates. Those stay on the KUMO web interface and AJA's own update utility. Riedel's tested coverage is the KUMO range, and the model list on that page is KUMO 1604, 1616, 1616-12G, 3232, 3232-12G, 6464, and 6464-12G. The KUMO CP and CP2 are control panels, not routers.

If the router is password protected, Riedel says AJA documents a login cookie and that hi sends no login. Disable the password, or use a client that can present that cookie. AJA's support download "AJA KUMO REST Automation Ver 4.7.1", released 2024-03-14, is a set of REST automation scripts for developers. The page says the scripts are for people with web programming or scripting skills, and that they are not intended for the general user.

## How to set it up

1. Put the KUMO on a trusted management network. Riedel uses outbound HTTP to port 80 and says the interface is unauthenticated unless the router itself is password protected. Do not publish port 80 beyond that network.
2. Read before you take. Use the `/config` interface to read source and destination counts, labels, and the current crosspoints, which is what Riedel's integration does. Confirm the destination number and the source number with the operator. Numbers on this API start at 1, and they stop at that router's own count.
3. Take one crosspoint with HTTP GET, `configid=0`, and `paramid=eParamID_XPT_Destination<D>_Status`. For destination 1 from source 2 the query is `action=set&configid=0&paramid=eParamID_XPT_Destination1_Status&value=2`. Read the route back before you treat the output as changed.
4. Recall a salvo only when the operator names the id. The Companion comment uses `paramid=eParamID_TakeSalvo&value=<N>`. Riedel's hi integration does not expose salvos, so a Companion-style GET is a different client from hi.
5. If the web UI asks for a password, the router expects the login cookie AJA documents. A client that never logs in will not route that unit. Leave label edits, destination locks, network setup, and firmware updates out of an unattended session.

Source: [Companion issue 407](https://github.com/bitfocus/companion/issues/407) (HTTP GET syntax, 30 April 2019), [Riedel hi 3.0, AJA KUMO compatible router](https://manuals.riedel.net/en/hi/v3.0/aja-kumo-compatible-router), and [AJA KUMO REST Automation 4.7.1](https://www.aja.com/support/item/9616).

## FAQ

### Does the destination number start at zero?
No. The Companion comment starts destination and source ids at 1, up to the output and input count of that KUMO. The comment's examples of that count are 16, 32, and 64.

### Is a salvo the same call as a crosspoint?
The salvo uses the same `/config` GET and the same `configid=0`, with `paramid=eParamID_TakeSalvo` and the salvo id as `value`. A single crosspoint uses `eParamID_XPT_Destination<D>_Status` and the source id as `value`.

### What if the router has a password?
Riedel says AJA documents a login cookie for a password-protected KUMO, and that hi does not send one. Disable the password for a client that cannot log in, and keep port 80 on a trusted network either way.
