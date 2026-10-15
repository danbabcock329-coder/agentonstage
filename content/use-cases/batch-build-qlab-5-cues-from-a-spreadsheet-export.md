---
title: "Batch-build QLab 5 cues from a spreadsheet export"
slug: batch-build-qlab-5-cues-from-a-spreadsheet-export
category: "Show Control"
tools: ["QLab 5", "Google Sheets", "AppleScript"]
difficulty: Intermediate
source_url: https://www.taylorglad.com/post/qlab-5-batch-cue-generator-tsv-csv
summary: "Taylor Glad's script reads TSV/CSV exports from a Google Sheet template and creates 17 kinds of QLab cues in one pass. A spreadsheet produced by an AI or by paperwork tools becomes a cue list."
---

## What it does

Taylor Glad's script reads TSV/CSV exports from a Google Sheet template and creates 17 kinds of QLab cues in one pass. A spreadsheet produced by an AI or by paperwork tools becomes a cue list.

## How to set it up

1. Copy the version 3 Google Sheet template linked in the post and fill in the tab for the cue type you need.
2. Export that tab as TSV (the post notes CSV can break on commas or quotes).
3. Paste the script into a Script cue, create any required network patch first, then run it and pick the files.
4. Trigger the script cue from a hotkey or Bitfocus Companion, as the author suggests.

Source: [Blog post by Taylor Glad](https://www.taylorglad.com/post/qlab-5-batch-cue-generator-tsv-csv)

## FAQ

### Why must patches exist first?
Network cues created before the patch is set up don't fix themselves later, so the script stops if the patch is missing.

### Can I import several files at once?
Yes. You can select multiple files of different types in one run.
