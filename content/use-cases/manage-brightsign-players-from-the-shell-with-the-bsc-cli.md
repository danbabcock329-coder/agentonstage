---
title: "Manage BrightSign players from the shell with the bsc CLI"
slug: manage-brightsign-players-from-the-shell-with-the-bsc-cli
category: "LED/Video"
tools: ["BrightSign", "bsc", "BSN.cloud"]
difficulty: Intermediate
source_url: https://www.npmjs.com/package/@brightsign/bsc
summary: "BrightSign's bsc 4.1.6 CLI talks to a player over local DWS or by serial number through BSN.cloud, for player info, files, registry, power and screenshots."
---

## What it does

`@brightsign/bsc` is BrightSign's command-line tool for the Diagnostic Web Server. The README shipped in version 4.1.6 calls it the second version of `bsc`. It says the older code lives in the archived `brightsign/player-cli` repository and that this version contains breaking changes. The package metadata lists the binary as `bsc`, requires Node.js 20.11.1 or later, and marks the license MIT, which matches the license section of that README.

The key features listed there are player management (list and retrieve player information), file operations (upload, download, delete and list), registry management (get, set and delete), system information (hardware, network configuration and status), power management (reboot, reset and power state), and screenshot capture. Almost every command supports two connection modes. Remote uses the player's serial number with `--player` and needs internet access to BSN.cloud. Local uses `--ip`, `--username` (the default is `admin`) and `--password`, and local DWS has to be enabled on the player. The README says remote is for cloud-managed devices and production, and local is mostly for development.

This is a shell CLI. A coding agent that can run commands on the machine uses the same flags the README shows. It does not register an MCP server.

## How to set it up

1. Install it globally with `npm install --global @brightsign/bsc` or `pnpm add -g @brightsign/bsc`. Node.js 20.11.1 or later is the requirement in the README, and the player has to be reachable on the network.
2. Before most commands, run `bsc configure`, or set `BRIGHTSIGN_CLIENT_ID` and `BRIGHTSIGN_CLIENT_SECRET`. Optional defaults are `BRIGHTSIGN_NETWORK_NAME` and `BRIGHTSIGN_NETWORK_ID`. The README says the client id and secret come from an application created at `https://adminpanel.bsn.cloud/`.
3. `bsc players list` lists players on the network. The sample table has serial, model and status. `bsc players get --player <serial>` is the remote read. `bsc players get --ip <address> --username admin --password <password>` is the local read. Those get examples include serial, model, firmware and IP.
4. To put a file on a player locally, the README's command is `bsc files upload --ip <address> --username admin --password <password> --source ./video.mp4 --destination sd`. `--destination` is optional. Without it, the file goes to the root of the SD card. `--source` can be a file or a directory. On the player, a directory path is `source` or `destination`. A local file path is `filePath`.
5. A local screenshot is `bsc players screenshot --ip <address> --username admin --password <password> --output-path ./screen.jpg`. The README's expected line is `Screenshot saved to ./screen.jpg`.

Source: [@brightsign/bsc on npm](https://www.npmjs.com/package/@brightsign/bsc)

## FAQ

### Does this draft BrightScript for me?
No. The 4.1.6 README describes player and file commands against DWS and BSN.cloud. Drafting player code from BrightSign's docs is the separate BrightDev documentation server.

### Which address do I pass for a player on the show LAN?
The local form in the README is `--ip` plus the DWS username and password, and it says local DWS must be enabled. The remote form is `--player` with the serial number, which needs internet access rather than a path to that IP.

### Where is the source repository?
The package points at `github.com/brightsign/brightsign-actions`, directory `clis/bsc-cli`. That GitHub URL returned 404 on 20 October 2026. The installable artifact checked for this entry is the 4.1.6 package on npm, which includes the README quoted above.
