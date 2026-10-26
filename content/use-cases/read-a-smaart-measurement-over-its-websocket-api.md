---
title: "Read a Smaart measurement over its WebSocket API"
slug: read-a-smaart-measurement-over-its-websocket-api
category: "Audio"
tools: ["Smaart", "WebSocket"]
difficulty: Intermediate
source_url: https://www.rationalacoustics.com/pages/integration-with-3rd-party-products
labels: ["Commercial product"]
summary: "Smaart's API is JSON over a WebSocket. Turn it on in Preferences and another program can read spectrum and transfer-function data and control measurement parameters."
---

## What it does

Rational Acoustics ships an API with each Smaart product. The integrators page says it gives programmatic access to measurement data and measurement parameters, using a JSON text command structure over a WebSocket. The API is free to use. The software development kit is free on request, so the command names are not published on that page. This entry does not invent them.

The support article "Tips for Using Smaart's API" says the API is how other applications, and other copies of Smaart, access and control measurements on the network. It names Waves TRACT and Lake Controller as examples. Both programs have to be open before a connection is attempted. Smaart listens on every network adapter, including wireless. Hovering the IP Address field in the API preferences lists the host addresses. The port is required as well. The article's Web Viewer example is `192.168.0.1:26000`, with the port after the address. That example is for the Web Viewer. The article does not print a single port that every client must use.

Discovery is a UDP broadcast. The article says routers generally do not forward those broadcasts, so auto-discovery fails across a router unless that router is set to forward the traffic. On one subnet, typing the server IP and port is the path the article says will connect. It also says most API problems it sees are firewalls or the two computers not sharing an address range.

What third-party products actually do with the API is listed on the integrators page, and it depends on the Smaart version they name. FIR Designer (v8 and v9) can control measurement parameters, stream live spectrum and transfer-function measurements, and extract data. Lake Controller (v7, v8, and v9) overlays spectrum or transfer function on its EQ and can control the signal generator. Waves TRACT (v8, Di v2, and v9 Suite, RT, and LE) overlays spectrum or transfer function inside MultiRack, eMotion LV1, or a DAW. Outline Isaac (v8.3 and later, and v9) adds delay finding and delay tracking. Powersoft ArmoniaPlus (v8 and v9) can store captured traces for offline tuning. Those are the products' claims as Rational Acoustics prints them, not a promise that every JSON client gets every one of those calls.

## How to set it up

1. On the Smaart computer, open Options, Preferences, API, and enable the API. The support article says this is the first step for the Web Viewer, a remote Smaart client, and third-party integrations.
2. Leave Smaart running. The article says the client application has to be running too before you connect.
3. Read the host address from the IP Address field in that dialog. Put the client on the same subnet. If a software firewall or a router firewall is in the way, allow Smaart and the client's address.
4. If the client is the Web Viewer, the article's URL form is the IP, a colon, and the port, as in `192.168.0.1:26000`. For another client, use the IP and port that client asks for. Do not rely on UDP discovery if a router sits between the two machines.
5. The command schema is the SDK, which the integrators page says is available on request. Ask Rational Acoustics for it before an assistant sends JSON. Write down the Smaart version, because the integrators page ties each product to specific versions.

Source: [Integration with 3rd party products](https://www.rationalacoustics.com/pages/integration-with-3rd-party-products) and [Tips for Using Smaart's API](https://support.rationalacoustics.com/support/solutions/articles/150000092223-tips-for-using-smaart-s-api-web-viewer-remote-client-third-party-integrations-etc-).

## FAQ

### Is there a public list of JSON commands?
Not on the pages above. The integrators page says the SDK is free and that you request it. Until that document is in hand, an assistant should not guess command names.

### Will discovery work from another VLAN?
The support article says discovery is a UDP broadcast and that routers generally do not forward it. The same article says a manual IP and port works when both computers are on the same network.

### Does this drive the generator and capture traces?
Lake Controller, ArmoniaPlus, RAM Audio, and Outline Isaac are described on the integrators page as controlling the generator, and some of them as capturing traces. Which calls exist is version-specific and lives in the SDK, not on the marketing page.
