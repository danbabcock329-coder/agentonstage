---
title: "Advance OpenLP slides over the HTTP API"
slug: advance-openlp-slides-over-the-http-api
category: "Show Control"
tools: ["OpenLP", "HTTP"]
difficulty: Intermediate
source_url: https://gitlab.com/openlp/wiki/-/wikis/Documentation/HTTP-API
summary: "OpenLP 3's HTTP API v2 listens on port 4316. POST /api/v2/controller/progress with action next advances the live slide and returns 204. A missing body is 400."
---

## What it does

OpenLP's HTTP API wiki documents version 2 of the API for OpenLP 3. The same page says version 1 is deprecated and may be removed. The server is the web remote. The wiki says the port is 4316 by default, and every v2 route starts with `/api/v2`. The OpenLP 3 reference manual puts that server under Settings, Remote Interface. Listen IP address is the computer's address, or 0.0.0.0 to listen on every interface. The manual says to leave the port number alone if you do not need to change it, and its worked example is `192.168.1.104:4316`. The wiki says the server is only on the local network and recommends against exposing it to the internet.

The current v2 source registers four blueprints: `/api/v2/controller/`, `/api/v2/core/`, `/api/v2/service/`, and `/api/v2/plugins/`. The wiki's getting-started example for a live image leaves out `/core`. The core blueprint's live-image route is `/api/v2/core/live-image`.

`GET /api/v2/core/system` needs no login. The current core source returns `websocket_port` and `login_required` from settings, `api_version` set to 2, and `api_revision` set to 7. The wiki says `api_version` and `api_revision` were added in OpenLP 3.0.2. The websockets page says the WebSocket server, which pushes program state, defaults to port 4317 and is separate from this HTTP port.

`GET /api/v2/service/items` lists the service. Each item includes `id`, `title`, `plugin`, `notes`, `ccli_number`, `selected`, and `is_valid`. `selected` is true for the item that is live. `GET /api/v2/controller/live-items` returns the live item and its slides, with `selected` true on the current slide. The wiki says that route returns `{}` when nothing is live.

Changing the live slide is `POST /api/v2/controller/progress`. The controller source reads JSON `action`, lowercases it, and accepts only `next` or `previous`. Success is HTTP 204 with an empty body. A missing body, or any other action, is HTTP 400. `POST /api/v2/controller/show` reads JSON `id`. The wiki calls that id a 0-based slide index. A missing body is HTTP 400. The source then emits the id and returns 204.

`POST /api/v2/service/progress` uses the same `next` and `previous` actions to move between service items, with the same 204 and 400 outcomes. `POST /api/v2/service/show` takes JSON `id` or `uid`, or the id in the URL `/api/v2/service/show/<item_id>`. The service source accepts the UUID from the items list, or an integer, and returns 400 when that id is missing.

`POST /api/v2/core/display` reads JSON `display`. The core source lowercases it and accepts `hide`, `show`, `blank`, `theme`, or `desktop`. Anything else, or a missing body, is 400. Success is 204.

Those write routes are wrapped in `login_required`. If the setting `api/authentication enabled` is off, the wrapper calls the route. If it is on, the `Authorization` header must equal the server's authentication token, or the response is 401. The header value is the token itself. `POST /api/v2/core/login` with JSON `username` and `password` returns `{"token": "..."}` when they match the stored user id and password, and 401 when they do not. A missing body is 400. The manual's User Authentication option is the userid and password for update functions on the remote interface, and it says that option can be changed without restarting OpenLP.

`GET /api/v2/service/new` is also login-gated. The wiki says it does not save the existing service. Leave it out of a show client.

## How to set it up

1. In OpenLP, open Settings, Remote Interface. Set Listen IP address to the computer's address, or to 0.0.0.0. Leave the port at the default unless you have a reason to change it. The HTTP API wiki says that default is 4316. The manual's example URL is `http://192.168.1.104:4316`.
2. `GET /api/v2/core/system` and read `login_required`, `websocket_port`, `api_version`, and `api_revision`. If `login_required` is true, `POST /api/v2/core/login` with `{"username":"...","password":"..."}` and send the returned `token` as the `Authorization` header on later writes.
3. `GET /api/v2/service/items` and note `id`, `title`, and `selected`. `GET /api/v2/controller/live-items` and note which slide has `selected` true. An empty object means nothing is live.
4. Advance the current item with `POST /api/v2/controller/progress` and `{"action":"next"}`. Expect 204. `{"action":"previous"}` goes back one slide. Move to another service item with `POST /api/v2/service/progress` and the same action values, or `POST /api/v2/service/show` with the `id` you just read.
5. Blank the display with `POST /api/v2/core/display` and `{"display":"blank"}`. Bring it back with `{"display":"show"}`. Do not call `GET /api/v2/service/new` from the show client. The wiki says that route does not save the service that is open.

Source: [OpenLP HTTP API](https://gitlab.com/openlp/wiki/-/wikis/Documentation/HTTP-API), [Remote Interface in the 3.0 manual](https://manual.openlp.org/configure.html), [WebSockets](https://gitlab.com/openlp/wiki/-/wikis/Documentation/websockets), and the [v2 blueprints](https://gitlab.com/openlp/openlp/-/blob/master/openlp/core/api/versions/v2/__init__.py) on the OpenLP source tree.

## FAQ

### Does the progress call use a query string?
The controller source reads a JSON body. `action` has to be `next` or `previous` after it is lowercased. A missing body is HTTP 400. Success is HTTP 204 and an empty body.

### Where does the token go?
The `login_required` wrapper reads the `Authorization` header and compares it to the server token. The header value is the token returned by `/api/v2/core/login`. When authentication is not enabled, the wrapper does not check the header.

### What does a slide id of 0 mean?
The HTTP API wiki says the `id` on `POST /api/v2/controller/show` is a 0-based slide index. Service-item ids from `GET /api/v2/service/items` are the item's own id string. The service show route also accepts an integer.
