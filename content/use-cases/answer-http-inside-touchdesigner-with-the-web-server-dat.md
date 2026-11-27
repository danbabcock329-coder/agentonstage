---
title: "Answer HTTP inside TouchDesigner with the Web Server DAT"
slug: answer-http-inside-touchdesigner-with-the-web-server-dat
category: "TouchDesigner"
tools: ["TouchDesigner", "HTTP", "WebSocket"]
difficulty: Intermediate
source_url: https://docs.derivative.ca/Web_Server_DAT
summary: "The Web Server DAT listens on its Port parameter. The docs' example is 9980. onHTTPRequest has to return the response, and the sample body names the DAT."
---

## What it does

Derivative's Web Server DAT page says the operator lets a web client connect to TouchDesigner, a browser included. It supports HTTP, WebSockets, and binary data such as images being uploaded or downloaded. How a request is handled is left to the user, through callbacks. The page says the operator can be secure, and that basic authentication is done with `authenticateBasic` on the `webserverDAT` class. It says only Basic authentication is supported that way. The token arrives in the HTTP request dictionary under `Authorization`. The same page says security is the user's responsibility, and that HTTPS is the Secure (TLS) parameter. The page says the operator is built with POCO v1.13.3.

Active starts and stops the server. Restart, while Active is on, restarts it. Port is the listen port. The page's example is 9980, reached locally at `localhost:9980`. Local Address chooses one NIC. Left blank, the page says the operator listens on all interfaces. Callbacks DAT points at the Python callbacks. `onHTTPRequest` receives the request dictionary and a response dictionary. Extra keys on the response become HTTP headers. The callback has to return the response, and that return value is what the client gets.

The class page lists the request keys that are always present: `method` (the example is `GET` or `PUT`), `uri`, `pars` for query parameters, `clientAddress`, `serverAddress`, and `data`. The response `statusCode` is an HTTP status integer. The comment in the callback file says the default is 404. `statusReason` is the reason string. `data` is the body. The sample `onHTTPRequest` sets status 200, reason `OK`, and data to `<b>TouchDesigner: </b>` plus `dat.name`, then returns that dictionary. `onWebSocketReceiveText` in the same file sends the received text back with `webSocketSendText`. There is no fixed cue, opacity, or scene route in these pages. The URI you answer is whatever the callback checks.

## How to set it up

1. Add a Web Server DAT. Set Port. The documentation example is 9980, at `localhost:9980` on that machine. Leave Local Address blank to listen on every interface, or set it to one NIC address.
2. Point Callbacks DAT at a callbacks DAT. The class page's sample `onHTTPRequest` returns status 200 and a body of `<b>TouchDesigner: </b>` plus the operator name. Turn Active on and open that URL before you add any other path.
3. Read `request['method']`, `request['uri']`, `request['pars']`, and `request['data']` inside `onHTTPRequest`. Put the body in `response['data']` and return `response`. The callback comment says a status you do not set stays 404.
4. For a socket, implement `onWebSocketOpen` and `onWebSocketReceiveText`. The sample echoes text with `dat.webSocketSendText(client, data)`. `webSocketSendBinary` is the binary send. `webSocketConnections` is the read-only list of open sockets.
5. If the server should require a password, read `Authorization` and pass that token to `authenticateBasic` with a dictionary of accepted usernames and passwords. The page says only Basic authentication is supported on that method, and that storing those passwords is up to you. Secure (TLS) switches the server to HTTPS and needs the private key and certificate paths.

Source: [Web Server DAT](https://docs.derivative.ca/Web_Server_DAT) and [webserverDAT Class](https://docs.derivative.ca/WebserverDAT_Class).

## FAQ

### Does port 9980 serve a built-in show API?
The parameter example uses 9980 and `localhost:9980`. The sample callback answers every request with status 200 and the operator name in bold. Paths such as a cue or a layer level exist only if the callback you write checks `uri` and acts on it.

### What is the status when the callback forgets to set one?
The callback comment says `statusCode` defaults to 404. The sample sets 200 and `OK` before it returns the dictionary. The page says the returned dictionary is the response the client receives.

### Is the password hidden from the project file?
The Secure page says the certificate password is only visually hidden and can still be read in Python. It says to put the Web Server DAT in a private component if that password should be encrypted when the project is saved. Basic auth passwords are a separate dictionary you pass to `authenticateBasic`.
