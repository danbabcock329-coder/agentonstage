---
title: "Build Q-SYS designs headlessly from an assistant"
slug: build-q-sys-designs-headlessly-from-an-assistant
category: "Audio"
tools: ["Q-SYS Designer", "MCP"]
difficulty: Advanced
source_url: https://github.com/nerif-tafu/qsys-designer-mcp
labels: ["Experimental"]
summary: "qsys-designer-mcp writes a real .qsys file through Designer's own libraries, reads the wiring back, and can emulate that design and poke controls over QRC."
---

## What it does

qsys-designer-mcp is an MCP server that builds Q-SYS designs. You describe a system and it writes a `.qsys` file through Designer's own libraries, with no Designer window open for the build. The README says a JSON spec goes in and a file comes out in about a second. It can place components by class name, Core and inventory I/O (Flex, Mic/Line, USB audio and HID, Software Dante, AES67), wires by pin number or pin name, stored control values, Text Controllers with your Lua and custom controls, and multi-page schematics and UCIs.

`probe_components` reports a component class's properties, pins and controls, and what I/O a Core offers, so the assistant is not guessing names. `read_design` reads a file it did not build: components, properties, stored values, pins, wires and UCIs. `check_design` follows the real wiring, for questions such as whether mic 1 reaches the USB send or whether an echo-canceller reference carries the far end. Emulate opens a test copy with every block visible to QRC, then reads and sets controls. `calibrate_values` measures the position the engine actually loads for each stored value and fixes the file if needed.

The README says it works with Designer 9.x and 10.x and has been tested with 9.13.1 and 10.3.0. Files are read with the version that saved them. New builds use the newest install unless `QSYS_DESIGNER_DIR` picks one. The project is unofficial. It is not made, endorsed or supported by QSC, and the README says QSC's Designer licence may restrict this kind of use of undocumented internals. No QSC code is in the repo. A Designer update can break it.

The same README is explicit that QRC writes are live. Against the emulator that is the test copy. If `QSYS_QRC_HOST` points at a real Core, `qrc_set_control` and `qrc_set_named_control` change that system.

## How to set it up

1. You need Windows 10 or 11, Q-SYS Designer 9.x or later installed normally, and Python 3.11 or newer (or uv). Designer 10.x brings its own .NET 8 runtime.
2. In Claude Code, add it with `claude mcp add qsys -- uvx --from git+https://github.com/nerif-tafu/qsys-designer-mcp qsys-designer-mcp`. The README says that without uv on PATH the client reports "Connection closed". `winget install astral-sh.uv` is the install it names, then restart the terminal or Claude.
3. For Claude Desktop, add an MCP server whose command is `uvx` and whose args are `--from`, `git+https://github.com/nerif-tafu/qsys-designer-mcp`, and `qsys-designer-mcp`. `pip install git+https://github.com/nerif-tafu/qsys-designer-mcp` is the path without uv. Point the client at the `qsys-designer-mcp` command.
4. Optional environment variables in the README: `QSYS_DESIGNER_DIR` to force a Designer folder, `QSYS_QRC_HOST` and `QSYS_QRC_PORT` (default `127.0.0.1:1710`, the emulator), `QSYS_QRC_USER` and `QSYS_QRC_PASSWORD` for a Core with access control, and `QSYS_MCP_CACHE` for the helper, measurements and test copies (default `%LOCALAPPDATA%\qsys-designer-mcp`).
5. Ask it to read `qsys://spec-format`, build a new file, run `check_design`, then emulate. `build_design` will not replace an existing file unless it is told to. It will not discard unsaved Designer changes unless `discard_changes=True`. `open_design` and `emulate_design` close the running Designer first, because Designer opens every file in its own window.

Source project: [nerif-tafu/qsys-designer-mcp](https://github.com/nerif-tafu/qsys-designer-mcp)

## FAQ

### Does it edit a design that is already running on a Core?
The build path writes a `.qsys` file. Emulation runs a test copy in Designer. Pointing `QSYS_QRC_HOST` at a Core is separate: the README says the QRC set tools then change that live system.

### Can emulation prove the audio path?
No. The README says emulation has no audio, so it cannot prove signal flow, AEC convergence, or that a gate or limiter acts. Signal paths are checked from the wiring. USB HID call control cannot be tested in emulation either.

### What is still outside the spec?
The limits section says snapshots, named controls, signal-name blocks and plugins are not part of the spec yet, and third-party plugins cannot be placed. Designer must be in English, because menu and dialog names are what the UI automation presses. The server does not move the mouse or type.
