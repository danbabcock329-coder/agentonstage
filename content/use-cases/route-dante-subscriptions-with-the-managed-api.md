---
title: "Route Dante subscriptions with the Managed API"
slug: route-dante-subscriptions-with-the-managed-api
category: "Audio"
tools: ["Dante Domain Manager", "Dante Director", "GraphQL"]
difficulty: Intermediate
source_url: https://www.getdante.com/products/network-management/dante-managed-api/
labels: ["Commercial product"]
summary: "Dante Domain Manager and Dante Director expose a GraphQL API that lists domains and devices, enrolls them, and sets channel subscriptions without opening Dante Controller."
---

## What it does

Audinate's Dante Managed API is the supported way to control and monitor Dante subscriptions from something other than Dante Controller. The product page says it is included at no charge for Dante Domain Manager, Dante Director, and Dante Connect customers, and that a typical use is a touch panel that switches a room between two microphones. The same page lists prebuilt clients: a Crestron module for Series 3 or 4 processors that support Crestron Web Services, an AMX Duet module for NX controllers, and a Bitfocus Companion integration against the API in Dante Domain Manager v1.5 and higher. Companion is described there as being in beta.

The user guide (AUD-MAN_Managed_API, document version 1.8, published 2 April 2025) says a client can query the status of a device or domain, set audio and video subscriptions, and enrol or unenroll devices. Audinate's support article, updated 5 May 2026, is narrower and concrete: list domains, devices, and channels; read device and domain status; create and delete channel subscriptions; enrol devices that have already discovered Domain Manager and appear as unmanaged; and unenrol devices. It says further API work is planned and points at the user guide's limitations.

The interface is GraphQL. For Dante Director the guide's URL is `https://api.director.dante.cloud/graphql`. For Domain Manager it is the server's base URL plus `/graphql`. The guide's example is `https://ddm.orgname.com/graphql`. The guide's cURL example sends `Content-Type: application/json` and puts the API key in an `Authorization` header. A domain-status query returns `clocking`, `connectivity`, `latency`, `subscriptions`, and `summary`. The guide notes that Director's user interface calls domains "sites".

A device query returns receive channels with `subscribedDevice`, `subscribedChannel`, and `status`. The guide says a receive-channel status of `DYNAMIC` is a connected unicast subscription and `STATIC` is a successful multicast subscription. Setting routes is the mutation `DeviceRxChannelsSubscriptionSet`. The example input is a `deviceId` plus a `subscriptions` array of `rxChannelIndex`, `subscribedDevice`, and `subscribedChannel`. Channels left out of that array stay as they are. The receiver is identified by id and index, and the transmitter by name, because the receiver stores the transmitter by name. `"ok": true` means the subscription request was sent. The guide says to query the receive channel again, because the device can take a few seconds to connect, and that Dante Controller can confirm the same status after it is logged into Domain Manager or Director and the domain is selected. The clearing section says to pass empty strings for the `txDeviceName` and `txChannelName` fields.

Limitations in the guide, from Domain Manager 1.5: devices in legacy mode (in general, Dante software before 4.0) still pass audio but do not appear in API queries and cannot be controlled; virtual devices used for Shared Audio Groups are not recognized; AES67 and SMPTE ST 2110 channel subscriptions are not supported, only native Dante flows.

## How to set it up

1. The API shipped in Dante Domain Manager v1.5. The guide says API access can be turned on or off in the Domain Manager administration menu, and that it is on by default for a fresh install and for an upgrade from v1.4 or earlier.
2. On Domain Manager, a user with the Site Control role enables API key management under Settings, Network & Security, API, "Allow users to create and manage API keys". The guide says that switch is off by default, and that it is hidden if API access itself is disabled. Then Settings, Personalization & API Keys, Add New Key. The key is shown once. It shares the privileges of the user who created it. The guide says to make a restricted user first if the key should not be an administrator.
3. On Dante Director, an administrator uses Settings, API Keys, Add Service Key, names it, and chooses full access to all sites or a restricted set of sites. Keys do not expire. They can be revoked, and on Director their access restrictions can be changed. The guide says not to share the key.
4. Import the Postman collection linked from that same settings page, or send GraphQL yourself. Set the URL variable to the Director host above, or to the Domain Manager host plus `/graphql`, and set the API key variable. Read domain status before changing a subscription.
5. After `DeviceRxChannelsSubscriptionSet` returns `"ok": true`, read the receive channel again, or look at Dante Controller logged into the same domain. Do not treat the mutation result as proof the route is up.

Source: [Dante Managed API](https://www.getdante.com/products/network-management/dante-managed-api/), [What can the API do?](https://support.getdante.com/hc/en-gb/articles/5508295619231-What-can-the-API-do), and the [user guide PDF](https://dev.audinate.com/GA/managed-api/userguide/pdf/latest/AUD-MAN_Managed_API_v1.8.pdf) (version 1.8).

## FAQ

### Can this replace Dante Controller on an unmanaged network?
No. The product page and the user guide both require devices enrolled in Dante Domain Manager or Dante Director. The support article's enrol step only applies to devices that have already discovered Domain Manager and show up as unmanaged.

### Does a successful mutation mean audio is passing?
The guide says `"ok": true` means the subscription request was sent. Check the receive-channel status, or Dante Controller, before calling the route good.

### Will it subscribe an AES67 or a pre-4.0 device?
The user guide says no for both. Legacy-mode devices are omitted from queries. Only native Dante flows can be subscribed through the API.
