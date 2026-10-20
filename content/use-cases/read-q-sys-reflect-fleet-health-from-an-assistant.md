---
title: "Read Q-SYS Reflect fleet health from an assistant"
slug: read-q-sys-reflect-fleet-health-from-an-assistant
category: "Production Ops"
tools: ["Q-SYS Reflect", "MCP"]
difficulty: Intermediate
source_url: https://github.com/Pgarciapg/qsys-reflect-mcp
labels: ["Experimental"]
summary: "qsys-reflect-mcp answers fleet questions from Q-SYS Reflect's public API. All 12 tools are read-only, and a demo campus runs with no API token."
---

## What it does

qsys-reflect-mcp is an MCP server for Q-SYS Reflect Enterprise Manager, QSC's cloud monitoring service for Q-SYS Cores. The README's example question is whether anything is down across a campus. Reflect's public API has no alarms endpoint, so `get_fleet_health` derives health from core, system and item status and ranks issues worst first. Hosts that support MCP Apps also show an inline status card for `get_fleet_health` and `get_system`. Hosts that do not still get the same data as text. `--no-card` turns the card off.

All 12 tools are annotated `readOnlyHint: true`. The README says nothing changes on a Core or System. The only write in the public API, `PUT /systems/{id}/telephony/softphones`, is left out on purpose, as is the deprecated `GET /systems/{id}/events`. Softphone proxy passwords are replaced with `[redacted]`. Media paths that contain `.` or `..`, plain or percent-encoded, are refused before any request.

The tools and the Reflect paths named in the README are: `get_fleet_health` (`GET /cores` and `GET /systems`), `get_system`, `list_cores`, `get_core`, `list_systems`, `list_system_items`, `get_system_item`, `get_core_events`, `browse_core_media`, `list_media_playlists`, `list_softphones`, and `get_audit_events`. Each result puts a one-sentence `summary` first in `structuredContent`.

The server was built from QSC's published OpenAPI spec `qrem-public-api.yaml` (v0.1.1) without access to a live Reflect organization. The README separates what that spec confirms (base URL, Bearer auth, 14 operations, schemas, pagination) from assumptions marked in code. Status codes other than `0` (OK) are mapped with the Q-SYS Designer convention: 1 Compromised and 5 Initializing as warning, 2 Fault, 3 Not Present and 4 Missing as fault. The spec documents only `0`. `Core.uptime` is treated as epoch milliseconds from the spec's example. Reflect documents no rate limits, so this server caps `pageSize` at 500 and times out after 15 seconds. Browsing the media root with an empty path is unconfirmed. `npm run spec:check` re-fetches the spec and fails if an operation changes.

It is not affiliated with QSC. The demo organization and every name, ID and address in it are fictional.

## How to set it up

1. To try it with no token, clone the repo, run `npm install` and `npm run build`, then `node dist/cli.js --demo --http`. The README says MCP is then at `http://localhost:3333/mcp`. `npm run preview` serves the card at `http://127.0.0.1:4747`.
2. A hosted demo copy, also on fictional data and with no auth, is at `https://qsys-reflect-mcp-demo.vercel.app/mcp`. The README says to add that URL as a custom MCP server.
3. For a real organization, create a token under Organization, then API Tokens. It is a 64-character hex string sent as `Authorization: Bearer`. Pass it as `QSYS_REFLECT_API_TOKEN`, or as a file path in `QSYS_REFLECT_API_TOKEN_FILE`. `QSYS_REFLECT_BASE_URL` overrides the default `https://reflect.qsc.com/api/public/v0`.
4. Claude Code, pointed at demo data: `claude mcp add qsys-reflect -- node /path/to/qsys-reflect-mcp/dist/cli.js --demo`. Claude Desktop uses the same `node` command and puts the token in `env`. Leave the token out, or pass `--demo`, to stay on demo data.
5. `node dist/cli.js --http --port 3333` serves Streamable HTTP. It binds to `127.0.0.1` and rejects any other `Host` header. To bind elsewhere you must set `MCP_HTTP_TOKEN`. The README's example also sets `MCP_ALLOWED_HOSTS`. `GET /healthz` reports mode and version. The test script in the README asks for Node 22.18 or newer.

Source project: [Pgarciapg/qsys-reflect-mcp](https://github.com/Pgarciapg/qsys-reflect-mcp)

## FAQ

### Can it mute a room or recall a snapshot?
No. The README says every tool is read-only, and the API's only write was left out. Changing a running design is a different QRC client, not this server.

### Do I need a Reflect subscription to see the shape of an answer?
No. `--demo` and the hosted demo URL serve a fictional campus that matches the published schema. A real token is what switches the same tools onto your organization.

### Has it been run against a live Reflect org?
The README says it was built from the published spec without access to a live organization, and that `npm run spec:check` is the drift check against that spec.
