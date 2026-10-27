---
title: "Query a Christie Inspire projector over TCP"
slug: query-a-christie-inspire-projector-over-tcp
category: "LED/Video"
tools: ["Christie Inspire", "TCP"]
difficulty: Intermediate
source_url: https://www.christiedigital.com/globalassets/resources/public/020-103542-03-Christie-LIT-TECH-REF-Inspire-Series-API.pdf
labels: ["Commercial product"]
summary: "Christie Inspire projectors take parenthesized serial commands on TCP port 3002, so a client can read power, shutter, and input on the DWU760, 860, and 960 models before it changes one."
---

## What it does

Christie's Inspire Series serial reference, document 020-103542-03 Rev. 1 (06-2025), covers the DWU760-iS, DWU760A-iS, DWU860-iS, DWU960-iS, and DWU960ST-iS. A computer can use the RS232 IN port or Ethernet. The Ethernet steps put the computer on the projector subnet and say to use TCP port 3002, then send the same serial commands. The RS232 parameters are 115200 baud, no parity, 8 data bits, 1 stop bit, and no flow control. The connection section says to use a direct connection, because docking ports can cause software upgrade failures.

Commands are ASCII inside parentheses. A space between the function code and the number is optional, so power-on is `(PWR1)` or `(PWR 1)`. A question mark requests a value. The projector answers with an exclamation mark. The format table's power request is `(PWR?)` and the sample reply is `(PWR!001 "On")`. The input request in that table is `(SIN+MAIN?)` and the sample reply is `(SIN+MAIN!001 "DVI-D")`. A hash before the function code asks for a full acknowledgement. The reference says not to put that acknowledgement request on a request message.

`(PWR?)` reads power. `(PWR 0)` turns the projector off and `(PWR 1)` turns it on. `(PWR+STBM 0)` is the 0.5 W standby mode. `(PWR+STBM 1)` is communication mode, and the table marks that as the default. The printed example for standby is `(PWR+STBM 1)`.

`(SHU?)` reads the shutter. The result example `(SHU!0)` means the shutter is open. `(SHU 0)` opens it. `(SHU 1)` closes it, and the table marks closed as the default value.

The Select Input table lists `SIN+MAIN` and `SIN+PIIP` with values 1 = VGA, 3 = HDMI1, 4 = HDMI2, and 8 = HDBaseT. The examples under that table are `(SIN 3)` for HDMI 1 and `(SIN 8)` for HDBaseT. The earlier format table instead shows `(SIN+MAIN 1)` and a reply whose quoted text is `DVI-D` for value 1, while this values table calls 1 VGA. Send `(SIN+MAIN?)` and use the quoted name in the reply. Treat `(SIN 3)` and `(SIN 8)` as the set examples printed on the command page, and check them against that reply on the projector you have before an agent is allowed to select an input.

A command the projector cannot run returns an error string. The reference's syntax example is `(ITP) - (65535 00000 ERR00005 "ITP: Too Few Parameters")`.

## How to set it up

1. Use a projector on the model list in reference 020-103542-03. Put the client on the projector subnet and open TCP port 3002, which is the port in the Ethernet section.
2. Send `(PWR?)` and `(SHU?)`. The format examples use a reply like `(PWR!001 "On")` and `(SHU!0)` for an open shutter. Stop if the reply is an `ERR` string.
3. Send `(SIN+MAIN?)` and read the quoted source name. Compare it with the values table (1 VGA, 3 HDMI1, 4 HDMI2, 8 HDBaseT) and with the command-page examples `(SIN 3)` and `(SIN 8)` before you store a set command.
4. On a dark projector, the only write worth rehearsing is shutter: `(SHU 1)` closes, `(SHU 0)` opens. Confirm with `(SHU?)` after each one.
5. Leave `(PWR 0)`, `(PWR 1)`, and `(PWR+STBM 0)` out of an unattended session. Power-off and the 0.5 W standby mode take the lamp and the control path down. The reference's own standby example sets communication mode, `(PWR+STBM 1)`.

Source: [Christie Inspire Series serial commands, 020-103542-03 Rev. 1 (06-2025)](https://www.christiedigital.com/globalassets/resources/public/020-103542-03-Christie-LIT-TECH-REF-Inspire-Series-API.pdf).

## FAQ

### Does value 1 mean VGA or DVI-D?
The Select Input table says 1 = VGA. The message-format example replies to value 1 with the text `DVI-D`. Query `(SIN+MAIN?)` and trust the quoted name from that projector.

### Do Ethernet commands differ from RS232?
The Ethernet section says to start sending the serial commands after you connect on TCP port 3002. The command text is the parenthesized message. RS232 is 115200 8N1 with no flow control.

### Can an agent strike the lamp?
The power table can. `(PWR 1)` turns the projector on and `(PWR 0)` turns it off. Keep both, and `(PWR+STBM 0)`, off a client that runs without a person watching the screen.
