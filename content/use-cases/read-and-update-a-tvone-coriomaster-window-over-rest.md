---
title: "Read and update a tvONE CORIOmaster window over REST"
slug: read-and-update-a-tvone-coriomaster-window-over-rest
category: "LED/Video"
tools: ["tvONE CORIOmaster", "HTTP", "REST"]
difficulty: Intermediate
source_url: https://api.tvone.com/docs/REST%20API%20Overview_current.pdf
labels: ["Commercial product"]
summary: "CORIOmaster REST API 1.0.0, firmware M406 and later, uses HTTP Basic and HTTP 1.1. PUT updates a window. POST ActiveQueue/Play starts a queue."
---

## What it does

tvONE's REST API overview, document version 1.0.0, is the HTTP interface for the CORIOmaster family on firmware M406 and above. The supported products named on the cover are the C3-540, the C3-510, and the C3-503. The base URI is `http(s)://{device_ip}/api/{api_version}/{resource_path}`. The version token is `v` plus a number, and the overview's example is `v1`. A full example URI is `https://192.168.0.1/api/v1/Slots/Slot1`. The document says the only supported HTML version is HTTP 1.1.

GET reads a resource. POST and PUT send `Content-type: application/json`. Every call sends an Authorization header. The API uses HTTP Basic. The overview's example header is `Authorization: Basic YWRtaW46dGVzdA==`. Responses are JSON. On HTTPS, the overview says to allow sessions in the client, because that speeds up communication with the device.

The GET example reads a window at `GET https://192.168.0.1/api/v1/routing/windows/Window1`. Status 200 returns JSON that includes `Alias`, `Fullname`, and `Input`. The printed input is `Slot1.In1`. PUT updates a resource that already exists. The overview says resources are already on the device, so a write is an update, and the body may be empty of fields you are not changing. The PUT example is the same window URL with `{"Alias":"NewName"}` and an empty 200 body.

POST is reserved for RPC. The overview's example plays a queue: `POST https://192.168.0.1/api/v1/Slots/Slot1/In1/ActiveQueue/Play` with an empty body, and the success status is 200.

The status table lists 200 OK, 400 Bad Request, 401 Unauthorized, 404 Not Found, 405 Method Not Allowed, 413 Payload Too Large, 500, 501, 503, and 505. 413 is a body larger than the 16KB buffer, and the table says PUT only. 503 is insufficient resources, and the example is the concurrent connection limit. 505 is an HTTP version other than `HTTP/1.1`. A later heading calls the bad-request detail list "401 Bad Request" and spells Request as "Resquest". The status table itself uses 400 for a bad request and 401 for bad or missing credentials. The code list under that heading includes 105, an identifier that is too long, with the example of an alias of more than 19 characters, and 122, a number above the allowable range, with the example of a brightness of 200.

## How to set it up

1. Point the client at a C3-540, C3-510, or C3-503 on firmware M406 or newer. Use HTTP 1.1. Send `Authorization: Basic` plus the credentials, and send `Content-type: application/json` on PUT and POST. On HTTPS, keep the session.
2. Read the window before you write it. `GET /api/v1/routing/windows/Window1` on the device returns `Alias`, `Fullname`, and `Input`. The overview's host in that URL is `192.168.0.1`. Use the address of the frame you are driving.
3. Rename that window with PUT to the same path and a JSON body of `{"Alias":"NewName"}`. A 200 with an empty body is the overview's success. Error 105's example is an alias longer than 19 characters. Error 127 is a name already in use.
4. Start the play queue the overview prints: `POST /api/v1/Slots/Slot1/In1/ActiveQueue/Play` with an empty body. POST is the RPC method. A window update stays on PUT.
5. Keep each body at or under the 16KB PUT buffer. If `Content-length` is larger than the body, the overview says the request waits until it is cancelled and then returns 500. If `Content-length` is smaller, the leftover bytes are read as a new packet.

Source: [tvONE REST API overview, document 1.0.0](https://api.tvone.com/docs/REST%20API%20Overview_current.pdf).

## FAQ

### Which frames does this overview cover?
The cover names the C3-540, the C3-510, and the C3-503, firmware M406 and above, API document 1.0.0. The version segment in the path example is `v1`.

### Is 401 the bad-request code?
The status table says 400 is Bad Request and 401 is Unauthorized, which is missing or wrong Basic credentials. The error-code list that includes alias length and the brightness example is printed under a heading that says 401 Bad Request. Read the table for the HTTP status, then the code list for the message.

### Can POST create a window?
The overview says PUT updates a resource that already exists. POST is for an RPC such as `ActiveQueue/Play`. A path that does not exist is 404. A method the path does not allow is 405.
