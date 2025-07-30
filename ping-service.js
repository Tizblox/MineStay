const https = require('https');

// Funzione per fare ping al proprio progetto Replit
function pingMyself() {
    const url = 'https://replit.com/@matteomaestro12/MineStay#package.json';
    
    https.get(url, (res) => {
        console.log(`Ping effettuato: ${new Date().toLocaleString()} - Status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.log(`Errore ping: ${err.message}`);
    });
}

// Ping ogni 5 minuti (300000 ms)
setInterval(pingMyself, 300000);

// Primo ping all'avvio
pingMyself();

console.log('Servizio ping attivo - farà ping ogni 5 minuti per mantenere il bot sempre acceso');

module.exports = { pingMyself };