---
title: "Send generic OSC from an SSL Live desk"
slug: send-generic-osc-from-an-ssl-live-desk
category: "Audio"
tools: ["SSL Live", "OSC"]
difficulty: Intermediate
source_url: https://livehelp.solidstatelogic.com/Help/ExternalControl.html
labels: ["Commercial product"]
summary: "SSL Live Generic OSC maps eight faders and eight switches. A * in the address becomes the path number. Faders send floats between the Min and Max you enter."
---

## What it does

SSL's Live help page says the console can control other OSC devices over UDP from its Connectivity network ports. Generic OSC is the device type for a box that is not one of the named integrations on that same page. The console needs the device IP, the console incoming port, the device receive port, and the OSC address and data type for each parameter.

Setup is MENU, Setup, Options, then the External Control tab. Choose Generic OSC. Host IP Address is the device. Incoming Port is where the device sends packets to the console. Host RX Port is where the console sends packets to the device. Enable Parameter Echo makes the console send back the value it just received. The page says to leave that off unless the device manual asks for an echo, and to turn it on only after the address and ports are already right. The console IP and the device IP have to be different addresses in the same subnet. Both are stored in the showfile. The console address is changed on MENU, Setup, Options, Network.

Each Generic OSC channel can have eight faders and eight switches. A fader label, an OSC address, a minimum, and a maximum are entered on the Fader tab. The switch tab has the same fields plus a data-type option. The page's label example is `Mute ch *`, which displays as Mute ch 1 on path 1 and Mute ch 2 on path 2. The address example is `/solidstatelogic/sigma/channels/fader/*`. The star is replaced with the console path number after any path-number offset. The address field says the console handles float data for those methods. Faders interpolate from Min to Max. Switches send Min when off and Max when on, and the page says that is typically 0 and 1. The switch tab can restrict a switch to integer arguments, and that setting both sends integers and accepts integers. Press and hold Apply to store the list. Clear Pending throws away edits that have not been applied. Enable Control turns the device on, and the list indicator goes green. More than one device can be enabled at the same time.

An OSC path is a console strip with no audio processing. It is created on MENU, Setup, Console Configuration, then placed with the Layer Manager. Audio paths can also be assigned to Generic OSC, for something inserted on a channel. The page says not to let two paths, or a path and an offset, land on the same device channel. The offset example is console path 8 controlling device channel 4, which needs an offset of -4. On an OSC path, the fader drives the first fader parameter, Mute drives the first switch, and Solo drives the second switch. The on-screen panner is the first three faders, labeled X, Y, and Z. Those parameters can be stored and recalled with the Automation filters, the same way other path parameters are.

The same help page uses Generic OSC for one Spacemap Go case: a fader address of `/Console/recall/system`, with Min and Max covering External Recall IDs from 900 to 3000. It says a Min of 900 and a Max of 1000 means 1 percent of fader travel steps the recall id by 1, so 42 percent is snapshot 942. It also says to put that on a fader other than Generic OSC fader 1, because fader 1 is the physical fader of an OSC path.

## How to set it up

1. On the console, open MENU, Setup, Options, External Control, and select Generic OSC. Enter the device IP, the Incoming Port the device will send to, and the Host RX Port the console will send to. Leave Enable Parameter Echo off unless that device's manual requires an echo.
2. On the Fader tab, enter a label and an address. The page's address example is `/solidstatelogic/sigma/channels/fader/*`. Set Min and Max. The star is replaced by the path number, including any offset you add later.
3. Press and hold Apply, then press Enable Control. The device row turns green when control is on. Put the console and the device in the same subnet, on different IP addresses.
4. For a device that is not tied to an audio channel, create an OSC path under MENU, Setup, Console Configuration, assign it to a layer, and choose Generic OSC in External Control. An offset of -4 makes path 8 address device channel 4. Do not point a second path at that same channel.
5. Move the OSC-path fader to send the first fader parameter, as a float between Min and Max. Mute and Solo send the first and second switches. Store the strip with the Automation filters if a scene recall should send the same values again.

Source: [SSL Live External Control](https://livehelp.solidstatelogic.com/Help/ExternalControl.html).

## FAQ

### Is this L-ISA DeskLink?
[Place L-ISA sources and fire snapshots over OSC](/use-cases/place-l-isa-sources-and-fire-snapshots-over-osc) is L-ISA Controller's own OSC. The SSL page treats L-ISA as a separate External Control device, and it names console software 4.11 or later with L-ISA Controller 2.2.2 or later for that DeskLink. Generic OSC is the eight-fader map on this page.

### Is this the Spacemap Go OSC map?
[Place Meyer Sound Spacemap Go channels over OSC](/use-cases/place-meyer-sound-spacemap-go-channels-over-osc) is the Spacemap system listening on UDP 38033. SSL also has a dedicated Spacemap Go device type. The Generic OSC example on the SSL page is the extra fader that sends `/Console/recall/system` so a console scene can recall a Spacemap snapshot by External Recall ID.

### Can the same page drive a DS100?
The SSL page has a separate d&b Soundscape device type aimed at a DS100, and it says the DS100 does not speak OSC back directly. [Move d&b Soundscape objects on a DS100 over OSC](/use-cases/move-d-and-b-soundscape-objects-on-a-ds100-over-osc) is that processor's own OSC, on UDP 50010. Generic OSC is the float map you type in, not the Soundscape layout.
