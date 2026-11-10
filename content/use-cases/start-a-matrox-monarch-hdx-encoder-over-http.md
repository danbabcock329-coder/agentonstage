---
title: "Start a Matrox Monarch HDX encoder over HTTP"
slug: start-a-matrox-monarch-hdx-encoder-over-http
category: "LED/Video"
tools: ["Matrox Monarch HDX", "HTTP"]
difficulty: Intermediate
source_url: https://video.matrox.com/wp-content/uploads/2026/08/en_monarch-hdx_dev-tools-reference-guide.pdf
labels: ["Commercial product"]
summary: "Monarch HDX Control API uses HTTP at /Monarch/syncconnect/sdk.aspx. GetStatus reads both encoders. StartEncoder1 returns SUCCESS, FAILED, or RETRY."
---

## What it does

Matrox's Monarch HDX Dev Tools Reference Guide, document Y11367-301-0116, dated July 4, 2017, describes an HTTP Control API for streaming and recording. A command is a URL of the form `http://<user>:<password>@<ip>/Monarch/syncconnect/sdk.aspx?command=<command>`. The guide says the default username and password are both `admin`. It also warns that some browsers reject a username and password in the URL because of RFC 3986 section 3.2.1. The tested command-line form that avoids that is `wget --user=<user> --password=<password> http://<ip>/Monarch/syncconnect/sdk.aspx?command=<command>`. The same chapter says the calling application has to support username and password authentication.

`GetStatus` returns `ENC1:<mode>,<state>, ENC2:<mode>,<state>, NAME:<name>`. The mode is `RTSP`, `RTMP`, `RECORD`, or `NONE`. The state is `ON`, `READY`, or `DISABLED`. The guide's second example is `ENC1:RECORD,ON, ENC2:RTSP,READY, NAME:DEVICE2`, which it reads as encoder 1 recording and encoder 2 in RTSP with no client connected. A colliding command returns `RETRY`. The guide says the first command received runs, and the others return `RETRY`.

`StartEncoder1` and `StartEncoder2` start that encoder in the mode already set. In RTMP mode the same call starts the stream. The return is `SUCCESS` if the encoder starts, if it is already started, or if the mode is `none`. `FAILED` means it could not be started. `StartBothEncoders` is `SUCCESS` only when both start, and `FAILED` if either one does not. `StopEncoder1`, `StopEncoder2`, and `StopBothEncoders` use the same three return words. `StopBothEncoders` is `FAILED` if either encoder does not stop.

`SetVideoInput` takes `SDI` or `HDMI` and returns `FAILED` if the device is streaming or recording. `SetAudioInput` takes `ANALOG` or `DIGITAL` with the same failure when the device is busy. `SetStreamingVideoDataRate` needs the encoder number, `1` or `2`, and an average bit rate from 50 to 20000. The guide says the encoder must already be streaming, and that the call sets the minimum to 90 percent of the average and the maximum to 110 percent. `SetRecordFileName` returns `FAILED` while the device is streaming or recording.

## How to set it up

1. Send `GetStatus` with wget, passing `--user` and `--password`, to `http://<ip>/Monarch/syncconnect/sdk.aspx?command=GetStatus`. Read both encoder modes before you start anything. The guide's device-name field is the `NAME:` token.
2. Start the encoder that is already in Record or RTMP. `command=StartEncoder1` returns `SUCCESS` when encoder 1 starts, when it is already started, or when its mode is `none`. Read `GetStatus` again and look for `ON` on that encoder.
3. If the response is `RETRY`, the guide says another command was already running. Wait and send the same command once. `FAILED` is the row for a start that did not happen.
4. Change `SetVideoInput` to `SDI` or `HDMI` only while `GetStatus` shows the device is not streaming or recording. The same idle rule applies to `SetAudioInput` and `SetRecordFileName`.
5. Stop one encoder with `StopEncoder1` or `StopEncoder2`. Use `StopBothEncoders` only when both should stop, because `FAILED` on that command means at least one of them did not stop.

Source: [Monarch HDX Dev Tools Reference Guide, Y11367-301-0116 (July 4, 2017)](https://video.matrox.com/wp-content/uploads/2026/08/en_monarch-hdx_dev-tools-reference-guide.pdf).

## FAQ

### What does READY mean next to RECORD?
In the status string the mode and the state are separate. The guide's first example is `ENC1:RECORD,READY`, which it describes as record mode and not recording. `ENC1:RECORD,ON` in the second example is the recording row.

### Why does StartEncoder1 return SUCCESS when nothing records?
The start section says `SUCCESS` also covers an encoder that is already started and an encoder whose mode is `none`. Read `GetStatus` and check that the mode is `RECORD` or `RTMP` and the state is `ON`.

### Can two commands be in flight?
The guide says that if two commands arrive together, or a command arrives while one is running, the first one executes and the others return `RETRY`. Send the next command after that response.
