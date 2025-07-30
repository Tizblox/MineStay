const winston = require('winston');
const config = require('./config');

// Formattazione personalizzata per i log
const customFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
    })
);

// Configurazione del logger
const logger = winston.createLogger({
    level: config.logging.level,
    format: customFormat,
    transports: [
        // Log su console con colori
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        }),
        
        // Log su file
        new winston.transports.File({
            filename: config.logging.file,
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        
        // Log degli errori su file separato
        new winston.transports.File({
            filename: 'error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 3
        })
    ]
});

// Aggiungi metodi di utilità
logger.chatLog = (username, message) => {
    logger.info(`[CHAT] <${username}> ${message}`);
};

logger.commandLog = (username, command, isWhisper = false) => {
    const type = isWhisper ? 'WHISPER_CMD' : 'CHAT_CMD';
    logger.info(`[${type}] ${username}: ${command}`);
};

logger.connectionLog = (status, details = '') => {
    logger.info(`[CONNECTION] ${status} ${details}`);
};

module.exports = logger;
