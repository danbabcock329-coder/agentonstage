---
title: "Load a Viz Engine scene over TCP"
slug: load-a-viz-engine-scene-over-tcp
category: "LED/Video"
tools: ["Vizrt Viz Engine", "TCP"]
difficulty: Intermediate
source_url: https://documentation.vizrt.com/viz-engine-guide/5.6/Communicating_with_Viz_Engine.html
labels: ["Commercial product"]
summary: "Viz Engine takes raw TCP on port 6100. MYID123 MAIN VERSION is the version query. The connection table ends a command with a null byte."
---

## What it does

Vizrt's Viz Engine Administrator Guide, the page "Communicating with Viz Engine", is the external-command description for the renderer. The connection table says the protocol is raw TCP, with no TLS and no HTTP framing, default port 6100, plain ASCII, a null character as the message separator, and 255 simultaneous connections. Open a socket and send. The command form is a command id, a blank, the command, and a null byte. `MYID123 MAIN VERSION` followed by null is the worked example, and the answer printed under it is `MYID123 Version: 5.5.2.40039`. An id of `-1` means the engine sends no answer. The same id is used on the reply otherwise.

The rules on that page say a command with no null is buffered and never processed, that the socket should stay open for the session, and that each command produces one response. Later on the same page, the request-response section says the response is one line ended by a newline, and its send examples end the command with a newline. The mistakes list says every command must end with `\n`. Those two terminators are both printed. This page does not say which one a given engine build requires.

Paths use `*` as the separator. The page says dots and slashes return an error. A container name is prefixed with `$`, as in `MAIN_SCENE*TREE*$Title`. `RENDERER SET_OBJECT SCENE*Scenes/MyLowerThird` is the load example. The page says that loads the Graphic Hub scene at that path onto the main renderer layer, and that an empty response means success. `RENDERER SET_OBJECT` with no argument is the unload. `MAIN_SCENE*TREE*$Headline*GEOM*TEXT SET "Breaking News"` is the text example. `RENDERER*STAGE*DIRECTOR*Main START` starts the director named Main.

Step 1 prints `IS_RENDERER_READY` and says `1` is ready and `0` is not. The wait loop and the quick reference print `MAIN IS_RENDERER_READY`, with the same `1` and `0`. Step 1's `VERSION` example answer is `5.5.0.12345`, which is a different string from the `MYID123` example above. Errors are plain text. The page says to look for the substring `ERROR`, and that there are no numeric error codes and no JSON error body.

Shared-memory writes on this command port are `VIZ_COMMUNICATION*MAP SET_ELEMENT "score_home" "3"`. The page says port 6100 blocks the render queue, and it points high-rate data at shared-memory TCP 3001 or UDP 3000, in the form `key|value` followed by null. Further reading on the same page also names an HTTP API on port 61000 and a WebSocket on port 6900. It says `viz.exe --doc` writes `C:\ProgramData\vizrt\VizEngine\commands.xml`.

More than one engine on the same machine uses `Port = Base Port + (Instance Number - 1)`. The table lists instance 1 as command 6100 and REST 61000, instance 2 as 6101 and 61001, and instance 3 as 6102 and 61002. Example 9 sends `MYID BATCH START`, then lines whose id is `-1`, then `-1 BATCH STOP`. The paragraph under that example says the commands are inside `BATCH BEGIN` / `BATCH END`.

## How to set it up

1. Open a TCP socket to port 6100 for instance 1. For instance 3 the table says 6102. Keep the socket open. The page's maximum is 255 connections.
2. Send the version command the connection section prints, `MYID123 MAIN VERSION`, and read one reply. The page's connection table terminates with a null byte, and its mistakes list terminates with a newline. Confirm which of those two the engine accepts before a show. `-1` is the id that asks for no answer.
3. Read readiness. Step 1 sends `IS_RENDERER_READY`. The quick reference sends `MAIN IS_RENDERER_READY`. Either example treats `1` as ready and `0` as not ready. The page says to wait for `1` after startup or a scene load.
4. Load with `RENDERER SET_OBJECT SCENE*Scenes/MyLowerThird` and treat an empty reply as the success the page describes. Set a named container with `MAIN_SCENE*TREE*$Headline*GEOM*TEXT SET "Breaking News"`. Start that scene's director with `RENDERER*STAGE*DIRECTOR*Main START`.
5. Unload with `RENDERER SET_OBJECT` and no path. The cleanup section then sends `SCENE*Scenes/MyLowerThird CLOSE` and `POOLS CLEANUP`. The page says GPU memory keeps unloaded textures until that cleanup. Leave high-rate values off port 6100. The page sends those on TCP 3001 or UDP 3000.

Source: [Communicating with Viz Engine](https://documentation.vizrt.com/viz-engine-guide/5.6/Communicating_with_Viz_Engine.html), Viz Engine Administrator Guide. [Control a Vizrt TriCaster from Claude over MCP](/use-cases/control-a-vizrt-tricaster-from-claude-with-a-local-mcp-server) is a different product and a different API.

## FAQ

### Does the command end with null or with a newline?
The connection table and the connection rules say a null byte, and they say a missing null means the command is never processed. The request-response examples and the mistakes list say a newline. Both are on this page. The version example in the connection section is `MYID123 MAIN VERSION` plus null, and the answer shown is `MYID123 Version: 5.5.2.40039`.

### Is the ready command MAIN IS_RENDERER_READY or IS_RENDERER_READY?
Step 1 prints `IS_RENDERER_READY`. The wait loop and the quick reference print `MAIN IS_RENDERER_READY`. Both descriptions say `1` means ready and `0` means not ready.

### What is BATCH BEGIN versus BATCH STOP?
Example 9 sends `MYID BATCH START` and closes with `-1 BATCH STOP`. The sentences under the example say `BATCH BEGIN` and `BATCH END`. Lines after the start use id `-1`. The page says those updates share one response.
