const logger = require('./logger');

class CommandHandler {
    constructor() {
        this.commands = {
            'help': this.helpCommand,
            'status': this.statusCommand,
            'time': this.timeCommand,
            'pos': this.positionCommand,
            'players': this.playersCommand,
            'health': this.healthCommand,
            'say': this.sayCommand,
            'follow': this.followCommand,
            'stop': this.stopCommand,
            'come': this.comeCommand
        };
    }

    handleCommand(bot, username, message, isWhisper = false) {
        const args = message.slice(1).split(' '); // Rimuovi il prefisso comando
        const command = args[0].toLowerCase();
        const params = args.slice(1);

        logger.commandLog(username, message, isWhisper);

        if (this.commands[command]) {
            try {
                this.commands[command].call(this, bot, username, params, isWhisper);
            } catch (error) {
                logger.error(`Errore eseguendo comando ${command}:`, error);
                this.sendResponse(bot, username, `Errore nell'esecuzione del comando: ${error.message}`, isWhisper);
            }
        } else {
            this.sendResponse(bot, username, `Comando sconosciuto: ${command}. Usa !help per vedere i comandi disponibili.`, isWhisper);
        }
    }

    sendResponse(bot, username, message, isWhisper = false) {
        if (isWhisper) {
            bot.whisper(username, message);
        } else {
            bot.chat(message);
        }
    }

    // Comando di aiuto
    helpCommand(bot, username, params, isWhisper) {
        const commands = [
            '!help - Mostra questo aiuto',
            '!status - Mostra stato del bot',
            '!time - Mostra l\'ora del mondo',
            '!pos - Mostra posizione del bot',
            '!players - Lista giocatori online',
            '!health - Mostra salute del bot',
            '!say <messaggio> - Fa dire qualcosa al bot',
            '!follow - Segue il giocatore',
            '!stop - Ferma il seguimento',
            '!come - Fa venire il bot da te'
        ];

        commands.forEach(cmd => {
            this.sendResponse(bot, username, cmd, isWhisper);
        });
    }

    // Stato del bot
    statusCommand(bot, username, params, isWhisper) {
        const status = `Bot attivo - Salute: ${bot.health}/20, Cibo: ${bot.food}/20, Giocatori online: ${Object.keys(bot.players).length}`;
        this.sendResponse(bot, username, status, isWhisper);
    }

    // Ora del mondo
    timeCommand(bot, username, params, isWhisper) {
        const time = bot.time.timeOfDay;
        const hours = Math.floor((time / 1000 + 6) % 24);
        const minutes = Math.floor((time % 1000) / 1000 * 60);
        this.sendResponse(bot, username, `Ora del mondo: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`, isWhisper);
    }

    // Posizione del bot
    positionCommand(bot, username, params, isWhisper) {
        const pos = bot.entity.position;
        this.sendResponse(bot, username, `Posizione: X=${Math.round(pos.x)}, Y=${Math.round(pos.y)}, Z=${Math.round(pos.z)}`, isWhisper);
    }

    // Lista giocatori
    playersCommand(bot, username, params, isWhisper) {
        const players = Object.keys(bot.players);
        if (players.length === 0) {
            this.sendResponse(bot, username, 'Nessun giocatore online', isWhisper);
        } else {
            this.sendResponse(bot, username, `Giocatori online (${players.length}): ${players.join(', ')}`, isWhisper);
        }
    }

    // Salute del bot
    healthCommand(bot, username, params, isWhisper) {
        this.sendResponse(bot, username, `Salute: ${bot.health}/20, Cibo: ${bot.food}/20`, isWhisper);
    }

    // Far dire qualcosa al bot
    sayCommand(bot, username, params, isWhisper) {
        if (params.length === 0) {
            this.sendResponse(bot, username, 'Uso: !say <messaggio>', isWhisper);
            return;
        }
        
        const message = params.join(' ');
        bot.chat(`${username} mi ha chiesto di dire: ${message}`);
    }

    // Seguire un giocatore
    followCommand(bot, username, params, isWhisper) {
        const player = bot.players[username];
        if (!player || !player.entity) {
            this.sendResponse(bot, username, 'Non riesco a trovarti!', isWhisper);
            return;
        }

        bot.pathfinder.setGoal(null); // Ferma il goal corrente
        
        const { goals, Movements } = require('mineflayer-pathfinder');
        const movements = new Movements(bot);
        bot.pathfinder.setMovements(movements);
        
        const goal = new goals.GoalFollow(player.entity, 2);
        bot.pathfinder.setGoal(goal, true);
        
        this.sendResponse(bot, username, `Ti sto seguendo, ${username}!`, isWhisper);
    }

    // Fermare il movimento
    stopCommand(bot, username, params, isWhisper) {
        bot.pathfinder.setGoal(null);
        this.sendResponse(bot, username, 'Mi sono fermato!', isWhisper);
    }

    // Vieni qui
    comeCommand(bot, username, params, isWhisper) {
        const player = bot.players[username];
        if (!player || !player.entity) {
            this.sendResponse(bot, username, 'Non riesco a trovarti!', isWhisper);
            return;
        }

        const { goals, Movements } = require('mineflayer-pathfinder');
        const movements = new Movements(bot);
        bot.pathfinder.setMovements(movements);
        
        const goal = new goals.GoalNear(player.entity.position.x, player.entity.position.y, player.entity.position.z, 1);
        bot.pathfinder.setGoal(goal);
        
        this.sendResponse(bot, username, `Sto arrivando, ${username}!`, isWhisper);
    }
}

module.exports = new CommandHandler();
