---
title: "Drive a live TouchDesigner project from the terminal with td-cli"
slug: drive-a-live-touchdesigner-project-from-the-terminal-with-td-cli
category: "TouchDesigner"
tools: ["TouchDesigner", "td-cli", "HTTP"]
difficulty: Intermediate
source_url: https://github.com/0dot77/td-cli
summary: "A Go CLI talks to a live TouchDesigner project over HTTP on port 9500, so an agent can inspect, wire, and roll back operators."
---

## What it does

td-cli is a Go command-line tool that talks to a TouchDesigner project that is already open. The README calls it an execution layer: an agent such as Claude or Codex decides what to build, and td-cli does the work inside the live session. The same commands are there for an artist who wants to inspect a network, batch-set parameters, or iterate a shader from the terminal.

The project side is `TDCliServer.tox`. Drop that component in and it runs a Web Server DAT plus a Python handler. The default port is 9500. The README says the HTTP server listens on 127.0.0.1. The connector writes heartbeat files under `~/.td-cli/instances/`, and td-cli uses those files to find running projects. When more than one project is open, `--port` or `--project` picks one.

The command list covers the usual network edits. `ops` lists, creates, and deletes operators. `connect` and `disconnect` wire them. `par get` and `par set` read and write parameters. `exec` runs Python inline or from a file. `dat read` and `dat write` move DAT text. `screenshot` saves a TOP as a PNG. `shaders apply` puts a GLSL template on a GLSL TOP. `pop av` builds a POP audio-reactive scene under a container you name, and a preview container wired to that output.

The harness is the loop the README names for agent work: observe, apply, verify, then roll back. Apply takes a JSON patch. The README is specific about scope. Do not edit `/project1/TDCliServer` during a normal artist or agent workflow, and do not point harness apply or rollback at a path that contains `TDCliServer`. Use a child COMP, such as `/project1/myScene`, not `/project1`.

`td-cli init` writes `CLAUDE.md`. The command table also lists `AGENTS.md`. The README says the CLI itself is not Claude-specific, and that Codex and other agents can run the same commands. Set `TD_CLI_TOKEN` to the same value in the shell and in the TouchDesigner process environment before launch when you want HMAC checks on every request. Without that token, any process on the machine can call the API, including `exec`. The license is MIT.

## How to set it up

1. Install a release binary, or build it. The README's Go install line is `go install github.com/0dot77/td-cli/cmd/td-cli@latest`, and it asks for Go 1.26.1 or newer if you build from source. Open the project and drag `tox/TDCliServer.tox` into the root network. The component has to be named `TDCliServer`, with `webserver1` active on port 9500.
2. Run `td-cli status`. If several projects are open, `td-cli instances` lists them. Then `td-cli --port 9500 status`, or `td-cli --project` with the `.toe` path, selects one. `td-cli doctor` checks the heartbeat directory, the port, and the connector protocol.
3. From the project folder, run `td-cli init` and point the agent at that folder. Have it call td-cli for network edits. Leave `/project1/TDCliServer` alone.
4. Read before you write. `td-cli ops list /project1` shows the network. Create and wire operators outside the connector. `td-cli screenshot` on the output TOP confirms it is rendering.
5. For an agent loop, observe a child COMP, apply a patch whose target is that child, then verify. `td-cli harness rollback` puts back a recorded change. Do not use `/project1` as the harness scope when `TDCliServer` lives under it.
6. On a shared machine, or anywhere untrusted code runs next to TouchDesigner, set `TD_CLI_TOKEN` in both environments before TouchDesigner starts.

Source: [0dot77/td-cli](https://github.com/0dot77/td-cli) and the [Derivative forum post](https://forum.derivative.ca/t/td-cli-a-terminal-interface-for-td-built-for-artists-and-ai-agents/979764).

## FAQ

### Can the agent edit the connector that td-cli talks to?
The README says to treat `TDCliServer` as the installed connector and to avoid editing `/project1/TDCliServer` in a normal workflow. Harness apply and rollback should use a child COMP that does not contain that component.

### Does the HTTP port ask for a password?
Only when `TD_CLI_TOKEN` is set in the shell and in the TouchDesigner process before launch. The README says that shared secret turns on HMAC checks. The server binds to localhost. Without the token, any local process can run Python inside TouchDesigner.

### What does `td-cli init` write?
A `CLAUDE.md` file with command examples. The command table also lists `AGENTS.md`. The README says other agents can use the same commands, or adapt that guidance into their own instruction file.
