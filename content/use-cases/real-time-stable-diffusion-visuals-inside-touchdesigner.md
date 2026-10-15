---
title: "Real-time Stable Diffusion visuals inside TouchDesigner"
slug: real-time-stable-diffusion-visuals-inside-touchdesigner
category: "TouchDesigner"
tools: ["TouchDesigner", "StreamDiffusion", "NVIDIA GPU"]
difficulty: Advanced
source_url: https://github.com/olegchomp/TouchDiffusion
labels: ["Experimental"]
summary: "TouchDiffusion brings StreamDiffusion into TD for interactive, low-latency generated imagery driven by live inputs."
---

## What it does

TouchDiffusion brings StreamDiffusion into TD for interactive, low-latency generated imagery driven by live inputs.

## How to set it up

1. Easiest route: download the portable build linked in the README, run webui.bat and use the install & update tab.
2. Manual route: install TouchDesigner 2023, Python 3.11, Git and CUDA Toolkit 11.8, then follow the README or its YouTube tutorial.
3. Build an engine for your model (the README benchmarks sd-turbo at 512x512) and load the component in TD.
4. Feed a live TOP (camera, LED content) in and route the output to your media server.

Source project: [olegchomp/TouchDiffusion](https://github.com/olegchomp/TouchDiffusion)

## FAQ

### How fast is it?
README benchmarks: about 55–60 FPS on an RTX 4090 and 16 FPS on an RTX 3060 12GB at 512x512.

### Is it stable?
The author marks it as early testing that may change significantly.
