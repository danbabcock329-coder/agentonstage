---
title: "Turn script PDF pages from OSC with da-share PDF Viewer"
slug: turn-script-pdf-pages-from-osc-with-da-share-pdf-viewer
category: "Production Ops"
tools: ["da-share PDF Viewer", "OSC", "MultiPlay"]
difficulty: Beginner
source_url: https://da-share.com/forum/index.php?topic=890.0
summary: "da-share PDF Viewer takes /page/next and /page/12 with no argument. From v1.3.0.0, /file/open takes a full path. The command post does not name a listen port."
---

## What it does

David's 10 June 2024 post on the da-share forum is the OSC address list for PDF Viewer. With no argument, the page change is the address itself. `/page/+` goes forward, and `next` can stand in for the plus. `/page/-` goes back, and `prev` or `previous` can stand in for the minus. `/page/` followed by a page number opens that page.

From version 1.3.0.0 the same words can be an argument of `/page/` instead: `/page/` with `+` or `next`, `/page/` with `-`, `prev`, or `previous`, and `/page/` with a page number. That version also adds file commands. `/file/open` takes the fully qualified filename as a string argument. `/file/close` closes the file. `/file/quit` quits the program. If the path contains spaces, the follow-up on that thread says to wrap the argument in double quotes so the sending program does not split it into several strings.

The author introduced the program on ControlBooth on 18 May 2024 as a window for showing a PDF script. He wrote it so MultiPlay could turn the pages, and said any program that sends OSC can do the same. On 10 February 2026, a r/livesound thread about paging a script from Bitfocus Companion points at this viewer. The poster said they had used it for a musical, changing pages from a macro keypad, and that the same control should work from Companion.

The June 2024 command post does not publish a listen port, and it does not name the preferences screen where that port would be set.

## How to set it up

1. Install the PDF Viewer build from the da-share forum. The address list to test against is the 10 June 2024 thread, which covers 1.3.0.0 and the address-only page commands.
2. Open the script in the viewer. Before writing cues, confirm the port the app is actually listening on. That number is not in the command post, so do not assume one.
3. From QLab, Companion, or MultiPlay, send `/page/next` with no argument to advance, `/page/prev` to go back, or `/page/12` to open page 12.
4. On 1.3.0.0 or later, open a file with `/file/open` and the full path. Put double quotes around the path when it contains spaces. `/file/close` closes it. `/file/quit` exits the viewer.

Source: [PDF Viewer OSC commands](https://da-share.com/forum/index.php?topic=890.0), [ControlBooth, 18 May 2024](https://www.controlbooth.com/threads/pdf-viewer-with-osc-control.50621/), and [r/livesound, 10 February 2026](https://www.reddit.com/r/livesound/comments/1qzg550/pdf_viewer_with_companion/).

## FAQ

### Is /page/next the same as an argument of next?
From v1.3.0.0, both forms are in the post. The address-only form is `/page/next` with no argument. The argument form is `/page/` with `next` as the value. The post dates the argument form, and the file commands, to 1.3.0.0.

### Will one viewer push its page to the others?
Not with the commands in that post. A 19 May 2024 reply on the ControlBooth thread discusses a master reader that could transmit page changes, and the author treats it as an option still being designed. The published list is one viewer receiving `/page/` and `/file/`.

### Which operating system?
In the ControlBooth follow-up the author wrote, on 19 May 2024, that Windows was the only target at that time. The OSC post does not add another platform.
