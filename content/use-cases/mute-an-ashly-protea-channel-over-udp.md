---
title: "Mute an Ashly Protea channel over UDP"
slug: mute-an-ashly-protea-channel-over-udp
category: "Audio"
tools: ["Ashly Protea", "UDP"]
difficulty: Advanced
source_url: https://ashly.com/wp-content/uploads/2015/08/Ethernet-Communications-v5_3.pdf
labels: ["Commercial product"]
summary: "Ashly Ethernet protocol revision 5.3 listens on UDP 3100 and rejects TCP. A set starts with 0xAA. Muting PE output channel 1 is option 02 03 00 00 01."
---

## What it does

Ashly's Protocol for Ethernet Communications, revision 5.3, last updated 25 February 2015, is the UDP protocol for Ashly Ethernet devices, and the introduction names the PE series amplifiers as the example. The note on page 3 says the protocol uses UDP, not TCP, and that TCP clients will not work. Three servers share UDP port 3100. The Get Parameter server reads. The Set Parameter server writes, and it is password protected. The Request Updates server subscribes a client to changes for a timeout.

A unit is identified by its factory MAC address. The opening state is DHCP on and the IP parameters cleared. The configuration section says a direct crossover cable can be used with the IP left at 0.0.0.0. A get or a set still has to carry the destination MAC.

A get packet starts with four bytes of `0x8F`, then the six-byte destination MAC. The next byte is `0` for a request and `1` for a reply. The source byte is `00` for the working settings, or `1` through the preset count for a stored preset. Two reserved bytes follow, and the spec says the second should be `0x00`. Options come next and must end with `0xFF`. A heartbeat is a get with no option other than that end mark. The reply goes back to the port and address the request came from. An option the server does not understand is ignored.

A set packet starts with four bytes of `0xAA`, then the destination MAC, then an 8-byte user name, an 8-byte password, a 16-bit message number, one acknowledgment-status byte, and a reserved `0x00`. Options follow, again ending in `0xFF`. The original message uses acknowledgment status `0`. Status `1` means the message was received okay. Status `2` means it failed security and the whole message was ignored. Status `3` means at least one parameter was refused for lack of DSP resources. The default user's name is `default`, and unused name bytes are `0x00`. The spec says the password field is ignored for that user. The administrative name is `admin`.

Mute is option `0x02`. It mutes one input or one output. Channel type `0` is an output, and the spec says amplifier channels are outputs. Channel type `1` is an input. Channel number `0` to `23` is channel 1 to 24. Mute status `0x00` is unmuted and `0x01` is muted. The worked option for muting PE amplifier channel 1 is `0x02 0x03 0x00 0x00 0x01`. The length byte `0x03` is the three bytes that follow it. The option is marked implemented on all products, and the spec says unimplemented channels are ignored because the channel count is not 24 on every model.

Preset recall is option `0x32`. The spec limits that option to the PE DSP input card, and it says reads are ignored. The preset number is `1` to the number of presets the card supports. The following byte is `0` when outputs mute only if the preset says so, and `1` through `0xFF` when outputs mute regardless of the preset. Preset save is a different option, `0x31`, and its preset number is printed as `0` to one less than the preset count, described as presets 1 to that count.

[Set Symetrix Composer controls over TCP](/use-cases/set-symetrix-composer-controls-over-tcp) is text on port 48631, TCP or UDP. This revision is binary, UDP port 3100 only, and a set is refused without the user-name field.

## How to set it up

1. Reach the unit on UDP port 3100. A TCP connection is the combination the note says will not work. A direct crossover cable can stay at IP 0.0.0.0. You still need the unit's MAC in every packet.
2. Read mute before you change it. Send a get: header `0x8F`, the destination MAC, request byte `0`, source byte `00` for the working settings, then the mute option. A request may set that option's length to 0 and omit the data, but the spec says a parameter such as the channel number may still be required. End with `0xFF`. The reply uses request byte `1`.
3. Mute PE output channel 1 with a set. Header `0xAA`, the destination MAC, the 8-byte name `default` padded with `0x00`, the 8-byte password field, a message number, acknowledgment status `0`, reserved `0x00`, then `0x02 0x03 0x00 0x00 0x01`, then `0xFF`. Accept status `1`. Status `2` means the name was rejected.
4. Channel number `0` is channel 1, and channel type `0` is an output. One mute option changes one channel. The spec says to stack options when more than one channel has to change. A channel the product does not have is ignored.
5. Do not send option `0x32` to a product that is not the PE DSP input card. That option is marked for that card, write only. Byte `0` in its mute-outputs field leaves muting to the preset. Any other value mutes the outputs anyway.

Source: [Ashly Protocol for Ethernet Communications, revision 5.3](https://ashly.com/wp-content/uploads/2015/08/Ethernet-Communications-v5_3.pdf).

## FAQ

### Will a TCP library on port 3100 work?
The note says this protocol uses UDP, not TCP, and that TCP clients will not work. Get, set, and the update request all listen on UDP port 3100. The Symetrix page linked above is the control set that does accept TCP.

### What does acknowledgment status 2 mean?
Status `0` is the message you sent. Status `1` means it was received okay. Status `2` means insufficient security, and the spec says the entire message is ignored. The default user name is `default`, padded with `0x00`, and the password field is ignored for that user.

### Is preset 0 the first preset?
Mute channel numbers start at `0` for channel 1. Preset recall, option `0x32`, numbers presets from `1`. Preset save, option `0x31`, numbers them from `0` and describes that range as presets 1 and up. Recall is marked for the PE DSP input card only.
