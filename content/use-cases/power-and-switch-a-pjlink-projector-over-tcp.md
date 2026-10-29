---
title: "Power and switch a PJLink projector over TCP"
slug: power-and-switch-a-pjlink-projector-over-tcp
category: "LED/Video"
tools: ["PJLink", "TCP"]
difficulty: Intermediate
source_url: https://pjlink.jbmia.or.jp/english/data_cl2/PJLink_5-1.pdf
summary: "PJLink projectors and displays listen on TCP 4352. Read power, name, and class, then send one power, input, or mute command and wait for OK or ERR."
---

## What it does

The PJLink specification, version 2.10, dated 29 February 2024, is the Japan Business Machine and Information System Industries Association command set for a network projector or display. The projector or display is the TCP server. The controller is the client and opens one session per unit, identified by IP address. The port name in the control-protocol section is `pjlink`, TCP port 4352.

Every command line starts with `%`, then a one-digit class, then a four-character command, a space, a parameter of at most 128 bytes, and a carriage return (`0x0d`). Class 1 commands use `1`. Commands added in Class 2 use `2`. The command body is case-insensitive. A successful set answers `%1POWR=OK` for that command, with the class digit of the command you sent. `ERR1` is an undefined command, `ERR2` is a parameter out of range, `ERR3` is an unavailable time, and `ERR4` is a projector or display failure.

On connect, the unit speaks first. If security is off, or no password is stored, the first line is `PJLINK 0` and the next line can be a command. If security is on, the first line is `PJLINK 1` plus a space and an 8-character hex random number. The controller answers `PJLINK 2` to ask for the SHA-256 procedure. The unit then sends `PJLINK 2` plus a 32-character hex random number. The controller XORs that value with its own 16-byte random number, appends the password, and hashes the result with SHA-256. It sends its random number, the 64-character hash, and then the command. The password is 32 or fewer ASCII alphanumeric characters. A mismatch is `PJLINK ERRA`, sent after 2 seconds. The spec says the unit disconnects 30 seconds after that error if the controller does not. If the unit does not answer the security-level check as specified, the spec says it does not support this security level, and the controller should drop the session and use the older procedure. If nothing arrives within 30 seconds of the first `PJLINK 1` line, the unit disconnects.

`%1POWR 1` is lamp on. `%1POWR 0` is standby. `%1POWR ?` returns `0` standby, `1` lamp on, `2` cooling, or `3` warm-up. `%1INPT ?` returns the current input. A Class 1 input is two digits: the first is the group (1 RGB, 2 VIDEO, 3 DIGITAL, 4 STORAGE, 5 NETWORK) and the second is 1 to 9. Class 2 allows A to Z in that second character and adds group 6, INTERNAL. `%1INPT 31` is the Class 1 command for the first DIGITAL input. A missing input is `ERR2`. Standby, or a switch already underway, is `ERR3`.

`%1AVMT 11` mutes video, `%1AVMT 10` clears video mute, `%1AVMT 21` and `%1AVMT 20` do the same for audio, and `30`/`31` cover both. `%1AVMT ?` returns a two-digit state such as `11` for video mute on, `21` for audio mute on, `31` for both, and `30` for both off. The mute section says a model without the function you asked for returns `ERR2`. `%1ERST ?` returns six digits for fan, lamp, temperature, cover, filter, and other, each `0` none, `1` warning, or `2` error. `%1NAME ?` is the display name in UTF-8, up to 64 characters. `%1INF1 ?` is the manufacturer and `%1INF2 ?` is the product name, each up to 32 characters. `%1CLSS ?` returns `1` or `2`.

The same TCP connection can carry more commands for 30 seconds after the last response. The spec says the next command's result is not guaranteed if you send it before the response arrives. Authentication bytes are not required again on that connection. The controller is told to close the TCP connection when the commands are finished. If no new command arrives within 30 seconds of the last response, the unit drops the session.

Class 2 also defines a UDP search on port 4352. The start command is `%2SRCH` and a carriage return, sent to the broadcast address. The unit answers `%2ACKN=` plus its MAC address, `xx:xx:xx:xx:xx:xx`, at a random time from 0 to 10 seconds. The controller collects answers for 30 seconds.

## How to set it up

1. Open TCP to port 4352. Read the first line. `PJLINK 0` means send the next command with no hash. `PJLINK 1` means complete the SHA-256 exchange in section 5 before any command. A password mismatch is `PJLINK ERRA`.
2. Send `%1CLSS ?`, `%1NAME ?`, `%1INF1 ?`, and `%1INF2 ?`, each ending in a carriage return, and wait for each response. Then send `%1POWR ?` and `%1ERST ?`. Do not send a set while power status is `2` or `3`, or while a response is `ERR3`.
3. Send `%1INPT ?` and match the two-character code to the input you mean. Class 1 digital input 1 is `%1INPT 31`. Use a class digit of `2` only after `%1CLSS ?` returned `2`.
4. Send one set, such as `%1AVMT 11` for video mute or `%1POWR 1` for lamp on. Read `=OK`, `ERR2`, `ERR3`, or `ERR4` before you send anything else.
5. Close the socket when the check is done. The spec says the unit will drop a quiet connection after 30 seconds. Leave lamp-off and input changes off an unattended cue until `%1POWR ?` and `%1INPT ?` both match the show.

Source: [PJLink Specifications Version 2.10, 2024.2.29](https://pjlink.jbmia.or.jp/english/data_cl2/PJLink_5-1.pdf).

## FAQ

### Is the line ending a carriage return or a carriage return and line feed?
The command-line section says every command ends with one carriage return, `0x0d`. The class digit is part of the header: `%1` for a Class 1 command and `%2` for a command added in Class 2.

### What does ERR3 mean?
The response-line table calls `ERR3` an unavailable time. On power set, that includes a moment that is not a legal power change. On input, the section names standby and a switch already underway. `ERR4` is a projector or display failure. `ERR2` is a parameter the unit does not have.

### Does a search use the same port?
The search protocol uses UDP port 4352, not the TCP control session. The start command is `%2SRCH` followed by a carriage return. The answer is `%2ACKN=` and a MAC address, and the controller is told to listen for 30 seconds.
