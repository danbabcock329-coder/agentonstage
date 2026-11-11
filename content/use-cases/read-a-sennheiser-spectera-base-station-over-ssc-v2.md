---
title: "Read a Sennheiser Spectera base station over SSC v2"
slug: read-a-sennheiser-spectera-base-station-over-ssc-v2
category: "Audio"
tools: ["Sennheiser Spectera", "SSCv2", "HTTPS"]
difficulty: Advanced
source_url: https://docs.cloud.sennheiser.com/en-us/api-docs/spectera/usage.html
labels: ["Commercial product"]
summary: "Spectera SSCv2 is HTTPS on port 443 with user controlSennheiser. GET /api/device/identity reads the base station. HTTP on port 80 is rejected."
---

## What it does

Sennheiser's Spectera usage page is the third-party client guide for a Spectera base station. The introduction says the client talks only to that base station. Antennas and mobile devices are reached through the base station's API. Spectera supports Sennheiser Sound Control Protocol v2.3, and only over HTTPS on port 443. The introduction says HTTP on port 80 or on port 443 is rejected. The usage page's example base URL is `https://192.168.0.1:443`.

A factory-default station does not answer the API. The usage page says to connect with LinkDesk or the Spectera WebUI and set a password first. The third-party API access level from the general SSCv2 document is not implemented on Spectera. Requests use HTTP Basic authentication with the username `controlSennheiser` and the password set in LinkDesk or the WebUI.

`GET /api/ssc/version` returns the protocol and schema versions. The printed example is protocol `2.3`, schema `17.0`, and a `schemaDetailed` string. `GET /api/device/identity` is the device read. The printed example product is `Spectera-Base-Station`, with `hardwareRevision`, `serial`, and `vendor`. `GET /api/firmware/update/state` includes `deviceVersion` and `state`. The example state is `Idle`.

`GET /api/ssc/usagemark` is the write-coordination read. The page says multi-client write access is not fully implemented, and that there is no active lock. If `usedBy` is set by another client, other clients should switch to read-only. The printed in-use body has `usedBy` and `timer`. The PUT example sets `timer` to 10, which the page describes as the next 10 seconds, and it says not to hold the mark longer than necessary.

`GET /api/mts/paired/all` lists paired mobile devices. The page says MT in a path means mobile device. Each entry has an `mtUid`. The usage page says a serial number is not unique across device types, so a client addresses a device by `mtUid`, not by the serial printed on the housing. The example entry is a SEK whose `state` is `Connected`. `GET /api/rf/channels` returns the RF channel list. The example objects include `rfChannelId`, `frequency`, `txPower`, `rfState`, and `rfRestrictionViolation`.

Audio links occupy timeslots. The page says one RF channel has 128 timeslots, and that creating a link fails when there are not enough slots left. The mode table's `LIVE Ultra Low Latency` row is stereo, mode ID 9, IEM only, and 32 slots. A WebUI left open runs garbage collection on links that have no mobile device assigned. The page says the create and the mobile-device assignment have to happen within 5 seconds of each other or that cleanup can remove the link.

Command mode, a button on the mobile device that changes mic routing, is documented as official from Spectera API version 18.1. The page says it is not officially supported on earlier API versions, and that it applies to mic links and base-station outputs, not to IEM links. A station whose `/api/ssc/version` schema is the example `17.0` is not that version.

Level recording is a separate stream. `GET /api/levelrecording/version` returns protocol `flatbuffers` in the printed example. `GET /api/levelrecording/live` is a server-sent-event stream of binary frames, about one snapshot a second, not a JSON body. The page calls the feature preliminary.

## How to set it up

1. Set the device password in LinkDesk or the Spectera WebUI. Until that password exists, the usage page says the API is unavailable. Call the station at `https://<base-station>:443` with HTTP Basic, username `controlSennheiser`. Do not use the general SSCv2 API username, and do not send HTTP.
2. `GET /api/ssc/version` and read `protocol` and `schema`. The printed example is protocol `2.3` and schema `17.0`. Then `GET /api/device/identity` and confirm `product`, `serial`, and `vendor`.
3. For a pre-show check, `GET /api/mts/paired/all` and read each `mtUid`, `state`, and `batteryLow`. `GET /api/rf/channels` and read `rfState` and `rfRestrictionViolation`. Stop there if the client is only monitoring.
4. Before any PUT, `GET /api/ssc/usagemark`. If `usedBy` is already set, stay on GET. A write client sets the mark for the shortest timer it needs. The page's example timer is 10 seconds, and it says there is still no lock.
5. Do not create an audio link from a monitoring client. A link that is not assigned to a mobile device can be deleted by a connected WebUI, and the page says the assignment has to follow the create within 5 seconds. Do not call command-mode routes unless `schema` is 18.1 or newer. Leave RF power and frequency on the GET.

Source: [Spectera API usage](https://docs.cloud.sennheiser.com/en-us/api-docs/spectera/usage.html) and the [Spectera API introduction](https://docs.cloud.sennheiser.com/en-us/api-docs/spectera/introduction.html).

## FAQ

### Why does the SSCv2 spec's API user fail?
The Spectera introduction says the third-party API access level is not implemented, and that clients must not use the API user from the general SSCv2 document. The usage page's username is `controlSennheiser`, with the password from LinkDesk or the WebUI. The transport is HTTPS on port 443.

### Which identifier addresses one bodypack?
`mtUid` on `GET /api/mts/paired/all`. The usage page says a serial number can repeat across device types, so `serial` is a property to read and not the path key. MT in the path means mobile device.

### Is command mode present on every firmware?
The usage page says command mode is official from API version 18.1 and is not officially supported before that. Read `schema` from `GET /api/ssc/version` first. The printed version example on that page is schema `17.0`.
