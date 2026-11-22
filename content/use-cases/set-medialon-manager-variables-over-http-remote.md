---
title: "Set Medialon Manager variables over HTTP Remote"
slug: set-medialon-manager-variables-over-http-remote
category: "Show Control"
tools: ["Medialon Manager", "HTTP"]
difficulty: Intermediate
source_url: https://portal.7thsense.one/medialon-help/mxmMedialonHTTPRemote.html
labels: ["Commercial product"]
summary: "Medialon HTTP Remote 6.7.2 serves published Manager variables on port 80. SETVARIABLES_XML writes one. GETVARIABLES_XML reads them back as XML."
---

## What it does

The Medialon HTTP Remote module, version 6.7.2 on the 7thSense help page, connects a Manager project to a web browser over HTTP. The exchange is XML. It is listed for Manager V7, Manager V6 Lite and Pro, and Showmaster Mini. The resource type is TCP/IP.

The device setup dialog has a listening port. The page says the default is 80. A published-files folder is the only directory Manager will serve. The page says a page can read or write Manager variables only when Manager itself sent that page from this folder. Variable access is limited to the variables checked in the setup. That checked set can be changed later.

The page prints four browser requests. Setting a variable named `Led` to 1 is `SETVARIABLES_XML?VARIABLENAME=Led &VARIABLEVALUE=1`. The space before the ampersand is in the printed string. Success is `<SETVARIABLE><RESULT>Ok</RESULT></SETVARIABLE>`. Reading the published variables is `GETVARIABLES_XML`. The sample reply is a `MANAGER` element with `SUBJECT="VARIABLES"` and one `VARIABLE` per name. The sample names are `Led1`, `Led2`, and `Led3`, each with a `VALUE`. Reading a list variable is `GETLIST_XML=List1&.`. The sample reply uses `SUBJECT="LISTE"`, a `NUMBER`, and `OPTION0`, `OPTION1`, `OPTION2`. A private request is `PRIVATEREQUEST_XML=What &.`. The page says the browser is the master: Manager does not push into the page until the browser asks. A monitored control has to poll from a timer in the page.

The page identifies each browser by an ID and can return its IP address. It says an ID is dropped if that browser does not communicate for more than ten seconds. The device variable `Status` is an enum: `Idle` when Manager is stopped, `Listening` when the server is up with no client, `Connected` when at least one client has requested, `Error` when a client hits a variable that is not published, and `Listen error` when the port could not be opened. The same status section says a client is treated as disconnected if it makes no request for five seconds. `ClientsConnected`, `ClientsIDsList`, `PrivateRequestCount`, and `LastFileUpload` are the other device variables. `Listen error` is what the page names when another server already holds the port, or when a second HTTP Remote device uses the same port.

The code samples create `microsoft.xmldom` with `ActiveXObject`. The page says the browser must comply with Internet Explorer 5, and that another browser needs its own parser adapted to the same requests. The commands inside Manager for a private request are Read private request and Answer to private request. The answer has to be XML or the page says the browser throws an error.

## How to set it up

1. Add HTTP Remote in Manager. Leave the listening port at 80 unless the dialog reports that port in use. The page says a new device increments the port so the Ok button is not grayed.
2. Check only the variables an outside client should read or write. Put the HTML page in the published-files folder and open it through Manager's test link. The page says a file loaded straight from disk cannot reach the variables.
3. Request `GETVARIABLES_XML` on that port and read each `VARIABLE` `NAME` and `VALUE`. Write one checked variable with `SETVARIABLES_XML`, using the variable name and the value. Wait for `<RESULT>Ok</RESULT>`.
4. Poll `GETVARIABLES_XML` when the client needs live values. The page says Manager does not push. Treat an idle gap the way the status section describes: five seconds with no request and the client counts as disconnected, and more than ten seconds and the ID is dropped.
5. Keep unpublished variables off the client. The status enum calls a write to one of those an `Error`.

Source: [Medialon HTTP Remote](https://portal.7thsense.one/medialon-help/mxmMedialonHTTPRemote.html), module 6.7.2.

## FAQ

### Does the page print a password on the request?
The connection section says a password check can be built from the browser ID and private requests. The four printed requests do not include a password field. `SETVARIABLES_XML` carries `VARIABLENAME` and `VARIABLEVALUE`.

### Which variables can a client change?
Only the ones checked in the device setup. The page says the published set can be edited at any time. A client that tries a variable outside that set is the case the status enum calls `Error`.

### Is the list reply spelled LIST?
The sample list document is `<MANAGER SUBJECT="LISTE">`, with `NUMBER` and `OPTION` plus a zero-based index. The variables document uses `SUBJECT="VARIABLES"`.
