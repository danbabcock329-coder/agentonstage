# One-off pass (Oct 2026): rewrites body of existing entries with tool-specific how-to/FAQ from each README.
import os,re,glob
D={}
def e(repo,steps,faqs,summary=None,difficulty=None): D[repo]=(steps,faqs,summary,difficulty)
e("8beeeaaat/touchdesigner-mcp",[
"Install TouchDesigner and enable its WebServer DAT-based API component from the project's Installation Guide (docs/installation.md) — the MCP server talks to TD through it.",
"Add the `touchdesigner-mcp-server` package (published on npm) to your MCP client, or simply tell your agent \"Set up https://github.com/8beeeaaat/touchdesigner-mcp\" as the README suggests.",
"Ask the agent to list nodes in /project1, then create and wire a small TOP chain to confirm round-trips.",
"Before updating, follow the notes on the repo's latest release page."],[
("How does the agent reach TouchDesigner?","Through TouchDesigner's built-in web server: the MCP server sends requests to an API component running inside your .toe."),
("Is there a demo?","Yes, the README links a YouTube walkthrough of an agent building a particle system in TD.")])
e("dylanroscover/Embody",[
"Download the Embody .tox from the repo's /release folder and drag it into your project.",
"Walk through the Setup Wizard: choose how much autonomy the AI (Envoy) gets, which assistant to connect, permissions and what to externalize to disk.",
"Nothing is applied until the wizard's final click, so you can re-run it any time from the Setup Wizard pulse.",
"Use Check for Update (or Auto-Update) on the About page to stay current; settings survive updates."],[
("Does Embody change my project immediately?","No. The wizard collects choices first and only applies them on the last step."),
("Where is the full documentation?","At dylanroscover.github.io/Embody, linked from the README.")])
e("TouchDesigner/TDMCP",[
"Drop the TDMCP component into your project; the server runs inside TouchDesigner (default http://127.0.0.1:13316/mcp).",
"On the component's MCP page pick your client under Install For (Claude Code by default) and an Install Scope.",
"Copy the generated Add MCP command (e.g. `claude mcp add --transport http --scope local touchdesigner http://127.0.0.1:13316/mcp`) and run it in your project folder, then pulse Install Skills.",
"Run `claude mcp list` to confirm it shows Connected, then ask the agent about your network."],[
("Which clients work?","Claude Code, Codex, Antigravity, OpenCode and any client that speaks streamable-HTTP MCP."),
("What can the agent do?","26 tools: create and wire operators, set parameters, read DATs, inspect runtime values and look up TD docs. It is labelled beta.")])
e("Pantani/tdmcp",[
"Follow the no-terminal install guide on pantani.github.io/tdmcp (the npm package is @dpantani/tdmcp).",
"Run the TouchDesigner bridge in your project so the MCP server can reach TD.",
"Start with the \"Your first visual\" guide: describe a look in plain language and let the agent build the network.",
"Borrow prompts from the Prompt cookbook and Recipe gallery once the basics work."],[
("Does it need coding?","No. The project is designed so you describe the visual and the agent builds the node network."),
("Can it run shows?","The docs describe an \"AI-Controlled Party\" pattern, but it is a rehearsal proof of concept and keeps hazardous effects operator-only.")])
e("bottobot/touchdesigner-mcp-server",[
"Install globally: `npm install -g @bottobot/td-mcp`.",
"Add it to your MCP settings with command `npx` and args `[\"@bottobot/td-mcp\"]`.",
"Ask your assistant about specific operators or Python API calls while you build; answers come from bundled docs."],[
("Does it control TouchDesigner?","No. It serves documentation (operators, Python API, tutorials) from local JSON files. Pair it with a control MCP if you need that."),
("Does it need internet?","No network requests are needed; all docs are local.")])
e("olegchomp/TouchDiffusion",[
"Easiest route: download the portable build linked in the README, run webui.bat and use the install & update tab.",
"Manual route: install TouchDesigner 2023, Python 3.11, Git and CUDA Toolkit 11.8, then follow the README or its YouTube tutorial.",
"Build an engine for your model (the README benchmarks sd-turbo at 512x512) and load the component in TD.",
"Feed a live TOP (camera, LED content) in and route the output to your media server."],[
("How fast is it?","README benchmarks: about 55–60 FPS on an RTX 4090 and 16 FPS on an RTX 3060 12GB at 512x512."),
("Is it stable?","The author marks it as early testing that may change significantly.")],difficulty="Advanced")
e("olegchomp/TDComfyUI",[
"Install ComfyUI and the ComfyUI Nodes for External Tooling.",
"Add the TDComfyUI.tox release to your project and run Re-init on its Settings page.",
"In ComfyUI enable dev mode options, build a workflow and Save (API Format).",
"Load that JSON into a Text DAT, connect it to TDComfyUI's input, set parameters and press Generate."],[
("How do I send a TD image to ComfyUI?","Use the \"Load Image (Base64)\" node in your workflow and point it at a TOP on the Workflow page."),
("Is there a tutorial?","The README links a YouTube video on connecting everything to Stable Diffusion.")])
e("JiSenHua/ComfyUI-TD",[
"Install the node via ComfyUI-Manager (search ComfyUI-TD), or git clone it into ComfyUI/custom_nodes.",
"Add the matching TouchDesigner component to your project.",
"Add the ComfyUI-TD output nodes to your workflow and run it; results stream into TD."],[
("What can it send?","Images, video, point clouds (including Gaussian Splatting PLY) and audio."),
("Can TD install the nodes for me?","Yes, the ComfyUI2TD.tox component has an InjectFile option that copies the nodes into custom_nodes.")])
e("olegchomp/TDDepthAnything",[
"Install Python 3.11 and CUDA Toolkit 11.8 (tested with TD 2023.11340).",
"Download the repo, set PYTHON_PATH in accelerate.bat and run it to build the TensorRT engine.",
"Load the component in TD and feed it a camera TOP to get a depth map."],[
("Can I share a Python environment with TouchDiffusion?","Yes, the README explains copying the files into the TouchDiffusion folder and running accelerate.bat there."),
("Which models?","Depth Anything v1 and v2.")])
e("torinmb/mediapipe-touchdesigner",[
"Download release.zip from the Releases page and open MediaPipe TouchDesigner.toe.",
"Use MediaPipe.tox from /toxes; tick \"Enable External .tox\" when dragging it into a new project to keep file size down.",
"Pick your webcam in the component and enable the models you need (face, hands, pose, etc.).",
"Use the example toxes to read tracking data into CHOPs that drive your visuals."],[
("Does it need a GPU?","It's GPU accelerated and runs inside TD with no extra hardware beyond a webcam."),
("Which models are supported?","All MediaPipe vision models except Interactive Segmentation and Image Embedding.")])
e("ojrgb/appletd",[
"Download appletd.tox and drop it into your project.",
"Press Install on the General page and wait for Installstate to read Installed, then switch Active on.",
"Optionally point Sidecarpython at your own Python 3.11+ venv; don't use TouchDesigner's bundled Python."],[
("Does it work on Windows or Intel Macs?","No, Apple Silicon only, because it relies on the Neural Engine."),
("Why a sidecar process?","The author says it is 28x faster than inline inference and avoids macOS library-validation problems.")])
e("anteriovieira/osc-mcp-server",[
"Install Node.js 18+, then `npm install` and `npm run build` in the repo.",
"Set OSC_HOST to the console's IP and OSC_PORT to 10023 (the defaults are 192.168.1.70 and 10023).",
"Add `node /path/to/dist/index.js` to your Claude Desktop config with those env vars, then restart Claude.",
"Ask for read-only things first (fader levels, mute states) before letting it change anything."],[
("What can it change?","Faders, mutes and pan for channels, buses, aux, matrix and main LR."),
("Which consoles?","Behringer X32, Midas M32 and similar OSC mixers.")])
e("bulyaki/ConsoleMCP",[
"Pick an implementation (C++20 or TypeScript/Node); both use the same profile format.",
"Select or edit a JSON mapping profile for your console, then set up the console's OSC network per the README.",
"Run the smoke test, then connect it to Claude or ChatGPT.",
"Use console.snapshot before experimenting so you can console.restore."],[
("Why profiles?","Each command in the profile becomes an MCP tool, so you can support new consoles by editing JSON."),
("Is there a raw escape hatch?","Yes, console.raw_osc. The README has a section on security and operational boundaries; read it before using it live.")])
e("elisha-rudenkov/x32-mcp-server",[
"Clone the repo, `npm install` and `npm run build`.",
"Find the mixer IP under Setup → Network on the console.",
"Add the server to your MCP config with OSC_HOST=<mixer IP> and OSC_PORT=10023, then restart the client.",
"See INSTALLATION.md for Cline, Continue.dev and other clients."],[
("What does it add over the original?","Scene audits, signal-flow tracing, routing repair, EQ, FX algorithm swaps and meter snapshots."),
("Claude Desktop from the Microsoft Store?","The README gives a different config path for the MSIX install.")])
e("pmaillot/X32-Behringer",[
"Browse the repo for the utility you need; X32_Command is a command-line tool for sending and reading X32 OSC.",
"Build with the C toolchain the README describes (MinGW/Eclipse on Windows) or use the author's precompiled releases.",
"Use the tools and the OSC notes as a reference when you script or wrap the console for an agent."],[
("Who maintains it?","Patrick-Gilles Maillot, who has published X32 utilities since 2014."),
("Is it an AI tool?","No. It's the protocol groundwork that agent integrations rely on.")])
e("audiopump/x32-proxy",[
"Install Node.js, then `npm install -g x32-proxy`.",
"Run `x32-proxy --udp <bind address> --target <mixer IP>`, for example bound to a VPN interface.",
"Point X32 Edit, a web app (WebSocket mode) or an agent tool at the proxy instead of the console."],[
("Which mixers?","X32/M32 series and X-Air/MR series (XR12, XR16, XR18, MR18 and others)."),
("Why use it?","For control over a VPN or IPv6, or from browser apps via WebSockets.")])
e("pmaillot/wapi",[
"Read the GitHub README; the library itself is no longer hosted there.",
"Download wapi and its demo programs from the author's site (x32ram.com/wapi) and the API docs from the linked Drive file.",
"Link the C library into your own tool or agent wrapper to read and set WING parameters."],[
("Why isn't the code on GitHub?","The author moved it off GitHub over a GPL licensing concern."),
("Are there ready-made tools?","Yes, the author lists precompiled WING utilities on his Google Sites page.")],
summary="A C API for Behringer WING consoles. The GitHub repo now points to the author's own download site for the library.")
e("OpenMixerProject/OpenMixerControl",[
"Start from the OpenX32 or OpenWING project pages, which explain the custom Linux firmware these consoles run.",
"Build OpenMixerControl using the provided Docker workflows (XM32, WING or PC/SDL2 targets).",
"Try it on the PC/SDL2 build before going anywhere near a real console."],[
("Does this replace the console firmware?","OpenX32 and OpenWING are custom Linux firmware; treat them as experimental and never on a show desk."),
("Where's the community?","On the OpenMixerProject Discourse, linked from the README.")])
e("ahujasid/ableton-mcp",[
"Install uv (`brew install uv` on macOS).",
"Add the server to Claude Desktop (command `uvx`, args `[\"ableton-mcp\"]`) or paste `uvx ableton-mcp` into Cursor's MCP settings.",
"Install the Ableton Remote Script with `uvx --from ableton-mcp ableton-mcp-install-script`, then select it in Live.",
"Ask it to build tracks or clips for your playback session, then check them by ear."],[
("Can I run it in two apps at once?","No. The README warns to run only one instance (Cursor or Claude Desktop)."),
("Is there a setup video?","Yes, linked at the top of the README.")])
e("Simon-Kansara/ableton-live-mcp-server",[
"Install AbletonOSC as a control surface in Live.",
"Clone the repo and run `uv sync`.",
"Start the OSC daemon with `uv run osc_daemon.py`, then register the MCP server in your client."],[
("What does it map?","It exposes the available AbletonOSC addresses as MCP tools."),
("Requirements?","Python 3.8+, python-osc, fastmcp and uv.")])
e("Church-Cap/Live-Church-Captions",[
"Install Church Cap from the latest GitHub release (START_HERE.md is the non-technical guide).",
"Feed it one audio feed from the desk or an audio interface.",
"Share the QR code so guests can read captions on their phones over local Wi-Fi, and add the OBS browser source for the stream."],[
("Does it need the cloud?","No. It is local-first and serves captions over the local network."),
("Only for churches?","It's built for services, but any single-feed event (keynotes, panels) works the same way.")])
e("Pahegi/ma3-mcp",[
"`poetry install` the Python dependencies and set your MA3 path in .env.",
"Run ./deploy.sh or copy plugin/mcp_server.lua into the MA3 plugins folder.",
"In MA3 go to Menu → Plugins, start the MCP Server plugin, then configure Claude Desktop or VS Code Copilot.",
"Test on onPC, never on a show console."],[
("Is it production ready?","No. The README labels it a prototype and proof of concept."),
("What can it do?","Run MA3 commands, control fixtures, store cues and run playbacks.")])
e("DD-cLD/The3-MCP",[
"Without MCP: open concepts/INDEX.md and search it for terms like \"timecode\" or \"import failed\".",
"For agents: follow docs/AGENT_QUICKSTART.md to install the local MCP server (Python 3.12+) and run its offline protocol check.",
"Set up the console side per server/README.md, then register the server in Codex or Claude Desktop."],[
("What makes the corpus different?","Every console claim was observed on a live grandMA3 and version-stamped by a working lighting director."),
("Can I reuse the skills?","Start with skills/ma3-assistant. The README warns that the show-specific skills need your own project data.")])
e("Nairolf138/Eos_MCP",[
"Clone, `npm install`, and copy .env.example to .env.",
"On Eos or Nomad enable OSC RX and TX under Setup → System → Show Control → OSC, and match the ports in .env.",
"Start in observation mode: `EOS_READ_ONLY=true EOS_STRICT_MODE=true npm run start:dev`.",
"Run eos_readiness_check before any programming or playback."],[
("How safe is it?","It has read-only and strict modes, tool allow-list profiles and an audit log."),
("What can it reach?","Over 100 tools: cues, channels, groups, palettes, effects, faders, patch, Magic Sheets and more.")])
e("chienchuanw/gma2-plugins",[
"Read the Getting Started section for prerequisites and installation into grandMA2.",
"Load a plugin on onPC first and run it against a test show.",
"Use the plugin-development notes if you want an AI to generate new plugins in MA2 command syntax."],[
("Why does this exist?","MA's plugin docs don't publish the Lua API, so the repo collects community knowledge and AI-assisted plugins."),
("Which console?","grandMA2, not MA3.")])
e("prmichaelsen/dmx-mcp",[
"Install OLA and start it with `olad`; connect an Enttec USB DMX (or other OLA interface).",
"Install Node.js 20+, then `npm install` and `npm run build`.",
"Register the server with your agent and describe fixtures, scenes and cues in plain language."],[
("What does the agent handle?","Fixture patching, scene creation, cue sequencing and live playback."),
("How mature is it?","Early. The repo is small and organized around a development methodology, so test thoroughly.")])
e("groundroot/lightkey-mcp",[
"In Lightkey go to Settings → External Control and check Enable OSC (default 127.0.0.1:21600 UDP).",
"Clone, `npm install`, `npm run build`.",
"Register with `claude mcp add lightkey -- node <path>/dist/index.js`, adding LIGHTKEY_HOST/PORT env vars for a remote Mac."],[
("What can it do?","Cues, playback, palettes, fixture overrides, master/blackout and BPM, plus raw OSC."),
("Language?","The README is in Korean; the commands above are the key steps.")])
e("guac395/qlc-plus-mcp",[
"Clone, install and `npm run build`.",
"Launch QLC+ with its web interface: `qlcplus -w` (macOS: /Applications/QLC+.app/Contents/MacOS/qlcplus -w).",
"Add the server to Claude Desktop with QLC_HOST=localhost and QLC_PORT=9999, then restart."],[
("How many tools?","25, covering scenes, DMX channel writes, widgets, workspace generation and effect sequencing."),
("Is there a non-Claude option?","Yes, a standalone Gemini CLI agent under src/agent.")])
e("OpenLightingProject/ola",[
"Install OLA from your package manager or build from source.",
"Start the daemon with `olad` and open the web UI (port 9090 by default) to patch devices to universes.",
"Point your scripts or agent tools (such as dmx-mcp) at OLA instead of talking to interfaces directly."],[
("Which protocols?","DMX512 over USB interfaces, Art-Net, sACN/E1.31 and others."),
("Is it maintained?","It's a long-running open project. Check the repo for recent releases.")])
e("drohi-r/resolume-mcp",[
"Clone, `uv sync`, and run `uv run python -m resolume_mcp` (it connects to localhost:8080).",
"In Resolume enable the HTTP API under Preferences → OSC/HTTP.",
"For remote rigs set RESOLUME_HOST and add it to RESOLUME_ALLOWED_HOSTS; use LAN or WireGuard, never the public internet."],[
("What does it cover?","About 200 tools for composition, playback, Advanced Output and show recovery over REST, WebSocket and OSC."),
("Does it work with other gear?","The author also publishes grandMA2, MADRIX and Companion MCPs.")])
e("Tortillaguy/resolume-mcp",[
"`pip install git+https://github.com/Tortillaguy/resolume-mcp.git`.",
"Add `resolume-mcp-code` to your MCP config with RESOLUME_HOST set to the Resolume machine.",
"Ask for things like \"fade out layer 1, connect clip 3 on layer 2\"; it batches them over WebSocket."],[
("Which clients?","Claude Desktop, Claude Code, Cursor, Windsurf and other MCP clients."),
("Arena or Avenue?","Both.")])
e("ElytaM/companion-module-resolume-arena-osc-unofficial",[
"Download the .tgz from the releases and use Companion's Install from file, or unzip into %APPDATA%\\companion\\modules on Windows.",
"In Arena open Preferences → OSC and enable input and feedback.",
"In Companion add the connection with the Arena IP, port 7000, and feedback port 7001."],[
("Why use it with AI?","Companion buttons and triggers become an action layer that agents (e.g. via Stream Deck MCP) can press."),
("Language?","The README is in Russian.")])
e("medcelerate/disguise-mcp",[
"Install the single binary (PowerShell one-liner on the disguise server, or the install.sh / Releases on macOS/Linux).",
"Copy config.example.yaml to config.yaml and set the disguise host.",
"Run `disguise-mcp --config config.yaml`; MCP is served on port 8090 and an admin console on 8091."],[
("What can the agent do?","Drive the timeline transport, read show state and call any Designer API endpoint."),
("Security?","It listens on 0.0.0.0 by default, so keep it on an isolated show network.")])
e("cumulo-autumn/StreamDiffusion",[
"Create a Python 3.10 environment (conda or venv).",
"Install the PyTorch build matching your CUDA version, then install StreamDiffusion from the repo.",
"Optionally build TensorRT acceleration, then run the realtime examples.",
"For live shows, use a TD wrapper like TouchDiffusion rather than raw scripts."],[
("Is it a show tool?","It's a research pipeline that most real-time live-visual integrations build on."),
("Good fit for a 5090?","High-VRAM NVIDIA cards are the target. The README's benchmarks are on RTX 4090-class GPUs.")])
e("ironystock/agentic-obs",[
"`go install github.com/ironystock/agentic-obs@latest` or build from source with `make build`.",
"In OBS open Tools → WebSocket Server Settings, enable it (port 4455) and set a password.",
"Run agentic-obs in MCP server mode and register it with your client."],[
("How many tools?","81, across scenes, sources, recording, streaming and more."),
("Can it start a stream on its own?","Yes, so restrict which tools your client allows during a live show.")])
e("Scissorfilms/mcp-server-vmix",[
"Clone and `npm install` (this builds automatically).",
"Enable vMix's Web Controller (Settings → Web Controller, port 8088).",
"Register it: `claude mcp add vmix -s user -e VMIX_HOST=<ip> -e VMIX_PORT=8088 -- node $PWD/dist/index.js`."],[
("What's covered?","About 70 vMix functions: switching, overlays, recording, audio, titles, replay and scripting."),
("Can I see which tools are destructive?","Yes, tools carry readOnlyHint and destructiveHint annotations.")])
e("guycochran/atem-mcp-server",[
"`npm install` and `npm run build` in the repo.",
"Add the server to Claude Desktop with the full node path and ATEM_HOST set to your switcher's IP.",
"Restart Claude, then try \"show me the current switcher status\" before any cuts."],[
("Local only?","No. It supports local stdio and remote Streamable HTTP with OAuth 2.0."),
("Typical requests?","\"Put camera 2 on program and dissolve\", \"run macro 3\" and start/stop streaming.")])
e("chongdashu/unreal-mcp",[
"Install the Unreal plugin and the Python MCP server per the README.",
"Connect Cursor, Windsurf or Claude Desktop.",
"Use it for previs and content builds, not for an LED volume during a shoot."],[
("Production ready?","No. The README marks it experimental and warns of breaking changes."),
("Why for live events?","For fast previs of stages and LED content in Unreal.")])
e("arvindjuneja/subai",[
"Windows: run INSTALLER.bat then SubAI_Start.bat. Mac (Apple Silicon): `pip install -e './backend[mlx]'` and ./start.sh.",
"Open the control panel at http://127.0.0.1:3000, set the pipeline to whisper and choose languages.",
"Connect the mic in the Stream tab and add the OBS overlay from the Monitor tab."],[
("Does it translate?","Yes, live captions can be shown in a different language from the speaker."),
("Hardware?","CUDA on Windows, MLX on Apple Silicon, or Linux.")])
e("bitfocus/companion",[
"Download Companion from bitfocus.io/companion (user guide at companion.free).",
"Add connections for your gear (700+ modules) and build button pages.",
"Use Triggers and OSC/HTTP remote control so other systems, including agents, can press buttons."],[
("Do I need a Stream Deck?","No. There's a built-in emulator, a web page for touch screens and OSC/TCP/UDP/HTTP/WebSocket/Art-Net triggers."),
("Cost?","Free and open source; donations go via Open Collective.")])
e("MarcheKEN/Qlab-MCP",[
"Install the FastMCP server per the README and point it at QLab 5's OSC port.",
"Start read-only (the default) and use inspection tools to browse workspace settings and cues.",
"Enable write mode only if you need to; writes are dry-run-first and need confirmation."],[
("Can it fire cues?","No. By design it has no playback tools or raw-protocol escape hatch."),
("How many tools?","43 read-only tools and 5 gated write tools.")])
e("magichao326/qlab-mcp",[
"Clone, create a venv and `pip install -r requirements.txt`.",
"Add the venv's python and server.py to your Claude Desktop or Claude Code config.",
"Set QLAB_HOST, QLAB_SEND_PORT (53000), QLAB_RECV_PORT (53001) and QLAB_PASSCODE if needed."],[
("Can it GO?","Yes. It can start/stop cues and send raw OSC or AppleScript, so the README warns about unattended tool calls in a live show."),
("Remote Mac?","Set QLAB_HOST to that Mac's IP.")])
e("miroir-os/gabin",[
"Download the latest release from the one-click-studio releases page.",
"Connect your audio API and OBS (or Companion).",
"Map each microphone to a camera shot so the active speaker drives switching."],[
("Known issues?","The README notes ASIO doesn't work with the XR32 mixer."),
("Is there a CLI?","Yes, with debug and no-auto-open flags.")])
e("phuvf/oscpoint",[
"Download the add-in from oscpoint.com and install it in PowerPoint on Windows.",
"Add the OSCPoint Companion module, or use any OSC client.",
"Map next/previous, go-to-slide and media actions to buttons or show-control cues."],[
("Mac support?","No, it's Windows PowerPoint only."),
("Feedback?","Yes. Current slide and other states are sent back for button feedback.")])
e("greenhouselabs/cuescope-mcp",[
"`claude mcp add cuescope -- npx -y @greenhouselabs/cuescope-mcp` (or the Codex equivalent).",
"For vMix on another machine add `-e VMIX_HOST=<ip>`.",
"Ask it to explain current vMix state and draft automation plans for review."],[
("Will it switch my show?","Not by default. It reads state and doesn't switch inputs, run scripts, start streams or change audio."),
("Why use it?","Safe production checks and reporting during shows.")],difficulty="Beginner")
e("tomhillmeyer/companion-dashboard",[
"Download the desktop app (Mac, Linux, Windows) or run the install script on a Raspberry Pi or NUC.",
"Connect to your Companion instance and choose the variables to display.",
"Put it on a backstage or FOH screen for timers and states."],[
("Pi 5?","Not supported yet according to the README."),
("Remote config?","The Linux server build starts a web server for remote configuration.")])
e("tannerharris0n/cue-list-generator",[
"`npm install`, then run `npm run dev` and `node server.cjs` (or `npm run build` for production).",
"Set ANTHROPIC_API_KEY, or let users bring their own key; use AUTH_PASSWORD to gate access.",
"Enter the event timeline, rig description and look intent to get a starter cue stack."],[
("Which consoles?","Eos, MA2/MA3, Avolites, Hog 4, ChamSys and Onyx numbering conventions."),
("Is it final programming?","No. It's a starter stack for a designer to refine.")])
e("lucaelin/scnplot",[
"Open the hosted web app at lucaelin.github.io/scnplot.",
"Load an X32/M32 .scn file.",
"Print the channel overview for FOH or add it to the band's tech rider."],[
("Do I need a console?","No. It reads the scene file on your computer."),
("Who is it for?","Audio engineers, musicians and tour managers.")])
e("cstranex/x32-patch-list",[
"Use the hosted version linked in the README, or run it yourself: `pip install -r requirements.txt`, then `python fe.py`.",
"Upload an X32 scene file.",
"Print the generated patch list."],[
("Dependencies?","Only Flask."),
("Agent use?","An agent can produce the patch list as part of automated show docs.")])
e("cabcookie/saddleback-x32-general-scene",[
"Download the .scn file.",
"Read the README, which walks through the scene file's structure section by section.",
"Use it as a reference for parsing or generating scene files."],[
("Is it complete?","No. Some sections are marked \"Not yet evaluated\"."),
("Why useful for agents?","It documents the scene file format that tools and agents need to read or write.")])
open('/tmp/D.done','w').write(str(len(D)))
for f in glob.glob('content/use-cases/*.md'):
    raw=open(f).read(); _,fm,body=raw.split('---',2); meta={'source_url':re.search(r'^source_url: (.*)$',fm,re.M).group(1).strip(),'summary':re.search(r'^summary: "(.*)"$',fm,re.M).group(1).replace('\\"','"')}
    repo=meta['source_url'].split('github.com/')[-1]
    if repo not in D: continue
    steps,faqs,summ,diff=D[repo]
    if summ: fm=re.sub(r'^summary: .*$', 'summary: "'+summ.replace('"','\\"')+'"', fm, flags=re.M); meta['summary']=summ
    if diff: fm=re.sub(r'^difficulty: .*$','difficulty: '+diff,fm,flags=re.M)
    b=f"\n## What it does\n\n{meta['summary']}\n\n## How to set it up\n\n"+"\n".join(f"{i+1}. {s}" for i,s in enumerate(steps))
    b+=f"\n\nSource project: [{repo}]({meta['source_url']})\n\n## FAQ\n\n"+"\n\n".join(f"### {q}\n{a}" for q,a in faqs)+"\n"
    open(f,'w').write('---'+fm+'---\n'+b)
print(len(D))
