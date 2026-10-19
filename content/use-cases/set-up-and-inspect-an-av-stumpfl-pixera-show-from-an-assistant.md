---
title: "Set up and inspect an AV Stumpfl Pixera show from an assistant"
slug: set-up-and-inspect-an-av-stumpfl-pixera-show-from-an-assistant
category: "LED/Video"
tools: ["Pixera", "MCP"]
difficulty: Advanced
source_url: https://github.com/LMXtinker/pixera-mcp
labels: ["Experimental"]
summary: "pixera-mcp speaks Pixera's JSON/TCP API so an assistant can inspect a live show, recommend marker placements, and read warp grids out of an .avp file."
---

## What it does

pixera-mcp is an MCP server for AV Stumpfl Pixera. It speaks the Native API as JSON-RPC 2.0 over JSON/TCP(dl), the framing Pixera marks with a `0xPX` delimiter. The README splits the work into three layers. Offline guidance teaches projection mapping, checks parameters and recommends a calibration or warp approach with no Pixera connection at all. Live tools cover the subset the API actually exposes: transport, cues, blackout, calibration triggers, marker writes, MPCDI and project load or save, plus reads of screens, resources, timelines, layers and live inputs. A third path reads a projector's live pose, then uses a lens spec and a mesh you supply to recommend marker positions for what that projector can see.

The same README is clear about the ceiling on API revision 481. Pixera does not expose soft-edge or blend parameters, live warp-grid edits, projector lens data or mesh geometry to this server, so those tools stay advisory. Creating screens, projectors, LED walls, Art-Net or sACN outputs, feeds, fixtures or Live Input resources is also outside the API. Warp grids are recovered offline by parsing the `.avp` show file. That reader is described as reverse-engineered and heuristic for Pixera build 26-1.

The project says it was tested live against Pixera 26.1 R39, API revision 481, including an imported OBJ landing as a 3D model resource and a layer setup that places that model beside the media. It ships 47 tools. It is not an AV Stumpfl product. The Pixera API JSON stays with the local install and is not included in the repo.

## How to set it up

1. For Claude Desktop, install the `pixera-mcp-<version>.mcpb` from the latest GitHub release and enter the Pixera host and port. The extension runs under uv, so a separate Python install is not required. On each start it checks GitHub for a newer release and caches the code. Turn that update off in the extension settings on a show machine that must not change.
2. Or install the Python package (`pip install -e .`, plus the `mesh` extra if you need FBX, GLTF, PLY or STL; OBJ works without it) and register the `pixera-mcp` command with `PIXERA_HOST` and `PIXERA_PORT`.
3. In Pixera, open Settings, then API, and add an access port using JSON/TCP(dl). The server's default port is 1500. The protocol has no authentication. Keep that port on a trusted show network. If calls come back "Access is not authorized.", the README says to turn off Restrict Web Access To Actions That Match Allowlist, or allowlist the methods.
4. `pixera_describe` and offline call checks need Pixera's own `pixera_api.json` on the same machine, or `PIXERA_API_JSON` pointed at that file. Without it, `pixera_call` skips the offline check and relies on `getHasFunction`.
5. Destructive calls (remove, delete, project load or save, mapping import, engine stop) are refused unless you pass `allow_destructive=true`. Timeline names that start with `LE_` are protected from remove and rename unless you change `PIXERA_PROTECTED_PREFIXES`.

Source project: [LMXtinker/pixera-mcp](https://github.com/LMXtinker/pixera-mcp)

## FAQ

### Can it edit a blend or a warp grid live?
No. On API revision 481 the README says soft-edge, blend and live warp-grid editing are not exposed, so those recommendations stay advisory. Warp grids, marker sets and projector pose can be read from the `.avp` file offline with `pixera_import_warp_context`.

### Does the marker tool know the lens?
No. You pass the lens (throw, aspect, shift, resolution) and a mesh path. Pixera's API returns projector pose, not lens data or geometry. `pixera_apply_markers` writes positions with `Pixera.Calibration.setMarkerPositions` into the marker calibration that is already open. The solve itself is still triggered in Pixera.
