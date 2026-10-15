---
title: "Real-time generative video pipelines with StreamDiffusion"
slug: real-time-generative-video-pipelines-with-streamdiffusion
category: "LED/Video"
tools: ["StreamDiffusion", "NVIDIA GPU"]
difficulty: Advanced
source_url: https://github.com/cumulo-autumn/StreamDiffusion
summary: "The real-time diffusion pipeline behind many live-visual integrations; runs well on high-VRAM local GPUs."
---

## What it does

The real-time diffusion pipeline behind many live-visual integrations; runs well on high-VRAM local GPUs.

## How to set it up

1. Create a Python 3.10 environment (conda or venv).
2. Install the PyTorch build matching your CUDA version, then install StreamDiffusion from the repo.
3. Optionally build TensorRT acceleration, then run the realtime examples.
4. For live shows, use a TD wrapper like TouchDiffusion rather than raw scripts.

Source project: [cumulo-autumn/StreamDiffusion](https://github.com/cumulo-autumn/StreamDiffusion)

## FAQ

### Is it a show tool?
It's a research pipeline that most real-time live-visual integrations build on.

### Good fit for a 5090?
High-VRAM NVIDIA cards are the target. The README's benchmarks are on RTX 4090-class GPUs.
