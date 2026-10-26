---
title: "Set Brompton Tessera brightness and input over HTTP"
slug: set-brompton-tessera-brightness-and-input-over-http
category: "LED/Video"
tools: ["Brompton Tessera", "HTTP"]
difficulty: Intermediate
source_url: https://www.bromptontech.com/online-help/Content/Tessera%20User%20Manual/03.%20Feature%20Topics/13.2.7%20-%20IP%20Control.htm
labels: ["Commercial product"]
summary: "Tessera IP Control is HTTP on port 80 and Telnet on port 23. Once it is enabled, a client can read the input and set brightness, source, blackout, freeze, and test patterns."
---

## What it does

Brompton's Tessera user manual says every processor can be controlled over IP for status and for screen parameters such as brightness or input source. The protocols on that page are HTTP on port 80 and Telnet on port 23. The Live Control tile shows whether IP Control is offline, waiting for a command, or has just received one: a red blink means the message was not understood, and a green blink means it was. An offline project in Tessera Remote stays on the offline tile until the project is connected to a processor. The manual says the full API document ships with the processor software, from Brompton's downloads page.

The API PDF opened for this entry is Tessera Processing IP Control API, software version 3.2.6. It says IP control has existed since processor software 3.1.0, that it has to be enabled in the Live Control tile, and that the client and the processor have to be on the same network with compatible addresses. It also says the API is for runtime control and does not aim to cover every function in the processor UI. Paths, tags, and commands are case-insensitive.

HTTP is served on port 80 under `/api`. GET reads, lists, and asks for help. PUT sets. A PUT body is JSON with the value under `data`. A missing or broken body can come back as MissingInputParam. Clients that cannot PUT can append `?set=` on a GET. The PDF's brightness example is `PUT http://SERVERADDRESS/api/output/global-colour/brightness` with `{"data": 5000}`. That endpoint is an integer from -1 to 10000. Writing -1 resets brightness to the calculated common maximum for the fixtures that are available. Input source is `input/active/source`, with `port-type` and `port-number`. The PDF's example sets `port-type` to `sdi` and `port-number` to 0. The documented `port-type` values are `dvi`, `hdmi`, and `sdi`, and the PDF says the types that exist depend on the processor. A GET of `input/active/refresh-rate` is the PDF's read example.

Telnet-style text uses TCP port 23. The PDF's get example is `get /input/active/refresh-rate`, and the set example is `set /input/active/source port-type=sdi,port-number=0`. `GET /api/override?help=1` describes blackout, freeze, and test pattern. The help text in that response says blackout fade time runs from 0 (a snap) to 10 seconds. Errors named in the PDF include path not found, bad operation, not supported on that hardware, missing or bad input, access denied, no project loaded, object not found, and operation failed.

Treat 3.2.6 as the document that was opened, not as a promise about a newer processor build. The user manual says to use the API document published with the software on the processor.

## How to set it up

1. On the processor, enable IP Control in the Live Control tile. The manual's status tile should leave the idle "waiting for command" state once a message arrives, blinking green when the message is understood.
2. Give the client an address on the processor's network. HTTP is port 80 and the path starts at `/api`. Telnet-style commands are TCP port 23.
3. Read before writing. `GET /api/input/active/refresh-rate` and `GET /api/system/software-version` are in the 3.2.6 tree. `GET /api/override?list=1` lists blackout, freeze, and test pattern. The processor-type values named in that PDF are m2, s4, s8, t1, t8, and sx40.
4. Set brightness with PUT and `{"data": N}` on `/api/output/global-colour/brightness`. The PDF's worked example uses 5000. Use -1 only when you mean the calculated common maximum.
5. If the reply is "No project loaded", load a project on the processor. If a field you need is missing, the PDF's position is that the API does not expose the whole UI, and a newer software build may ship a newer API document.

Source: [Tessera IP Control](https://www.bromptontech.com/online-help/Content/Tessera%20User%20Manual/03.%20Feature%20Topics/13.2.7%20-%20IP%20Control.htm) and the [IP Control API 3.2.6 PDF](https://dl.bromptontech.com/tessera/docs/TesseraIPControlAPI3_2_6.pdf).

## FAQ

### Can this build a panel layout or move cabinets?
The 3.2.6 introduction says the API is for runtime control and does not seek to offer every function of the processor UI. Brightness, colour, input source, blackout, freeze, and test patterns are the kind of calls the document specifies.

### Do the URLs care about capital letters?
The 3.2.6 PDF says paths, tags, and commands are case-insensitive on every protocol it supports.

### What does a red blink on the Live Control tile mean?
The user manual says a red blink is a message received and not understood. A green blink is a message received and understood.
