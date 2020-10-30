# RPG Maker MV scripts

Collection of my scripts

## Debug

Script in `mv_debug/` provides debug utilities:

- Copy text from window message to clipboard

It can be configured by placing `mv_debug.json` in root directory of the same.

Sample of configuration can be found in `mv_debug/mv_debug.json`.
It was taken from my configuration for Fate/Empire of Dirt

## Install

Place `<name>.js` into `www/js/plugins`.
Update `www/js/plugins.js` by adding `{"name":"<name>","status":true,"description":"MV game Debugger","parameters":{}}`

RPG Maker MV uses `<name>` from `plugins.js` to determine which plugin to load from plugins folder
