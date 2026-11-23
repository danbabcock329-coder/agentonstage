---
title: "Record and stream an AJA HELO over REST"
slug: record-and-stream-an-aja-helo-over-its-rest-api
category: "LED/Video"
tools: ["AJA HELO", "HTTP"]
difficulty: Intermediate
source_url: https://gitlab.aja.com/pub/rest_api/-/blob/master/HELO/03_HELO_Commands.md
labels: ["Commercial product"]
summary: "AJA's HELO chapter sets eParamID_ReplicatorCommand on /config. Value 1 records, 2 stops recording, 3 starts the stream, and 4 is the stop-stream enum."
---

## What it does

AJA's REST API chapter 3 is the HELO command list. Recording and streaming go through `eParamID_ReplicatorCommand` on the unit's `/config` path. The chapter's record URL is `http://192.168.0.2/config?action=set&paramid=eParamID_ReplicatorCommand&value=1`. The descriptor is an enum from 0 to 5, default 0, and it is marked ephemeral. The names are 0 No Command, 1 Record Command, 2 Stop Recording Command, 3 Stream Command, 4 Stop Streaming Command, and 5 Shutdown. The stop-recording section sets value 2. The start-streaming section sets value 3. The heading "To Stop Streaming" is followed by a sentence that says "To start streaming" and shows value 4. The enum text for 4 is Stop Streaming Command.

Record state is a different, read-only parameter, `eParamID_ReplicatorRecordState`. The get URL is `action=get` with that `paramid`. The printed JSON is `{"paramid":"2097225226","name":"eParamID_ReplicatorRecordState","value":"1","value_name":"eRRSIdle"}`. The enum runs from `eRRSUninitialized` at 0 through `eRRSIdle` at 1, `eRRSRecording` at 2, `eRRSFailingInIdle` at 3, `eRRSFailingInRecord` at 4, and `eRRSShutdown` at 5. Stream state is `eParamID_ReplicatorStreamState`. The chapter names it and does not print its enum.

`eParamID_RecordingProfileSel` and `eParamID_StreamingProfileSel` select profiles. Each descriptor runs from 0 to 9, default 0, and the enum value list in the chapter is empty. The filename prefix is `eParamID_FilenamePrefix`. The example that changes the default `clip` to `Biology Lecture` percent-encodes the space: `value=Biology%20Lecture`. The chapter says a URL may not contain a raw space, and that `?`, `&`, `%`, `/`, `\`, and `:` have to be encoded too.

Preset 2 is `eParamID_RegisterRecall` set to 2. The chapter then prints a check as `action=set` on `eParamID_RegisterRecallResult` with no `value`. The sample JSON is `"value":"2"` and `"value_name":"Complete"`.

When `eParamID_Authentication` is 0, the chapter says REST calls do not need a password. When it is 1, the same calls fail with an HTML 404 whose body says the document was not found. The login example is `POST` to `http://10.3.36.88/authenticator/login` with `password_provided=honk`, which returns `{"login":"success"}` and a `Set-Cookie` of `session=...`. Later `/config` calls send that cookie. `eParamID_MediaState` value 1 is Data-LAN, and value 0 is Record-Stream. The chapter says a transfer in progress is aborted when the unit is set back to Record-Stream. A clip download in the example is `GET /media0/example-filename-source.mov`.

[Play and record an AJA Ki Pro Ultra over its REST API](/use-cases/play-and-record-an-aja-ki-pro-ultra-over-its-rest-api) is chapter 5 of the same repository. That chapter's transport parameter is `eParamID_TransportCommand`. This chapter's parameter is `eParamID_ReplicatorCommand`.

## How to set it up

1. Point the client at the HELO address plus `/config`. The chapter's examples use `192.168.0.2` and say to substitute the unit's address. If authentication is on, `POST` the password to `/authenticator/login` and keep the `session` cookie. The chapter's sample password is the word it prints, `honk`, on a unit at `10.3.36.88`.
2. Read `eParamID_ReplicatorRecordState`. The sample idle body has `"value":"1"` and `"value_name":"eRRSIdle"`. `"value":"2"` is `eRRSRecording` in the enum.
3. Record with `action=set`, `paramid=eParamID_ReplicatorCommand`, and `value=1`. Stop that recording with `value=2`. Start the stream with `value=3`. For the stream stop, the enum name on value 4 is Stop Streaming Command. The sentence under the stop-streaming heading says "To start streaming" and also shows 4.
4. Set the clip prefix with `eParamID_FilenamePrefix` before the roll if the name matters. Encode spaces as `%20` or `+`. Read the record state again after the set. The command parameter is ephemeral, so a reboot clears it.
5. Do not send value 5. The enum calls it Shutdown. Leave `eParamID_MediaState` at 0 unless you mean to enter Data-LAN. The chapter says returning to Record-Stream aborts a transfer that is still running.

Source: [AJA REST API, chapter 3, HELO commands](https://gitlab.aja.com/pub/rest_api/-/blob/master/HELO/03_HELO_Commands.md).

## FAQ

### Is value 4 the stream stop?
The enum text for 4 is Stop Streaming Command, and 3 is Stream Command. The paragraph under the heading "To Stop Streaming" says "To start streaming" and shows value 4. Use the enum name when those two lines disagree.

### Why does a recorded command come back as a 404 page?
The authentication section says that HTML 404, "The document requested was not found on this server," is what HELO returns when user authentication is enabled and the request has no session. The login on that page is `POST /authenticator/login` with `password_provided`, then the `session` cookie on `/config`. Value 0 on `eParamID_Authentication` is Disabled.

### Does this use the Ki Pro transport values?
No. The Ki Pro Ultra chapter uses `eParamID_TransportCommand`, where 1 is play and 3 is record. The HELO chapter uses `eParamID_ReplicatorCommand`, where 1 is Record Command and 3 is Stream Command.
