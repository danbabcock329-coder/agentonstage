---
title: "Depth maps from any camera with Depth Anything in TD"
slug: depth-maps-from-any-camera-with-depth-anything-in-td
category: "TouchDesigner"
tools: ["TouchDesigner", "Depth Anything", "TensorRT"]
difficulty: Advanced
source_url: https://github.com/olegchomp/TDDepthAnything
summary: "Monocular depth estimation accelerated by TensorRT, turning a regular camera into a depth source for effects and masking."
---

## What it does

Monocular depth estimation accelerated by TensorRT, turning a regular camera into a depth source for effects and masking.

## How to set it up

1. Install Python 3.11 and CUDA Toolkit 11.8 (tested with TD 2023.11340).
2. Download the repo, set PYTHON_PATH in accelerate.bat and run it to build the TensorRT engine.
3. Load the component in TD and feed it a camera TOP to get a depth map.

Source project: [olegchomp/TDDepthAnything](https://github.com/olegchomp/TDDepthAnything)

## FAQ

### Can I share a Python environment with TouchDiffusion?
Yes, the README explains copying the files into the TouchDiffusion folder and running accelerate.bat there.

### Which models?
Depth Anything v1 and v2.
