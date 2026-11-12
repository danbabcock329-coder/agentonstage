---
title: "Recall a Vaddio ConferenceSHOT ePTZ preset over Telnet"
slug: recall-a-vaddio-conferenceshot-eptz-preset-over-telnet
category: "LED/Video"
tools: ["Vaddio ConferenceSHOT ePTZ", "Telnet", "TCP"]
difficulty: Intermediate
source_url: https://res.cloudinary.com/avd/image/upload/v132912792/Resources/Vaddio/Cameras/Operation/411-0054-30_Rev_A_ConferenceSHOT_ePTZ_Complete_Manual.pdf
labels: ["Commercial product"]
summary: "ConferenceSHOT ePTZ manual 411-0054-30 uses Telnet on port 23 after Allow Telnet Access. camera preset recall 2 goes to preset 2. Presets run from 1 to 16."
---

## What it does

Vaddio's complete manual for the ConferenceSHOT ePTZ, document 411-0054-30 Rev A, November 2021, documents a Telnet command API for an external controller such as AMX or Crestron, and for macros. Telnet has to be enabled on the Security page. The manual's security settings list Allow Telnet Access as disabled by default. The client uses Telnet port 23, and the login is the admin account. The web interface itself is unavailable until an admin password is set. By default the camera uses DHCP.

The prompt is `>`. Session commands are `help`, `history`, and `exit`. CTRL-5 clears the current serial buffer. A question mark lists what the connected camera will accept: `?` lists top-level commands, `network ?` lists network subcommands, and a value you expect to be out of range shows the legal range. The manual says firmware can add commands or change ranges without a new edition of the manual, and that an author occasionally makes a mistake, so the query is the list for the camera in front of you.

`camera preset` recalls or stores a shot. Recall and store take a preset from 1 to 16. Optional `tri-sync` takes a speed from 1 to 24 and moves with pan, tilt, and zoom together. Without `tri-sync`, the manual says the camera snaps to the preset. Optional `save-ccu` stores the current color and lighting with the shot. The printed recall example is `camera preset recall 2`, which goes to preset 2. The printed store example command is `camera preset store 2 tri-sync 10 save-ccu`. The sentence under that command says Tri-Sync at speed 15. The number in the command is 10, and the option range on the same page is 1 to 24.

Auto-framing pauses when the camera receives a pan, tilt, zoom, or preset recall from any source. `camera home` moves to the home position and zoom, and it also pauses auto-framing. `autoframer paused on` pauses auto-framing and leaves the camera in manual mode. `autoframer paused off` restarts it. `video mute on` sends blue or black video with an on-screen mute message. The note under that command says it does not change the audio. `camera standby on` stops video and puts the camera in standby.

## How to set it up

1. On the Security page, set an admin password if the web interface asks for one, then turn on Allow Telnet Access. The manual lists that control as disabled by default. Leave the camera on DHCP unless the network section of the same manual is how you are assigning the address.
2. Open a Telnet client to the camera on port 23 and log in with the admin account. The prompt is `>`. Send `camera preset ?` before you trust a remembered command. CTRL-5 clears the serial buffer if a line is stuck.
3. Recall preset 2 with `camera preset recall 2`. Preset numbers in this section run from 1 to 16. A recall pauses auto-framing. Send `autoframer paused off` when auto-framing should run again.
4. Store the current shot as preset 2 with Tri-Sync and CCU using the manual's command line, `camera preset store 2 tri-sync 10 save-ccu`. The speed argument on that line is 10. The range printed for `tri-sync` is 1 to 24. The sentence under the example says speed 15, so read the command and then query the camera.
5. Mute the picture with `video mute on` while the room is being set. The same note says the audio is unchanged. `camera standby on` stops video and enters standby. `exit` ends the Telnet session.

Source: [ConferenceSHOT ePTZ complete manual, 411-0054-30 Rev A (November 2021)](https://res.cloudinary.com/avd/image/upload/v132912792/Resources/Vaddio/Cameras/Operation/411-0054-30_Rev_A_ConferenceSHOT_ePTZ_Complete_Manual.pdf).

## FAQ

### Is Telnet on when the camera arrives?
The security settings list Allow Telnet Access as disabled by default. The Telnet section says it must be enabled on the Security page, and the login is the admin account, on port 23.

### Why did auto-framing stop after a recall?
The auto-framing section says a pan, tilt, zoom, or preset recall from any source pauses auto-framing. `camera home` pauses it as well. `autoframer paused off` restarts it.

### Does video mute cut the microphone?
The video mute note says the command does not affect the audio. `video mute on` sends blue or black video with an on-screen message. Audio commands are a separate section of the same manual.
