---
title: "Control a Zoom meeting over OSC with ZoomOSC"
slug: control-a-zoom-meeting-over-osc-with-zoomosc
category: "Production Ops"
tools: ["ZoomOSC", "Zoom", "OSC"]
difficulty: Intermediate
source_url: https://filedn.com/lJhb55s9GTLpJecFnm56CRp/ZoomOSC/4.6.0/ZoomOSC%204.6.0%20Command%20Syntax.pdf
labels: ["Commercial product"]
summary: "ZoomOSC 4.6.0 takes UDP OSC starting with /zoom. /zoom/userName/videoOn plus a username turns that video on. /zoom/all/mute mutes everyone except the host."
---

## What it does

The ZoomOSC command syntax document, whose first page says version 4.6.0, describes a bi-directional OSC interface to Zoom. ZoomOSC uses OSC over UDP. Every input address starts with `/zoom`. Outputs start with `/zoomosc`. Payloads are ints, floats, or strings. A multi-word string can be quoted so it stays one argument. The document's example is `/zoom/userName/videoOn` with the string `Andy Carluccio`.

User commands name a target, then the action. `/zoom/userName` takes the Zoom username. The document says that name is case sensitive, includes spaces, and that if more than one participant has it, the target is the first match. `/zoom/galIndex` is the zero-based position in the gallery. `/zoom/zoomID` is an int assigned when the participant joins, and it changes if they leave and rejoin. `/zoom/galleryPosition` is marked Mac required and takes a string such as `0, 2` for row and column, also zero-based. `/zoom/me` targets the local user.

Group targets skip the user lookup. `/zoom/all` is everyone in the call. `/zoom/panelists` and `/zoom/attendees` are the webinar groups. Exclusion forms are `/zoom/allExcept`, `/zoom/panelistsExcept`, and `/zoom/attendeesExcept`, followed by a target type. The document's example is `/zoom/allExcept/me/...`. `/zoom/users` plus a target type builds a custom group. The document's examples include `/zoom/users/galIndex/addPin` with gallery indexes 2, 6, 8, and 3, and `/zoom/users/zoomID/addSpot` with zoom IDs.

Video and mic actions append to the target. `../videoOn` requests the participant's video on. `../videoOff` turns it off. `../toggleVideo` toggles it. `../mute` mutes the mic. `../unMute` requests an unmute, unless Zoom settings already allow it, and the document says ZoomOSC will automatically accept requests to unmute. `../toggleMute` toggles the mic. Global commands do not take a target. `/zoom/all/mute` mutes all participants except the host. `/zoom/all/unMute` unmutes all participants. `/zoom/lowerAllHands` lowers every raised hand. `/zoom/enableUsersUnmute` and `/zoom/disableUsersUnmute` change the meeting setting that lets participants unmute. `/zoom/chatAll` takes one string and sends it to everyone. `/zoom/ping` takes an optional argument and the document says ZoomOSC replies with a pong.

Commands marked PRO in the document include `/zoom/joinMeeting` and `/zoom/startMeeting`, each with meeting ID, passcode, and username strings, plus `/zoom/leaveMeeting`, `/zoom/endMeeting`, and `/zoom/clearSpot`. `/zoom/subscribe` sets how much user output you receive. The document's modes are None = 0, TargetList = 1, All = 2, Panelists = 3, and OnlyGallery = 4.

Outputs use `/zoomosc/me` when the event is the local user and `/zoomosc/user` otherwise. The document's four user-prefix arguments, in order, are target index, user name, gallery index, and zoom ID. Subscribed video on and off, mute and unmute, and hand raised and lowered are among the outputs that add those four values. `/zoomosc/user|me/activeSpeaker` is marked Windows, and the document says that on macOS the user identity is not sent.

Zoom's own getting-started article says you sign in inside ZoomOSC, join from the Meeting tab, and send commands to the receiving IP and port configured in the app. It says ZoomOSC is not supported in meetings with more than 1000 participants, or in webinars where Backstage is enabled. The article's operating-system line is macOS 14, macOS 15, macOS 26, or later.

## How to set it up

1. Install ZoomOSC and sign in. Zoom's article says the Meeting tab joins the meeting, and the OSC Command Browser lists commands. Confirm the receiving IP and port in the app before you send anything. The syntax document does not print a default port.
2. Send UDP OSC whose address starts with `/zoom`. `/zoom/ping` is the document's connectivity check. `/zoom/subscribe` with integer 2 asks for output on everyone. Integer 0 is none.
3. Target one person with `/zoom/userName/videoOn` and the username string, matching case and spaces. Mute that mic with `/zoom/userName/mute` and the same string. Mute everyone except the host with `/zoom/all/mute`.
4. Read replies that start with `/zoomosc`. A subscribed user's video and mute outputs include the four prefix values: target index, user name, gallery index, and zoom ID. Do not treat a zoom ID as stable after the person leaves and rejoins.

Source: [ZoomOSC 4.6.0 command syntax](https://filedn.com/lJhb55s9GTLpJecFnm56CRp/ZoomOSC/4.6.0/ZoomOSC%204.6.0%20Command%20Syntax.pdf) and [Zoom's getting started with ZoomOSC](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0089186).

## FAQ

### Which commands need the Pro product?
The syntax document marks commands PRO in the command tables. `/zoom/joinMeeting`, `/zoom/startMeeting`, `/zoom/leaveMeeting`, `/zoom/endMeeting`, and `/zoom/clearSpot` are marked PRO. `/zoom/all/mute` and `/zoom/userName/videoOn` are not marked PRO on those rows.

### Why did a username target the wrong person?
The document says `/zoom/userName` is case sensitive and includes spaces, and that duplicate names resolve to the first participant it finds with that name. `/zoom/zoomID` avoids the name, but the same page says the ID changes if the participant leaves and rejoins.

### Where do meeting events come back out?
Outputs begin with `/zoomosc`. The document uses `/zoomosc/me` for the local user and `/zoomosc/user` otherwise. `/zoom/subscribe` chooses the set: 0 none, 1 target list, 2 all, 3 panelists, 4 gallery only.
