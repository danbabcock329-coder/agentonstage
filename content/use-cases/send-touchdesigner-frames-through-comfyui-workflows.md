---
title: "Send TouchDesigner frames through ComfyUI workflows"
slug: send-touchdesigner-frames-through-comfyui-workflows
category: "TouchDesigner"
tools: ["TouchDesigner", "ComfyUI"]
difficulty: Intermediate
source_url: https://github.com/olegchomp/TDComfyUI
summary: "A TD interface to ComfyUI so you can trigger node-based image generation from your show file and pull results back."
---

## What it does

A TD interface to ComfyUI so you can trigger node-based image generation from your show file and pull results back.

## How to set it up

1. Install ComfyUI and the ComfyUI Nodes for External Tooling.
2. Add the TDComfyUI.tox release to your project and run Re-init on its Settings page.
3. In ComfyUI enable dev mode options, build a workflow and Save (API Format).
4. Load that JSON into a Text DAT, connect it to TDComfyUI's input, set parameters and press Generate.

Source project: [olegchomp/TDComfyUI](https://github.com/olegchomp/TDComfyUI)

## FAQ

### How do I send a TD image to ComfyUI?
Use the "Load Image (Base64)" node in your workflow and point it at a TOP on the Workflow page.

### Is there a tutorial?
The README links a YouTube video on connecting everything to Stable Diffusion.
