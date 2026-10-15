---
title: "GPU MediaPipe tracking for interactive stage visuals"
slug: gpu-mediapipe-tracking-for-interactive-stage-visuals
category: "TouchDesigner"
tools: ["TouchDesigner", "MediaPipe"]
difficulty: Beginner
source_url: https://github.com/torinmb/mediapipe-touchdesigner
summary: "Hand, face and pose tracking inside TouchDesigner without extra hardware, good for audience-reactive installations."
---

## What it does

Hand, face and pose tracking inside TouchDesigner without extra hardware, good for audience-reactive installations.

## How to set it up

1. Download release.zip from the Releases page and open MediaPipe TouchDesigner.toe.
2. Use MediaPipe.tox from /toxes; tick "Enable External .tox" when dragging it into a new project to keep file size down.
3. Pick your webcam in the component and enable the models you need (face, hands, pose, etc.).
4. Use the example toxes to read tracking data into CHOPs that drive your visuals.

Source project: [torinmb/mediapipe-touchdesigner](https://github.com/torinmb/mediapipe-touchdesigner)

## FAQ

### Does it need a GPU?
It's GPU accelerated and runs inside TD with no extra hardware beyond a webcam.

### Which models are supported?
All MediaPipe vision models except Interactive Segmentation and Image Embedding.
