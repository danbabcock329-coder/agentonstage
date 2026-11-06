---
title: "Route a Riedel Artist intercom from Companion over RRCS"
slug: route-a-riedel-artist-intercom-from-companion-over-rrcs
category: "Production Ops"
tools: ["Riedel Artist", "RRCS", "Bitfocus Companion"]
difficulty: Advanced
source_url: https://bitfocus.io/connections/riedel-rrcs
summary: "Companion's Riedel RRCS module v1.1.0 routes an Artist matrix through RRCS. The page says it was tested with RRCS 8.6.1."
---

## What it does

Bitfocus lists a community Companion connection named Riedel - RRCS, version 1.1.0, by Phillip Ivan Pietruschka. It controls a Riedel Artist intercom matrix through the Riedel Router Control System. The page, and the module's HELP, say it was tested with RRCS 8.6.1.

A port can be picked from a dropdown, which fills in only while the connection is online, or typed as an address. The HELP says an address is normally two, three, or five period-separated numbers, such as `net.node.port`, and that the address can include variables so a button can be built before the system is online. Functions that only accept a `node.port` address work in the same net as RRCS. The Local Panel setting should be a panel in that net. The module also uses Local Panel to filter the dropdown for functions that only operate on the local net.

Actions on the page: Conference, get all and edit. Crosspoint, get all active, set, and set volume. GP, set output. IFB, get all and mix-minus volume. Key, label and marker, lock, and press. Logic, get all sources and set source. Port, clone, get all, set IO gain, set alias, and set label.

Feedbacks: crosspoint, GP input, GP output, logic source, port details, and send string. The received-string variable stores the latest send-string message. Send String feedback stays true while a matching string is asserted, until a send-string-off notification clears it. The action recorder can store set crosspoint, set GP output, and set logic source. The page says recorded Set Crosspoint and Set GP Output actions are always created with a decimal address.

The limits on the page are the part that matters in a show. Crosspoint Set Volume does not work when the destination port is connected to an Artist-1024. GP Input feedback does not work with panels connected to an Artist-1024. Logic source actions and feedbacks appear only after RRCS has reported configured logic sources, so they cannot be set up offline. RRCS numbers ports and GPIO from 0. The module converts those to 1-based numbers so they match Director. Logs inside the module stay 0-based. Update on Configuration Change runs every Get All when RRCS reports a config change. The page says that keeps dropdowns and feedbacks current, and that it can be heavy on a large, busy network.

## How to set it up

1. Add the Riedel - RRCS connection in Companion. The Bitfocus page lists community version 1.1.0. The module source is the `bitfocus/companion-module-riedel-rrcs` repository.
2. Set Local Panel to a panel on the same net as RRCS. Functions that only take a `node.port` address only work in that net, and the dropdown filter for local-net functions uses this setting.
3. Bring the connection online and run Get All for conferences, IFBs, logic sources, and ports. Those actions refill the dropdowns. If you are programming offline, type the address, including variables, instead of waiting for the list.
4. Use Crosspoint Set for a route, then read the crosspoint feedback. Leave Crosspoint Set Volume off any destination that lands on an Artist-1024. The page says that action does not work there.
5. Count ports and GPIO the way the module shows them, 1-based, so they match Director. RRCS itself is 0-based, and the module's logs stay 0-based. A number you copy out of a log is not the number you put on the button.
6. Leave Update on Configuration Change off on a large network unless the dropdowns have to refresh on every RRCS config change. The page says that option runs all Get All actions and can be burdensome.

Source: [Bitfocus Riedel - RRCS](https://bitfocus.io/connections/riedel-rrcs) and [bitfocus/companion-module-riedel-rrcs](https://github.com/bitfocus/companion-module-riedel-rrcs).

## FAQ

### Which RRCS version is this written against?
The Bitfocus page and the module HELP say the connection was tested with RRCS 8.6.1. They do not list other versions.

### Why do port numbers disagree with RRCS?
The page says RRCS is 0-based for ports and GPIO. The module converts them to 1-based numbers so they match Director. Internal logs stay 0-based.

### What fails on an Artist-1024?
Crosspoint Set Volume, when the destination port is connected to an Artist-1024, and GP Input feedback for panels connected to an Artist-1024. The page states both limits.
