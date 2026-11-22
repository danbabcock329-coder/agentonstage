---
title: "Switch LynTec RPC breakers and zones over HTTP"
slug: switch-lyntec-rpc-breakers-and-zones-over-http
category: "Production Ops"
tools: ["LynTec RPC", "HTTP"]
difficulty: Intermediate
source_url: https://lyntec.com/wp-content/uploads/pdfs/139-0498-01_RPC_Instructions.pdf
labels: ["Commercial product"]
summary: "LynTec RPC firmware 1.18a or later takes HTTP GET /p2.rpc. IPZ002=1 turns zone 2 on. A bare GET returns breaker, zone, and event bits."
---

## What it does

LynTec's RPC instruction bulletin 139-0498-01, cover date 2/17/11, is the install and operate guide for the Remote Power Controller. The introduction says the controller operates up to 167 remotely operated branch circuits, and that control can arrive over TCP/IP, RS-232, or DMX-512, with RS-485 optional. The cover says the equipment should be installed, operated, serviced, and maintained only by qualified electrical personnel.

Appendix B is the protocol chapter. The TCP/IP section says firmware 1.18a or later is required. Control is an HTTP GET. The printed example is `GET /p2.rpc?IPB002=1`. Three modes share that path. `B` is a breaker, `Z` is a zone, and `E` is an event. The number is three digits.

`GET /p2.rpc?IPB002=1` turns breaker 2 on. `GET /p2.rpc?IPB002=0` turns it off. The section says a four-panel system can address up to 167 breakers, and that breaker numbers come from the RPC browser setup. `GET /p2.rpc?IPZ002=1` turns zone 2 on. `GET /p2.rpc?IPZ002=0` turns it off. Zones are breaker groups configured in that same browser setup. `GET /p2.rpc?IPE001=1` turns event 1 on, and `=0` turns it off.

The event list in that section is: 1 All Breakers ON, 2 All Breakers OFF, 3 Hurry OFF, which zips all breakers off fast, 4 EO emergency override, 5 Audio Timer, marked future, 6 BO brown-out, and 7 DMX.

`GET /p2.rpc` with no query is the status read. The printed reply is three lines, `breakers=10110111111111111111`, `zones=111111111011`, and `events=1000000`. The bulletin reads that sample as a 20-breaker system with breakers 2 and 5 off and the rest on, 12 zones with zone 10 off, and event 1 active. The status legend prints 0 as OFF and 1 as ON, prints 2 as Breaker Tripped and as Processing, and prints 3 as Faulty and 4 as Empty. The worked example uses 0 and 1.

The appendix does not print a TCP port, a host header, or an authentication scheme. The controller overview says the Ethernet port is how the panel joins a computer or network for the built-in web interface. The same appendix documents a separate RS-232 byte protocol. Those bytes are not the HTTP strings above.

## How to set it up

1. Use a panel on firmware 1.18a or later. The TCP/IP section says earlier firmware does not implement this scheme. Read breaker and zone numbers from the RPC browser setup before sending a string.
2. Send `GET /p2.rpc` and keep the three status lines. Match each character to the bulletin's sample: position 1 is breaker 1, zone 1, or event 1. A 1 is on in that sample. A 0 is off.
3. Turn one zone with `GET /p2.rpc?IPZ002=1` or `=0`, using the zone number from the browser setup in place of `002`. Read `/p2.rpc` again and check that zone's character.
4. Treat event 3 as the hurry-off the bulletin describes, and event 1 as all breakers on. Leave event 4, emergency override, and event 6, brown-out, out of an unattended client. The bulletin names both.
5. Keep the client off the panel unless the person sending the GET is the qualified electrical personnel the cover requires for operating this equipment. The strings change breaker state.

Source: [LynTec RPC instruction bulletin 139-0498-01](https://lyntec.com/wp-content/uploads/pdfs/139-0498-01_RPC_Instructions.pdf), Appendix B, TCP/IP protocol.

## FAQ

### Does the bulletin print the HTTP port?
The TCP/IP section prints the GET strings and the firmware floor, 1.18a. It does not print a port number. The Ethernet port in the controller overview is the network connection for the built-in web interface.

### How many breakers can one string address?
The section says control of up to 167 breakers on a four-panel system. The sample status line is 20 characters, one per breaker in that example, and breaker 2 is the second character.

### Is RS-232 the same text?
Appendix B also prints binary zone commands that start with `0xB0`. The HTTP scheme is the GET path `/p2.rpc`. A client written for the GET strings is not speaking those bytes.
