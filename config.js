require('dotenv').config();

const config = {
    server: {
        host: process.env.MINECRAFT_SERVER_HOST || 'Gruppovideogiochi.aternos.me',
        port: parseInt(process.env.MINECRAFT_SERVER_PORT) || 25565,
        version: process.env.MINECRAFT_VERSION || '1.20.1'
    },
    
    bot: {
        username: process.env.BOT_USERNAME || 'MinecraftBot',
        password: process.env.BOT_PASSWORD || '',
        auth: process.env.AUTH_TYPE || 'offline', // 'microsoft', 'mojang', or 'offline'
        commandPrefix: process.env.COMMAND_PREFIX || '!',
        welcomeMessage: process.env.WELCOME_MESSAGE || 'Ciao! Sono un bot. Usa !help per vedere i comandi disponibili.'
    },
    
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'bot.log'
    },
    
    reconnection: {
        maxAttempts: parseInt(process.env.MAX_RECONNECT_ATTEMPTS) || 10,
        delay: parseInt(process.env.RECONNECT_DELAY) || 5000
    }
};

module.exports = config;
