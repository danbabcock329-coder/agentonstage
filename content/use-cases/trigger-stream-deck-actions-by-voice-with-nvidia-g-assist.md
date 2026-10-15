---
title: "Trigger Stream Deck actions by voice with NVIDIA G-Assist"
slug: trigger-stream-deck-actions-by-voice-with-nvidia-g-assist
category: "Show Control"
tools: ["Elgato Stream Deck", "NVIDIA Project G-Assist", "MCP"]
difficulty: Beginner
source_url: https://www.youtube.com/watch?v=VoY9XBpZuWA
summary: "Elgato's video shows NVIDIA's Project G-Assist using voice to fire Stream Deck actions through the Stream Deck MCP server. This makes hands-free cueing possible for simple setups."
---

## What it does

Elgato's video shows NVIDIA's Project G-Assist using voice to fire Stream Deck actions through the Stream Deck MCP server. This makes hands-free cueing possible for simple setups.

## How to set it up

1. Enable MCP Deck in Stream Deck 7.4+ and put the allowed actions on the MCP Actions profile.
2. Install the Elgato MCP server globally (`npm install -g @elgato/mcp-server`) and run it, since G-Assist connects over the network.
3. Set up G-Assist per Elgato's guide and test with a harmless action first.

Source: [Elgato on YouTube](https://www.youtube.com/watch?v=VoY9XBpZuWA)

## FAQ

### Is voice control safe for a live show?
Keep it to non-critical actions. A misheard command shouldn't be able to fire a cue.

### Does it need an NVIDIA GPU?
G-Assist is NVIDIA's assistant. Check its requirements before planning around it.
