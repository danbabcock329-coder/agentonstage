---
title: "Tie an Extron DTP CrossPoint over SIS"
slug: tie-an-extron-dtp-crosspoint-over-sis
category: "LED/Video"
tools: ["Extron DTP CrossPoint", "SIS", "TCP"]
difficulty: Intermediate
source_url: https://media.extron.com/public/download/files/userman/68-2368-51_B.pdf
labels: ["Commercial product"]
summary: "Extron's DTP CrossPoint 4K setup guide, 68-2368-51 Rev. B, takes SIS on TCP port 23. The command 1*3! ties input 1 to output 3 for video and audio."
---

## What it does

Extron's DTP CrossPoint 4K Series Setup Guide, part 68-2368-51 Rev. B, documents SIS control of that scaling presentation matrix. Open a TCP connection to port 23 at the switcher's IP address. The guide's factory default address is 192.168.254.254. The switcher answers with a copyright line that includes the product name, firmware, part number, and the current date and time.

If no password is set, the guide says the switcher is ready for SIS commands. If a password is set, it sends a Password prompt. A wrong password repeats that prompt. A correct one returns `Login User` or `Login Administrator`. The guide says the factory configured passwords for the accounts on this device are the device serial number, and that a complete system reset changes them to no password.

The guide allows up to 200 simultaneous TCP connections, counting HTTP sockets and Telnet. It says the switcher gives no error when that limit is reached, and it tells you to keep the number of connections low and close sockets you are not using. Each SIS response ends with carriage return and line feed. The guide's symbol list uses a visible mark for a space.

A tie of video and audio is `input*output!`. The guide's example `1*3!` returns `Out3 In1 All`, which it describes as tying input 1 to output 3. Video only, with audio broken away, is `input*output%`. The example `7*5%` returns `Out5 In7 Vid`. Audio only is `input*output$`. The example `2*4$` returns `Out4 In2 Aud`. The input number runs from 00 to the highest input on that frame, and the guide's key says 00 means untied. One-digit and two-digit numbers are both accepted. Commands can be sent back to back with no spaces. The guide's string is `1*1!02*02$03*03%4*4$`.

Reading a tie is the output number and `%` for video, or `$` for audio. The response is the input number tied to that output. `output*1B` mutes that output's video and leaves sync active. The response form is `Vmt` plus the output, `*1`. `output*2B` mutes video and sync. `output*0B` unmutes video and sync. `1*B` mutes every video output. `0*B` unmutes every video output. The guide says the table in the setup guide is a partial list, and the full command list is in the DTP CrossPoint 4K Series User Guide.

## How to set it up

1. Open a TCP connection to the switcher on port 23. The setup guide's factory default address is 192.168.254.254. Read the copyright line. If the next line is a Password prompt, send the account password and wait for `Login User` or `Login Administrator`.
2. Read output 3's video tie before changing it. Send `3%` and read the input number that comes back, then carriage return and line feed. `3$` is the guide's audio form of the same read.
3. Tie input 1 to output 3, video and audio, with `1*3!`. The guide's response is `Out3 In1 All`. Use `7*5%` only when output 5 should take input 7's video and leave the audio tie behind. Use `2*4$` for an audio-only tie of input 2 to output 4.
4. Mute output 3's video, sync still active, with `3*1B`, and expect `Vmt3*1`. `3*0B` unmutes that output. Leave `1*B` and `0*B` for the moment you mean every output.
5. Close the socket when the client is finished. The guide says a full switcher can hold 200 TCP connections and does not report when it is refusing new ones.

Source: [DTP CrossPoint 4K Series Setup Guide, 68-2368-51 Rev. B](https://media.extron.com/public/download/files/userman/68-2368-51_B.pdf).

## FAQ

### Does the bang include a space?
The guide's tie example is `1*3!`, and its note says commands in a string have no spaces, as in `1*1!02*02$03*03%4*4$`. The response `Out3 In1 All` has spaces, and the line ends with carriage return and line feed.

### What does input 00 do?
The command key says the input number runs from 00 to the highest input on the switcher, and that 00 means untied. Output numbers in that key start at 01.

### Which manual is this?
Part 68-2368-51 Rev. B, the DTP CrossPoint 4K Series Setup Guide. The guide says its SIS table is partial and points to the DTP CrossPoint 4K Series User Guide for the rest of the commands.
