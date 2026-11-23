---
title: "Change the OnSong chart over Connect"
slug: change-the-onsong-chart-over-connect
category: "Show Control"
tools: ["OnSong", "HTTP"]
difficulty: Intermediate
source_url: https://apps.onsongapp.com/developers/connect/api/
labels: ["Commercial product"]
summary: "OnSong Connect is HTTP, discovered on port 5076. GET /api/<token>/ping returns a pong time. POST /api/<token>/state changes the open chart."
---

## What it does

OnSong Connect is the REST server inside the OnSong app. The API home page says a client discovers it with multicast DNS. The service advertises the device IP and port 5076, or a portless configuration, and the page says the port is not required and can be changed. The TXT record fields it names are `model`, `deviceid`, `version`, and `role`. `role` is `client` or `server`. The device-information example on the authentication page prints `"endpoint": "http://192.168.1.15:5076/api"`.

The authentication page says each call carries a user token of 32 characters or more as the first path segment, plus an OnSong API key. For GET and HEAD the key is the `api_key` query parameter. The host device needs an internet connection so OnSong can verify that key. A token expires in 30 days if the key is not seen again. OnSong 2026 and newer also accept `Authorization: Bearer` and `X-OnSong-API-Key`. When the bearer header is present, the path segment can be an underscore. The page says older versions ignore those headers, and that `version` in the TXT record is how you tell. `GET /api/<auth_token>/auth` returns `"success": "Token Registered"` or `"error"` of `No Token`, `Invalid Token Length`, or `Not Registered`. `PUT` on that path whitelists the token. Success text is `Token Registered` or `Token Accepted`. The error `Not Accepting Users` means the app is not taking new clients until someone allows the request on the device.

`GET /api/<auth_token>/ping` is the reachability check. The printed body is `{"pong": "2014-09-05T15:44:50.409Z"}`. An optional `keepalive` query is a number of seconds for the host to keep running in the background. `HEAD /api/<auth_token>/state` is the poll. The page says the body is empty and the client should compare `Last-Modified`. `GET` on that path returns the state object. The state class page lists `song` (with `ID`, `title`, `artist`, `key`, `favorite`, and `usefile`), `set`, `book`, `position`, `section`, and `autoScroll`. `position` is the scroll position from 0 to 100 percent as a floating-point number. `book` is `all` for All Songs and `unbound` for Unbound Songs. `POST /api/<auth_token>/state` changes the host. The printed response is an object whose keys are `"/state/song"` and `"/state/position"`, with the sample position `0.75`.

## How to set it up

1. Resolve the OnSong host with the Bonjour record the home page describes, or use the `endpoint` from `GET /api/<auth_token>/myself`. The sample endpoint is port 5076. Read `version` before you send bearer headers. Those headers are the OnSong 2026 path.
2. `PUT /api/<auth_token>/auth` with a token of at least 32 characters and the API key. If the error is `Not Accepting Users`, the authentication page says the person at the device has to allow incoming requests, and the PUT is sent again.
3. `GET /api/<auth_token>/ping` and read `pong`. Then `GET /api/<auth_token>/state` and keep `song.ID`, `song.title`, and `position`. Use `HEAD` on that path when you only need to know whether `Last-Modified` moved.
4. `POST /api/<auth_token>/state` with the state fields you want changed. The page's sample result names `/state/song` and `/state/position`, and the sample position is `0.75`. The class page says `position` is the scroll position from 0 to 100 percent as a floating-point number.
5. Keep the API key on the request. The authentication page says a token that goes 30 days without the key expires, and that the iPad has to reach the internet for the key check.

Source: [OnSong Connect API](https://apps.onsongapp.com/developers/connect/api/), [authentication](https://onsongapp.com/developers/connect/api/auth), [ping](https://onsongapp.com/developers/connect/api/ping.php), [state](https://apps.onsongapp.com/developers/connect/api/state), and the [state object](https://performers.onsongapp.com/developers/connect/api/classes/state.html).

## FAQ

### Is port 5076 required?
The home page says Connect advertises port 5076 or a portless configuration, and that the port is not required and can be changed. The `myself` example prints `http://192.168.1.15:5076/api`. Use the endpoint that response returns.

### Does a POST need the whole state object?
The state page says the body includes the properties you want to change. The sample response lists only `/state/song` and `/state/position`. `GET` is the call that returns the full object, including `song`, `set`, `book`, `section`, and `autoScroll`.

### Can the token travel only in a header?
On OnSong 2026 and newer, yes. The authentication page shows `Authorization: Bearer` and `X-OnSong-API-Key`, with the path token replaced by an underscore. It says older versions ignore the headers. The TXT `version` is the check before you drop the token from the path.
