const http = require('http');
const minecraftBot = require('./bot');
const pingService = require('./ping-service');

// Server HTTP per mantenere il processo attivo
const server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    
    // Informazioni sullo stato del bot
    const botStatus = minecraftBot.getStatus();
    const response = {
        status: "I'm alive",
        timestamp: new Date().toISOString(),
        project_url: "https://replit.com/@matteomaestro12/MineStay#package.json",
        bot: {
            connected: botStatus.connected,
            username: botStatus.username || 'MinecraftBot',
            health: botStatus.health || 'N/A',
            food: botStatus.food || 'N/A',
            position: botStatus.position || 'N/A',
            players: botStatus.players || 0,
            reconnectAttempts: botStatus.reconnectAttempts || 0
        }
    };
    
    res.write(JSON.stringify(response, null, 2));
    res.end();
});

// Avvia il server HTTP
server.listen(8080, () => {
    console.log('Keep-alive server running on port 8080');
    console.log('Bot status available at: http://localhost:8080');
});

// Gestione errori del server
server.on('error', (err) => {
    console.error('Errore server keep-alive:', err);
});

// Avvia il bot Minecraft
console.log('Avvio del bot Minecraft con keep-alive...');
minecraftBot.start();

// Gestione segnali di sistema
process.on('SIGINT', () => {
    console.log('Ricevuto SIGINT, spegnimento del bot e server...');
    minecraftBot.stop();
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('Ricevuto SIGTERM, spegnimento del bot e server...');
    minecraftBot.stop();
    server.close(() => {
        process.exit(0);
    });
});

// Gestione errori non catturati
process.on('uncaughtException', (error) => {
    console.error('Errore non catturato:', error);
    minecraftBot.stop();
    server.close(() => {
        process.exit(1);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rejection non gestita:', reason);
});

console.log('Sistema keep-alive attivo. Il bot rimarrà sempre acceso.');