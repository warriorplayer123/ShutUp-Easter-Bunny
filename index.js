const config = require('./config.json');

module.exports = function plsShutUp(mod) {
    const tracked = new Set();
    let enabled = true;

    mod.command.add('shush', () => {
        enabled = !enabled;
        mod.command.message(`NPC will now be ${enabled ? 'silenced' : 'chatty'}`);
    });

    mod.hook('S_SPAWN_NPC', '*', e => {
        if (config.bunnyIds.includes(e.templateId)) {
            tracked.add(e.gameId);
        }
    });

    mod.hook('S_QUEST_BALLOON', '*', { order: -100 }, e => {
        if (!enabled) return;

        if (tracked.has(e.source)) {
            return false;
        }
    });
};