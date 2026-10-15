---
title: "Stream images, video and audio from ComfyUI into TouchDesigner"
slug: stream-images-video-and-audio-from-comfyui-into-touchdesigner
category: "TouchDesigner"
tools: ["ComfyUI", "TouchDesigner"]
difficulty: Intermediate
source_url: https://github.com/JiSenHua/ComfyUI-TD
summary: "A ComfyUI custom node that streams generated media straight into TouchDesigner for real-time use."
---

## What it does

A ComfyUI custom node that streams generated media straight into TouchDesigner for real-time use.

## How to set it up

1. Install the node via ComfyUI-Manager (search ComfyUI-TD), or git clone it into ComfyUI/custom_nodes.
2. Add the matching TouchDesigner component to your project.
3. Add the ComfyUI-TD output nodes to your workflow and run it; results stream into TD.

Source project: [JiSenHua/ComfyUI-TD](https://github.com/JiSenHua/ComfyUI-TD)

## FAQ

### What can it send?
Images, video, point clouds (including Gaussian Splatting PLY) and audio.

### Can TD install the nodes for me?
Yes, the ComfyUI2TD.tox component has an InjectFile option that copies the nodes into custom_nodes.
