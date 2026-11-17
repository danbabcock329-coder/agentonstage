---
title: "Switch NETIO power outputs over JSON"
slug: switch-netio-power-outputs-over-json
category: "Production Ops"
tools: ["NETIO", "JSON", "HTTP"]
difficulty: Intermediate
source_url: https://www.netio-products.com/files/NETIO-M2M-API-Protocol-JSON.pdf
labels: ["Commercial product"]
summary: "NETIO JSON API 2.4 is an HTTP GET or POST of /netio.json. Action 1 turns an output on. An accepted write returns HTTP 200 and the status file."
---

## What it does

NETIO's M2M API protocol document, JSON version 2.4, published 20 July 2021, describes a file-based control API for its networked power outputs. The device is the HTTP server. The client downloads or uploads one JSON document. HTTPS is off by default. The document says only some devices, and it names the PowerPDU 4C, support HTTPS. The JSON protocol has to be enabled in the web administration first, under M2M API Protocols, on the JSON API tab. Saving those settings restarts the device web server.

A read is an HTTP GET of `/netio.json`, or a POST with no file. The document's example is `http://192.168.1.1/netio.json`. It also says the HTTP port can be a port other than 80, and that XML, JSON, and the URL API share one HTTP port. A write is an HTTP POST of a JSON body to the same path. The document says a partial body is enough. The sample that turns output 1 on is an `Outputs` array with one object, `ID` 1 and `Action` 1. If the command is accepted, the device returns HTTP 200 and a status JSON file in the same structure as a read.

Action values in the write section are 0 off, 1 on, 2 short off, 3 short on, 4 toggle, 5 no change, and 6 ignore. State is the other write option: 0 off or 1 on, and it requires Action 6. Any Action other than 6 takes priority over State, and State is not applied when Action is 1 through 5. A read always returns Action 6 on every output. The document calls that an ignore placeholder. The live on or off value is State. The short-on example is output 2 with Action 3 and Delay 15000, which the heading describes as on for 15 seconds and then off. Delay is in milliseconds. The web administration's short-delay interval is rounded up to hundreds of milliseconds.

The protocol summary says the default read/write account is username `netio` and password `netio`. The JSON API settings description later in the same document says an empty username and password means no authentication, and it describes the WRITE password default as the device MAC address without colons, in lowercase. Credentials are HTTP Basic authentication in the header. The document also shows them in the URL. Read and write can use different usernames. The security note says not to keep the default usernames and passwords, and to keep the Ethernet and Wi-Fi networks secured.

After power-up, all outputs stay off for the first 5 to 30 seconds, depending on the model. They then follow each output's power-up setting: last state, on, or off. The document says an enabled scheduler can change that during startup. Metering fields such as Voltage, Current, and Load are not on every model. The PowerBOX 3Px listing in the document has no metering values. The PowerDIN 4PZ note says just 2 of 4 outputs are metered.

The status table is 200 for an authorized command that was received, 400 for a control-command syntax error, 401 for an invalid username or password, 403 for read only, and 500 for an internal error or a server that is not fully started yet, including after a settings change or restart.

## How to set it up

1. Open the device web administration, choose M2M API Protocols, and open the JSON API tab. Enable the JSON API. Set a READ account and a WRITE account, or leave both blank only if you intend the document's "no authentication" case. Save, and wait for the web server restart the document describes.
2. Read `http://<device>/netio.json` with HTTP GET. Confirm `Agent.NumOutputs` and each output `ID`, `Name`, and `State` before you send a write. Use the port shown as the current JSON port if it is not 80.
3. POST `{"Outputs":[{"ID":1,"Action":1}]}` to the same path to turn output 1 on. Use Action 0 to turn it off. Send the WRITE username and password as HTTP Basic authentication.
4. For a timed pulse, POST output 2 with Action 3 and Delay 15000. The document's heading for that body is on for 15 seconds, then off. Action 4 toggles. Action 6 with State 1 is the other way to turn an output on.
5. Treat HTTP 200 as accepted and read the returned `State`. HTTP 403 means the account is read only. HTTP 401 means the username or password was rejected. HTTP 400 means the control command syntax was not accepted.

Source: [NETIO JSON M2M API, version 2.4](https://www.netio-products.com/files/NETIO-M2M-API-Protocol-JSON.pdf).

## FAQ

### Which Action value is on?
The write section lists Action 1 as on and Action 0 as off. Action 4 toggles. Action 6 ignores Action and uses State, where State 1 is on and State 0 is off.

### Why does a read show Action 6 when the output is on?
The document says a returned status file always contains Action 6 for every output. That value means ignore and is a placeholder. The output state, 0 or 1, is in State.

### Does every NETIO model meter the load?
The document limits metering variables to named models, including the PowerPDU 4C, PowerCable REST, PowerBOX 4Kx, PowerDIN 4PZ, and PowerPDU 8QS. Its PowerBOX 3Px example has no metering values, and its PowerDIN 4PZ note says only 2 of 4 outputs are metered.
