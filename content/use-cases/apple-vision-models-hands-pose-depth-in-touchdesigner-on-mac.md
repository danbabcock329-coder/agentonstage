---
title: "Apple Vision models (hands, pose, depth) in TouchDesigner on Mac"
slug: apple-vision-models-hands-pose-depth-in-touchdesigner-on-mac
category: "TouchDesigner"
tools: ["TouchDesigner", "Apple Silicon"]
difficulty: Intermediate
source_url: https://github.com/ojrgb/appletd
summary: "Brings Apple's on-device neural networks into TD so a Mac Mini can do tracking and segmentation locally."
---

## What it does

Brings Apple's on-device neural networks into TD so a Mac Mini can do tracking and segmentation locally.

## How to set it up

1. Download appletd.tox and drop it into your project.
2. Press Install on the General page and wait for Installstate to read Installed, then switch Active on.
3. Optionally point Sidecarpython at your own Python 3.11+ venv; don't use TouchDesigner's bundled Python.

Source project: [ojrgb/appletd](https://github.com/ojrgb/appletd)

## FAQ

### Does it work on Windows or Intel Macs?
No, Apple Silicon only, because it relies on the Neural Engine.

### Why a sidecar process?
The author says it is 28x faster than inline inference and avoids macOS library-validation problems.
