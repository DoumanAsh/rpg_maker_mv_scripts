//=============================================================================
// mv_debug.js
//=============================================================================
/*:
 * @plugindesc Debugger for MV games
 *
 * @author Douman
 *
 * @help
 *
 * This is purely for purpose to make game more convenient
 *
 * TERMS OF USE
 * Do whatever you want
 *
 * COMPATIBILITY
 * Only interacts with core functionality of rpg maker.
 */

function Clipboard(filters) {
    this.clip = nw.Clipboard.get();
    this.filters = filters;
}

Clipboard.prototype.copy_text = function(text) {
    for (let idx = 0; idx < this.filters.length; idx++) {
        text = text.replace(this.filters[idx].regex, this.filters[idx].replacement);
    }

    this.clip.set(text, 'text');
}

function Config() {
    const fs = require('fs');
    this.engine_original = {
        game_start_message: Window_Message.prototype.startMessage
    };
    this.settings = {};

    try {
        if (fs.existsSync("mv_debug.json")) {
            const json = fs.readFileSync("mv_debug.json");
            this.settings = JSON.parse(json);
        }
    } catch (error) {
        window.alert("Cannot load mv_debug.json");
    }

    if (!(this.settings.clipboard_filters === undefined)) {
        if (!Array.isArray(this.settings.clipboard_filters)) {
            window.alert("MV Debug clipboard_filters is not array");
            this.settings.clipboard_filters = []
        }

        const filters = [];
        for (let idx = 0; idx < this.settings.clipboard_filters.length; idx++) {
            try {
                const filter = this.settings.clipboard_filters[idx];
                const parsed_filter = {};
                parsed_filter.regex = new RegExp(filter.regex, 'g');
                parsed_filter.replacement = filter.replacement || "";
                filters.push(parsed_filter);
            } catch (error) {
                window.alert(error)
            }
        }
        this.settings.clipboard_filters = filters;
    }

    this.clipboard = new Clipboard(this.settings.clipboard_filters);

    this.setup_clipboard();
}

Config.prototype.setup_clipboard = function() {
    if (this.settings.copy_clipboard) {
        var clipboard = this.clipboard;
        Window_Message.prototype._mv_debug_old_startMessage = Window_Message.prototype.startMessage
        Window_Message.prototype.startMessage = function() {
            this._mv_debug_old_startMessage(this);

            let text = this.convertEscapeCharacters($gameMessage.allText());

            try {
                clipboard.copy_text(text);
            } catch (error) {
                window.alert(error);
            }
        }
    } else {
        Window_Message.prototype.startMessage = Window_Message.prototype._mv_debug_old_startMessage
    }
}

function Debugger() {
    this.config = new Config();

    var menu = new nw.Menu({type: 'menubar'});

    var sub_menu = new nw.Menu();
    sub_menu.append(new nw.MenuItem({
        label: 'Copy message text to clipboard',
        click: this.on_enable_clipboard.bind(this),
    }));

    menu.append(new nw.MenuItem({
        label: 'Debug',
        submenu: sub_menu
    }));

    nw.Window.get().menu = menu;
}

Debugger.prototype.on_enable_clipboard = function() {
    this.config.settings.copy_clipboard = !this.config.settings.copy_clipboard;
    this.config.setup_clipboard();
};

function setup() {
    let mv_debugger = new Debugger();
}

setup();
