---
title: "Play a Pandoras Box sequence over TCP"
slug: play-a-pandoras-box-sequence-over-tcp
category: "LED/Video"
tools: ["Christie Pandoras Box", "TCP"]
difficulty: Intermediate
source_url: https://pandorasboxhelpfile.com/home/tcp-ip_pb_inputprotocol.htm
labels: ["Commercial product"]
summary: "Pandoras Box connects as a TCP client to port 23. After header FF 00 00 00, (Play) runs the sequence and (Cue13) jumps to cue 13."
---

## What it does

The Pandoras Box help file (the index titles it for Pandoras Box 8.11.0 and Widget Designer 6.6.2) documents a built-in TCP/IP input for the sequence. The direction is the reverse of a normal server. The sequence is the TCP client. Your show-control machine is the TCP server, and the port is 23. The page says that port cannot be changed in Pandoras Box.

Start the server first. In the Manager, open the Sequence Inspector, enter the control machine's IP, and set the field labeled Serial port to 1. The page says the control device should then show a connected client. That Serial port field is a virtual port inherited from the older Serial Link, and it selects which sequence the bytes address. Port 1 is the fourth header byte `00`. Port 4 is `03`. The page says that is how you reach up to four sequences.

The header for Serial port 1 is the four bytes `FF 00 00 00`. After that, the commands are ASCII in parentheses:

| Command | What the page says it does |
| --- | --- |
| `(Play)` | Sets the sequence state to Play. Hex `28 50 6C 61 79 29`. |
| `(Pause)` | Sets the sequence state to Pause. |
| `(Stop)` | Sets the sequence state to Stop, which jumps to time 00:00. |
| `(Cue13)` | Moves the Nowpointer to the time of cue 13. The form is `(Cue` plus the cue id plus `)`. |

The page says you can send the header once and then send commands on their own, or you can put the header in front of every command. Its combined hex example for header plus Play is `FF 00 00 00 28 50 6C 61 79 29`. The Widget Designer lines on that page, `TCPSend` and `TCPSendHex`, are examples of how Widget Designer would emit those bytes. The bytes are the protocol.

## How to set it up

1. On the show-control machine, listen for TCP on port 23 before you point Pandoras Box at it. The help page says to start that server first, and that Pandoras Box cannot be told to use another port.
2. In the Sequence Inspector, set the IP to that server and set Serial port to 1. Wait until the server shows the sequence as a connected client.
3. Send the four header bytes `FF 00 00 00`, then the ASCII command `(Play)`. Pause is `(Pause)`. Stop is `(Stop)`, and the page says Stop jumps the sequence to 00:00.
4. Jump to a cue with `(Cue13)` for cue 13, using the cue id you stored. For a second sequence, the page says Serial port 4 uses header byte `03` instead of `00`. Keep this listener on the show network. Port 23 is fixed, and anything that can open it can send Play.

Source: [Pandoras Box TCP/IP input](https://pandorasboxhelpfile.com/home/tcp-ip_pb_inputprotocol.htm) in the [8.11.0 help file](https://pandorasboxhelpfile.com/home/hmkwindex.htm).

## FAQ

### Does my client connect to the media server?
The TCP/IP page describes the opposite. Pandoras Box opens the connection out to your server. The server has to be listening on port 23, and the Sequence Inspector has to hold that server's IP.

### What is the Serial port field if this is Ethernet?
The page says the four Serial Link ports became virtual ports for TCP. Serial port 1 is header byte `00`. Serial port 4 is header byte `03`. Each value selects one sequence, up to four.

### Can I skip the header after the first command?
Yes. The page says a later command can stand alone once the header has been sent, and it also shows the header repeated in front of `(Play)`.
