const http = require('http');
const minecraftBot = require('./bot');

// Variabile per tracciare se il bot è già in esecuzione
let botStarted = false;

// Server HTTP per mantenere il processo attivo
const server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    // Informazioni sullo stato del bot
    const botStatus = minecraftBot.getStatus();
    const response = {
        status: "I'm alive - Stable Version",
        timestamp: new Date().toISOString(),
        project_url: "https://replit.com/@matteomaestro12/MineStay",
        uptime: process.uptime(),
        bot: {
            connected: botStatus.connected,
            username: botStatus.username || 'MinecraftBot',
            health: botStatus.health || 'N/A',
            food: botStatus.food || 'N/A',
            position: botStatus.position || 'N/A',
            players: botStatus.players || 0,
            reconnectAttempts: botStatus.reconnectAttempts || 0,
            isRunning: minecraftBot.isRunning
        }
    };
    
    res.write(JSON.stringify(response, null, 2));
    res.end();
});

// Avvia il server HTTP
server.listen(8080, '0.0.0.0', () => {
    console.log('Keep-alive server stabile in esecuzione sulla porta 8080');
    console.log('Status disponibile su: http://localhost:8080');
});

// Gestione errori del server
server.on('error', (err) => {
    console.error('Errore server keep-alive:', err);
});

// Avvia il bot Minecraft una sola volta
function startBotOnce() {
    if (!botStarted) {
        console.log('Avvio del bot Minecraft (versione stabile)...');
        botStarted = true;
        minecraftBot.start();
    } else {
        console.log('Bot già avviato, skip avvio duplicato');
    }
}

// Avvio ritardato per evitare conflitti
setTimeout(startBotOnce, 2000);

// Ping periodico per mantenere attivo (ogni 4 minuti)
setInterval(() => {
    console.log(`Keep-alive ping: ${new Date().toLocaleString()} - Uptime: ${Math.floor(process.uptime())}s`);
    
    // Verifica se il bot è ancora in esecuzione
    if (botStarted && !minecraftBot.isRunning) {
        console.log('Bot non più in esecuzione, riavvio...');
        setTimeout(() => {
            minecraftBot.start();
        }, 5000);
    }
}, 240000);

// Gestione segnali di sistema
process.on('SIGINT', () => {
    console.log('Ricevuto SIGINT, spegnimento pulito...');
    if (botStarted) {
        minecraftBot.stop();
    }
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('Ricevuto SIGTERM, spegnimento pulito...');
    if (botStarted) {
        minecraftBot.stop();
    }
    server.close(() => {
        process.exit(0);
    });
});

// Gestione errori non catturati
process.on('uncaughtException', (error) => {
    console.error('Errore non catturato:', error);
    if (botStarted) {
        minecraftBot.stop();
    }
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rejection non gestita:', reason);
});

console.log('Sistema keep-alive stabile attivo - Una sola istanza del bot');