---
title: "Set Lutron QS zone levels over Telnet"
slug: set-lutron-qs-zone-levels-over-telnet
category: "Lighting"
tools: ["Lutron", "QSE-CI-NWK-E", "Telnet"]
difficulty: Intermediate
source_url: https://assets.lutron.com/a/documents/040249.pdf
labels: ["Commercial product"]
summary: "A Lutron QSE-CI-NWK-E takes the integration protocol on Telnet port 23. Query a zone, then set one level and fade, and read the level back."
---

## What it does

Lutron's integration protocol guide, P/N 040249 Rev. AH, dated May 2022, is the text a third-party system uses to execute, query, and monitor a Lutron system through an integration access point. The QS Standalone section documents the QSE-CI-NWK-E network interface. It has RS-232 and Ethernet, and the connection section says communication is through one of them, not both at the same time. RS-232 is 9600, 19200, 38400, or 115200 baud from the DIP switch, 8 data bits, no parity, 1 stop bit, and no flow control. Ethernet integration is Telnet. The guide says the Telnet server is limited to ASCII, the port number is 23, and the two logins are `nwk` and `nwk2`. Logins can be configured to require a passphrase. The password examples use a `QSE>` prompt.

A command starts with one operation character: `#` to execute, `?` to query, or `~` for a monitor or a reply. Fields are separated by commas and the line ends with carriage return and line feed. The integration id is the address assigned during setup, not a channel the client invents.

`OUTPUT` is the command for a dimmer, a contact closure, or another output. Action 1 sets or gets the zone level. The level is 0 to 100, or 0.00 to 100.00, followed by the fade time. The guide's worked example `#OUTPUT,1,1,75,01:30` sets integration id 1 to 75% with a fade of 1 minute 30 seconds. `?OUTPUT,3,1` asks for the level of integration id 3. The printed reply, including the case where someone changed the dimmer locally, is `~OUTPUT,3,1,90.00` when that level is 90%. For a switched output, the notes say any non-zero level is on or closed and 0 is off or open. Action 2 starts a raise, 3 starts a lower, and 4 stops the raise or lower. Action 5 starts flashing. The note says flashing stops when the zone is sent to a valid level with action 1.

The guide's integration advice says a scene that involves several lights should be built in the Lutron system and fired with one `#DEVICE` command, rather than a series of `#OUTPUT` commands. `#DEVICE,2,4,3` is the printed example: integration id 2, component number 4, action number 3. Action 3 in the DEVICE table is "Press, Close, or Occupied." Component numbers come from the device-specific tables, not from the output id.

An invalid line is `~ERROR` plus a number. 1 is a parameter count mismatch, 2 means the object does not exist, 3 is an invalid action number, 4 is parameter data out of range, 5 is malformed parameter data, and 6 is an unsupported command. The printed out-of-range example is `#OUTPUT,11,1,120.00`, answered `~ERROR,4`.

`#ETHERNET` changes the interface address. `#RESET` restarts the interface or restores factory defaults. `#PASSWD` changes the passphrase and, the note says, works only in a Telnet session. A forgotten passphrase is recovered by logging in as `reset`, and the guide says that procedure needs physical access to a DIP switch. This entry does not send those three commands.

Zone monitoring is one of the types the guide says are enabled by default for a user-level Telnet login. A `~OUTPUT` line can therefore arrive because someone changed a level in the room, not only because this client asked.

## How to set it up

1. Open Telnet to the QSE-CI-NWK-E on port 23 and log in as `nwk` or `nwk2`. If a passphrase is configured, the guide says the login requires it. Use the prompt the password section shows, `QSE>`, as the sign that the session is ready. Do not also open the RS-232 port. The connection section says the two are not used together.
2. Resolve the integration id before you write a level. `?INTEGRATIONID,3,<id>` returns the device behind that id, and `?DETAILS,<id>` returns family, model, and software revision. An unknown id comes back as `~ERROR,2`.
3. Read the zone with `?OUTPUT,<id>,1` and a carriage return plus line feed. Use the `~OUTPUT` level in the reply, not a level remembered from an earlier show.
4. Set one zone with `#OUTPUT,<id>,1,<level>,<fade>`, for example the guide's own `#OUTPUT,1,1,75,01:30` when id 1 should go to 75% in 1:30. Query the same output again. For a switched load, send 0 or a non-zero level only. A level of 120 is the guide's example of `~ERROR,4`.
5. For a look that is more than one light, fire the button already programmed in the Lutron system with one `#DEVICE` press, action 3, instead of a burst of `#OUTPUT` lines. Leave `#ETHERNET`, `#RESET`, `#PASSWD`, raise/lower actions 2 and 3, and flash action 5 out of an unattended session.

Source: [Lutron Integration Protocol, P/N 040249 Rev. AH, May 2022](https://assets.lutron.com/a/documents/040249.pdf).

## FAQ

### What is the Telnet login on a QSE-CI-NWK-E?
The QS network-interface section says port 23, login `nwk`, and login `nwk2`. It also says logins can be configured to require a passphrase. The password examples show a `QSE>` prompt.

### How is a fade written?
The OUTPUT example uses `01:30` for 1 minute and 30 seconds on `#OUTPUT,1,1,75,01:30`. The field notes also allow seconds, minutes and seconds, or hours, minutes, and seconds. Fractions are rounded up to the nearest quarter second.

### What does a tilde line mean if this client did not just query?
`~` is the monitor operation. The guide says a monitor is sent when requested or after a change, and that zone monitoring is on by default for a user-level Telnet login. Read `?OUTPUT,<id>,1` when you need the level this session should trust.
