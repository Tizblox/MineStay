const mineflayer = require('mineflayer');
const config = require('./config');
const logger = require('./logger');
const commands = require('./commands');

class MinecraftBot {
    constructor() {
        this.bot = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 5000; // 5 seconds
        this.isRunning = false;
    }

    async start() {
        this.isRunning = true;
        await this.connect();
    }

    async connect() {
        if (!this.isRunning) return;

        logger.info(`Tentativo di connessione al server ${config.server.host}...`);
        
        try {
            this.bot = mineflayer.createBot({
                host: config.server.host,
                port: config.server.port,
                username: config.bot.username,
                version: config.server.version,
                auth: config.bot.auth
            });

            this.setupEventListeners();
            
        } catch (error) {
            logger.error('Errore durante la creazione del bot:', error);
            await this.handleReconnection();
        }
    }

    setupEventListeners() {
        // Connessione riuscita
        this.bot.on('login', () => {
            logger.info(`Bot connesso come ${this.bot.username}`);
            this.reconnectAttempts = 0;
            
            // Invia messaggio di benvenuto in chat se configurato
            if (config.bot.welcomeMessage) {
                setTimeout(() => {
                    this.bot.chat(config.bot.welcomeMessage);
                }, 2000);
            }
        });

        // Spawn nel mondo
        this.bot.on('spawn', () => {
            logger.info('Bot spawned nel mondo');
            logger.info(`Posizione: ${this.bot.entity.position}`);
        });

        // Gestione messaggi chat
        this.bot.on('chat', (username, message) => {
            if (username === this.bot.username) return;
            
            logger.info(`<${username}> ${message}`);
            
            // Gestione comandi
            if (message.startsWith(config.bot.commandPrefix)) {
                commands.handleCommand(this.bot, username, message);
            }
        });

        // Gestione whisper/messaggi privati
        this.bot.on('whisper', (username, message) => {
            logger.info(`[WHISPER] ${username}: ${message}`);
            
            if (message.startsWith(config.bot.commandPrefix)) {
                commands.handleCommand(this.bot, username, message, true);
            }
        });

        // Errori di connessione
        this.bot.on('error', (err) => {
            logger.error('Errore del bot:', err);
        });

        // Disconnessione
        this.bot.on('end', async (reason) => {
            logger.warn(`Bot disconnesso. Motivo: ${reason}`);
            await this.handleReconnection();
        });

        // Kick dal server
        this.bot.on('kicked', (reason, loggedIn) => {
            logger.warn(`Bot kickato dal server. Motivo: ${reason}, Era loggato: ${loggedIn}`);
            
            // Se è duplicate login, aspetta di più prima di riconnettersi
            if (reason && reason.toString().includes('duplicate_login')) {
                logger.info('Rilevato duplicate login, aspetto 30 secondi prima di riconnettersi...');
                this.reconnectDelay = 30000; // 30 secondi
            }
        });

        // Gestione morte
        this.bot.on('death', () => {
            logger.info('Bot è morto! Respawn in corso...');
            setTimeout(() => {
                this.bot.respawn();
            }, 1000);
        });

        // Gestione salute
        this.bot.on('health', () => {
            if (this.bot.health < 10) {
                logger.warn(`Salute bassa: ${this.bot.health}/20`);
            }
        });

        // Log dei giocatori che entrano/escono
        this.bot.on('playerJoined', (player) => {
            logger.info(`${player.username} è entrato nel server`);
        });

        this.bot.on('playerLeft', (player) => {
            logger.info(`${player.username} ha lasciato il server`);
        });
    }

    async handleReconnection() {
        if (!this.isRunning) return;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            logger.error('Numero massimo di tentativi di riconnessione raggiunto. Bot fermato.');
            this.stop();
            return;
        }

        this.reconnectAttempts++;
        // Aumenta il delay per evitare spam di connessioni
        const baseDelay = this.reconnectDelay;
        const exponentialDelay = Math.min(baseDelay * Math.pow(2, this.reconnectAttempts - 1), 60000); // Max 1 minuto
        
        logger.info(`Tentativo di riconnessione ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${exponentialDelay/1000} secondi...`);
        
        setTimeout(() => {
            this.connect();
        }, exponentialDelay);
    }

    stop() {
        logger.info('Fermando il bot...');
        this.isRunning = false;
        
        if (this.bot) {
            this.bot.quit('Bot spento');
            this.bot = null;
        }
        
        logger.info('Bot fermato');
    }

    // Metodi di utilità
    isConnected() {
        return this.bot && this.bot.player;
    }

    getStatus() {
        if (!this.bot) return { connected: false, status: 'Disconnesso' };
        
        return {
            connected: this.isConnected(),
            username: this.bot.username,
            health: this.bot.health,
            food: this.bot.food,
            position: this.bot.entity ? this.bot.entity.position : null,
            players: this.bot.players ? Object.keys(this.bot.players).length : 0,
            reconnectAttempts: this.reconnectAttempts
        };
    }

    sendChat(message) {
        if (this.isConnected()) {
            this.bot.chat(message);
            logger.info(`Bot ha inviato: ${message}`);
        } else {
            logger.warn('Bot non connesso, impossibile inviare messaggio');
        }
    }
}

// Istanza globale del bot
const minecraftBot = new MinecraftBot();

// Gestione segnali di sistema
process.on('SIGINT', () => {
    logger.info('Ricevuto SIGINT, spegnimento del bot...');
    minecraftBot.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Ricevuto SIGTERM, spegnimento del bot...');
    minecraftBot.stop();
    process.exit(0);
});

// Gestione errori non catturati
process.on('uncaughtException', (error) => {
    logger.error('Errore non catturato:', error);
    minecraftBot.stop();
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Promise rejection non gestita:', reason);
});

module.exports = minecraftBot;

// Avvio automatico se eseguito direttamente
if (require.main === module) {
    logger.info('Avvio del bot Minecraft...');
    minecraftBot.start();
}
