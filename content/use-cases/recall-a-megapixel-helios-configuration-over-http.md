---
title: "Recall a Megapixel HELIOS configuration over HTTP"
slug: recall-a-megapixel-helios-configuration-over-http
category: "LED/Video"
tools: ["Megapixel HELIOS", "HTTP"]
difficulty: Intermediate
source_url: https://megapixelvr.com/wp-content/uploads/2023/09/Camera-Mode-on-HELIOS-Technology-Overview.pdf
labels: ["Commercial product"]
summary: "HELIOS recalls a saved configuration with POST /api/v1/presets/apply and a presetName body. The March 2022 note says to request the full API from Megapixel."
---

## What it does

Megapixel's Camera Mode on HELIOS overview, March 2022, documents saved configurations for Camera Mode settings. The settings path in the overview is Settings, then the Saved Configurations tab, then New. The pop-up asks for a name and the settings to store, then Create Configuration. The same section says those configurations can be recalled from the HELIOS interface or from an external interface that supports the HTTP REST web service or the HTTP WebSocket JSON-RPC protocols.

The only request the overview prints is an HTTP POST to `http://xxx.xxx.xxx.xxx/api/v1/presets/apply`, where `xxx.xxx.xxx.xxx` is the HELIOS IP address. The body it prints is a JSON object whose one field is `presetName`, set to the saved configuration name. The quotation marks in that printed body are curly quotes, and the word configuration is set with an fi ligature, so a client should send straight JSON quotes and the name that was stored, not the glyphs from the PDF.

The overview does not print a response body, a port, an authentication scheme, or a WebSocket message. It says to email support@megapixelvr.com to request the HELIOS Public API documentation. The clients it names for the POST are a Stream Deck with Bitfocus Companion's generic HTTP request, a Stream Deck with the API Ninja plug-in on PC, and an iPhone or iPad using the Actions app.

The saved-configuration steps in this overview are about Camera Mode settings. The page does not list brightness, input, or blackout routes.

## How to set it up

1. On the HELIOS, open Settings, Saved Configurations, and New. Name the configuration and choose the Camera Mode settings, then Create Configuration. The POST recalls a name that already exists. This overview does not show a create call.
2. POST to `http://` plus the HELIOS IP plus `/api/v1/presets/apply`. The body field is `presetName`. Use straight double quotes. The PDF prints curly quotes around the key and the name.
3. Do not add a port, a header, or a second field from this overview. It does not publish them. The full public API is the document Megapixel sends when you email support@megapixelvr.com.
4. The same paragraph names HTTP WebSocket JSON-RPC as another external interface and does not print a message for it. Use the REST POST that is printed, or the HELIOS interface, until that message is in the public API document.
5. Treat the route as the Camera Mode saved-configuration recall this overview describes. It does not document other HELIOS settings.

Source: [Camera Mode on HELIOS, March 2022](https://megapixelvr.com/wp-content/uploads/2023/09/Camera-Mode-on-HELIOS-Technology-Overview.pdf), Saved Configurations.

## FAQ

### Does this page list every HELIOS route?
No. The overview prints one POST, `/api/v1/presets/apply`, with `presetName`. It says the public API documentation is requested from support@megapixelvr.com. Brightness, input, and blackout are not given routes here.

### Are the quotes in the PDF the bytes to send?
The PDF uses curly quotation marks and an fi ligature in the word configuration. Send a JSON object with straight quotes and the configuration name you stored. The field name printed is `presetName`.

### Is the WebSocket format on this page?
The overview names HTTP WebSocket JSON-RPC and does not show a payload, a path, or a port. The worked example is the HTTP POST above.
