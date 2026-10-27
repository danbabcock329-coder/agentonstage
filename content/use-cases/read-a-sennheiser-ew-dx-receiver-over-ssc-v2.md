---
title: "Read a Sennheiser EW-DX receiver over SSC v2"
slug: read-a-sennheiser-ew-dx-receiver-over-ssc-v2
category: "Audio"
tools: ["Sennheiser EW-DX", "SSCv2"]
difficulty: Intermediate
source_url: https://docs.cloud.sennheiser.com/en-us/api-docs/api-docs/sound-control-protocol.html
labels: ["Commercial product"]
summary: "EW-DX receivers on firmware 4.0 or newer can expose SSCv2 over HTTPS on port 443. After Control Cockpit enables it, a client reads /api/device/identity with the api user."
---

## What it does

Sennheiser's Sound Control Protocol page splits third-party control into SSCv2 and the older SSC. SSCv2 is the password-protected protocol. The page lists Spectera, TeamConnect Ceiling Medium, TeamConnect Bar, and Evolution Wireless Digital on firmware 4.0.0 or newer, including the EW-DX EM 2, EM 2 Dante, and EM 4 Dante rack receivers. The same page puts EW-DX below firmware 4.0, TeamConnect Ceiling 2, SpeechLine rack receivers, and the SL chargers on the older protocol.

The SSCv2 specification, version 2.3, describes a REST API over HTTPS. It mandates HTTP/1.1 and TLS 1.2. A missing login is HTTP 401. A login that is not allowed to touch that resource is 403. A missing resource is 404. A method the device does not allow is 405. The spec says the server checks authentication before authorization.

Control Cockpit's port table lists TCP 443 as SSC v2 for TeamConnect Ceiling Medium and for those EW-DX receivers on firmware 4.0.0 or newer. The EW-DX access page says third-party media control is off by default. Secure turns on SSCv2. Legacy turns on SSCv1 with no password, and the page says to use that at your own risk. The password rules on that page are at least ten characters, one lowercase, one uppercase, one number, one character from the printed special-character set, and at most 64 characters. The same page says API calls use the username `api` and that password. Deactivating third-party access deletes the password.

That `api` user is the EW-DX instruction. Spectera's third-party API PDF says the API access level is not implemented on Spectera, and that those requests use the username `controlSennheiser` with the password set in LinkDesk or the WebUI. Do not reuse the EW-DX username on a Spectera base station.

The safe first read in the specification is `GET /api/device/identity`. The spec calls it read-only and requires `product`, `serial`, and `vendor`. The printed example product string is "TeamConnect Ceiling 2". That string is the schema example. The protocol page lists TeamConnect Ceiling 2 under the older SSC, so this entry does not point an SSCv2 client at a TCC2.

`GET /api/device/site` returns the user-set name, location, and position. Those fields are writable. A show-day client that is only checking the rack should stop at identity.

The published subscription example uses HTTP Basic, username `api`, `https://<ip>:443/api/ssc/state/subscriptions`, and `verify=False`. That example turns certificate checking off. Leave certificate checking on unless you have decided how this device's certificate is trusted. The spec still requires TLS.

The access page also documents a separate device password that Control Cockpit uses, and it prints a default for the EW-DX receiver. That password is not the third-party API password. The API password is the one you type while enabling Secure.

## How to set it up

1. Confirm the receiver is EW-DX on firmware 4.0.0 or newer. The [protocol page](https://docs.cloud.sennheiser.com/en-us/api-docs/api-docs/sound-control-protocol.html) puts older EW-DX firmware on SSC v1. Control Cockpit's [port table](https://docs.cloud.sennheiser.com/en-us/control-cockpit/control-cockpit/specifications.html) lists SSCv2 on TCP 443 for the 4.0.0-and-newer receivers.
2. In Control Cockpit, open the device access page and enable Secure. Set a password that meets the rules on that page. The [EW-DX access chapter](https://docs.cloud.sennheiser.com/en-us/control-cockpit/control-cockpit/ew-dx-access.html) says the API username is `api`. Leave Legacy off.
3. `GET https://<receiver>:443/api/device/identity` with HTTP Basic and that user. Expect JSON with `product`, `serial`, and `vendor` on 200. A 401 means the login was not accepted.
4. Stay on GET for a pre-show check. `device/site` can be written. Mute, RF, and gain paths belong to the device's own media-control protocol, which the access page points at separately. Read that document before a client sends a POST.
5. Do not copy the subscription sample's `verify=False` into a client that runs during a show. Do not put the Control Cockpit device password in the API client.

Source: [Sound Control Protocol](https://docs.cloud.sennheiser.com/en-us/api-docs/api-docs/sound-control-protocol.html), [SSCv2 specification 2.3](https://docs.cloud.sennheiser.com/en-us/api-docs/api-docs/sscv2-specification-2.3.html), [EW-DX access](https://docs.cloud.sennheiser.com/en-us/control-cockpit/control-cockpit/ew-dx-access.html), [Control Cockpit ports](https://docs.cloud.sennheiser.com/en-us/control-cockpit/control-cockpit/specifications.html), and the [Spectera third-party API PDF](https://docs.cloud.sennheiser.com/en-us/api-docs/api-docs_3rd_party_api_08_2026_en.pdf).

## FAQ

### Will this log in to a TeamConnect Ceiling 2?
The protocol page lists TeamConnect Ceiling 2 on the older SSC. The identity example in the SSCv2 spec uses that product name as sample JSON. Use the protocol page's device list, not the sample string, to decide which API you have.

### Is the username always api?
On EW-DX, the access page says `api`. Spectera's third-party PDF says to use `controlSennheiser` because the API access level is not implemented there.

### Does a 200 from identity mean RF is healthy?
It means the read-only identity resource answered. Channel state, battery, and mute are other resources. The access page sends you to the EW-DX media-control protocol for the full method list.
