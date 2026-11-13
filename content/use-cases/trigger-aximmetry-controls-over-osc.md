---
title: "Trigger Aximmetry controls over OSC"
slug: trigger-aximmetry-controls-over-osc
category: "LED/Video"
tools: ["Aximmetry", "OSC"]
difficulty: Intermediate
source_url: https://aximmetry.com/learn/virtual-production-workflow/setting-up-inputs-outputs-for-virtual-production/external-controllers/osc-messages-in-aximmetry/
labels: ["Commercial product"]
summary: "Aximmetry assigns an OSC address to a control-board button. Send 1 to turn that button on and 0 to turn it off. OSC Trigger fires on a non-zero value or TRUE."
---

## What it does

Aximmetry's OSC page, dated 2026-07-13, describes how a virtual-production compound takes OSC in and how it sends OSC out. The setup page it points to puts the listener under Startup Configuration, Manage Devices, OSC, Server. You pick the adapter and the port. Choose `-any-` to listen on every adapter. The page says the default settings are usually suitable, and it does not print a port number.

Incoming control of a numeric property, a logical property, or a control-board button is an assignment, not a fixed address map. Right-click the property or the button and choose Assign OSC, then send the message you want bound to it. The page says that to turn a button on in normal mode you send a value of 1, and to turn it off you send 0. File, Properties, OSC Assignments lists the assignments in the compound.

The flow graph has modules for messages you would rather wire than assign. OSC Scalar takes a single float, or an integer, logical, or double, on the address you type or learn. OSC Vector takes a series of floats. OSC Trigger emits an impulse when the first value is a non-zero number or boolean TRUE. OSC Method collects every argument under keys 1, 2, 3, and so on. The page's example type tag for a five-argument message is `,fsNiT`. Read argument 2 with Collection Text and Key set to 2. The page says the Index property is the wrong field for that.

One address can be assigned to more than one input, and one input can be sent to more than one receiver. Aximmetry's own modules hide the type tag: OSC Scalar reads and writes float32, OSC Vector an array of float32s, and the collection modules map text, color, double, scalar, vector, integer, logical, and transformation onto the arguments.

Outbound, OSC Scalar Out and OSC Vector Out need a Device from the list you built in Manage Devices, plus a target address. Send pulses the Send pin. Auto Send transmits whenever the argument changes. OSC Out sends a collection, and the page says those collection keys must be integers starting at 1, in argument order. Leaving out a key inserts Nil. The example on the page is that a missing key 3 becomes the Nil argument.

## How to set it up

1. On the Startup Configuration screen, open Manage Devices, then OSC, Server. Pick the adapter, or `-any-`, and the port you will send to. Add an OSC Out UDP target only if this machine also has to send.
2. In the compound, right-click the control-board button or the numeric property and choose Assign OSC. Send one message from your client so the assignment captures that address. Confirm it under File, Properties, OSC Assignments.
3. Turn that button on with the value 1 on the assigned address, and off with 0. The page limits that pair to a button in normal mode.
4. For a graph you build yourself, drop OSC Scalar for one number, OSC Vector for a position, or OSC Trigger when you only need the impulse. Type the address, or turn Learn on and send one message so the address fills in.
5. Use OSC Method when the message has mixed arguments. Read them with the Collection module that matches the type, and put the argument number in Key, starting at 1.

Source: [OSC Messages in Aximmetry](https://aximmetry.com/learn/virtual-production-workflow/setting-up-inputs-outputs-for-virtual-production/external-controllers/osc-messages-in-aximmetry/) and [OSC In- and Output Setup](https://aximmetry.com/learn/virtual-production-workflow/setting-up-inputs-outputs-for-virtual-production/external-controllers/osc-in-and-output-setup/).

## FAQ

### Which port does Aximmetry listen on?
The setup page tells you to choose the adapter and the port on the OSC Server device. It says the defaults are usually suitable, and it does not print a port number. Read the port from Manage Devices.

### What value toggles a control-board button?
The OSC page says a button in normal mode turns on with 1 and off with 0. That is for an assignment made with Assign OSC, after you have sent the message that binds the address.

### How does OSC Trigger decide to fire?
The module description says it converts the message to an impulse when the first value is a non-zero number or boolean TRUE. A 0 or a false does not meet that test.
