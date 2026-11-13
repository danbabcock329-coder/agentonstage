---
title: "Play an xSchedule playlist over the web API"
slug: play-an-xschedule-playlist-over-the-web-api
category: "Lighting"
tools: ["xSchedule", "HTTP"]
difficulty: Intermediate
source_url: https://github.com/xLightsSequencer/xLights/blob/master/documentation/xSchedule%20API%20Documentation.txt
summary: "xSchedule's web API plays a named playlist. GetPlayingStatus reports Idle, Paused, or Playing, and whether output is going to the lights."
---

## What it does

xSchedule is the player and scheduler in the xLights project. It plays FSEQ sequences and sends them to controllers over E1.31/sACN, Art-Net, DDP, and DMX. The API document in the xLights repository describes a small web server with four URL families. The two an agent uses to run a show are `xScheduleQuery` and `xScheduleCommand`.

The document writes both as `http://` plus the machine, then the path. It does not print a port number. Use the port the xSchedule web server is actually listening on.

`xScheduleQuery?Query=` reads state and returns JSON. `GetPlayLists` returns each playlist's name, a unique id, and its length. The document says that id is valid for this session only. `GetPlayingStatus` is the live read. Its `Status` field is `Idle`, `Paused`, or `Playing`. The same response includes the playlist name, the step name, `position` and `left` on the current step, `volume`, `outputtolights`, the server time, and `ip`. That `ip` is the client address as xSchedule sees it. `outputtolights` says whether data is being sent to the lights.

`xScheduleCommand?Command=` runs an action. `Parameters` carries whatever that command needs. `Play specified playlist` plays the named playlist once. `Play specified playlist if nothing playing` does that only when no other playlist is already playing. `Stop specified playlist` stops that playlist even if a higher-priority schedule has it suspended. `Pause` pauses the playlist that is playing. `Next step in current playlist` jumps immediately. `Toggle output to lights` flips whether the scheduler is sending data out.

If a password is set, call `xScheduleLogin?Credential=` first. The credential is the MD5 hash of the client IP, as xSchedule sees it, concatenated with the password. The document's example shape is `127.0.0.1` followed immediately by the password. A success is a JSON success result. A failure is a JSON failed result with a message and a hint of the client IP. A logged-in address stays logged in until the timeout since the last successful request, or until a failed login for that address, which logs it out immediately. The document does not print the timeout length.

The same calls work over the web socket. A command message is JSON with `Type` of `Command`, plus `Command`, `Parameters`, `Data`, `Reference`, and `Pass`. A query uses `Type` of `Query`. Leave `Pass` blank unless the page was built for the public password substitution the document describes.

## How to set it up

1. Start xSchedule with the show folder that holds the playlists. Point the client at the web server host and the port that server is listening on. If no password is configured, skip the login.
2. If a password is set, read `ip` from `xScheduleQuery?Query=GetPlayingStatus`, hash that IP concatenated with the password as MD5, and request `xScheduleLogin?Credential=` plus that hash. Use the IP in the failure hint if it is not the address you hashed.
3. Request `xScheduleQuery?Query=GetPlayLists` and take the playlist `Name`. Then request `GetPlayingStatus`. Read `Status` and `outputtolights` before you start anything.
4. Request `xScheduleCommand?Command=Play%20specified%20playlist%20if%20nothing%20playing&Parameters=` plus the playlist name. Request `GetPlayingStatus` again and confirm `Status` is `Playing` and the playlist name matches.
5. Stop that playlist with `Command=Stop%20specified%20playlist` and the same name in `Parameters`. If `outputtolights` is off, `Toggle output to lights` is the command that changes it. Do not treat a successful command result as proof the pixels changed until that flag is on.

Source: [xSchedule API Documentation.txt](https://github.com/xLightsSequencer/xLights/blob/master/documentation/xSchedule%20API%20Documentation.txt) in the xLights repository.

## FAQ

### Does the API document name a port?
No. The sample URLs are `http://` plus the host and the path, with no port. Use the port the web server is listening on.

### Are playlist ids stable?
`GetPlayLists` and `GetPlayingStatus` both return an id, and the document says that id is valid for this session only. Pass the playlist name in `Parameters` when you play or stop.

### What does a playing status mean if the lights stay dark?
`GetPlayingStatus` includes `outputtolights`. The document describes it as whether data is being sent to the lights. `Toggle output to lights` is the command that changes that flag.
