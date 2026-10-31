---
title: "Live AI translation captions as an OBS overlay"
slug: live-ai-translation-captions-as-an-obs-overlay
category: "LED/Video"
tools: ["OBS", "speech AI"]
difficulty: Beginner
source_url: https://github.com/arvindjuneja/subai
summary: "SubAI runs a local caption and translation panel at http://127.0.0.1:3000. Set the pipeline to whisper, choose languages, and add the OBS overlay from the Monitor tab."
---

## What it does

A live caption and translation system you can drop into OBS or other video tools as an overlay.

## How to set it up

1. Windows: run INSTALLER.bat then SubAI_Start.bat. Mac (Apple Silicon): `pip install -e './backend[mlx]'` and ./start.sh.
2. Open the control panel at http://127.0.0.1:3000, set the pipeline to whisper and choose languages.
3. Connect the mic in the Stream tab and add the OBS overlay from the Monitor tab.

Source project: [arvindjuneja/subai](https://github.com/arvindjuneja/subai)

## FAQ

### Does it translate?
Yes, live captions can be shown in a different language from the speaker.

### Hardware?
CUDA on Windows, MLX on Apple Silicon, or Linux.
