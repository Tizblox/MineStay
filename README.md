# Minecraft Bot - Installazione su PC

## Requisiti
- Node.js versione 16 o superiore
- Connessione internet stabile

## Installazione

1. Scarica tutti i file del progetto sul tuo PC
2. Apri il terminale/prompt dei comandi nella cartella del progetto
3. Installa le dipendenze:
   ```bash
   npm install
   ```

## Configurazione

1. Crea un file `.env` nella cartella principale con:
   ```
   MINECRAFT_SERVER_HOST=Gruppovideogiochi.aternos.me
   MINECRAFT_SERVER_PORT=25565
   BOT_USERNAME=MinecraftBot
   COMMAND_PREFIX=!
   LOG_LEVEL=info
   ```

## Avvio

Esegui il bot con:
```bash
node bot.js
```

Il bot si connetterà automaticamente al server e rimarrà attivo finché non chiudi il terminale.

## Comandi disponibili nel gioco

- `!help` - Mostra tutti i comandi
- `!status` - Stato del bot
- `!players` - Lista giocatori online
- `!follow` - Il bot ti segue
- `!stop` - Ferma il movimento
- `!come` - Il bot viene da te
- `!say <messaggio>` - Fa dire qualcosa al bot

## File necessari

- `bot.js` - File principale del bot
- `config.js` - Configurazione
- `logger.js` - Sistema di logging
- `commands.js` - Gestione comandi
- `package.json` - Dipendenze del progetto
- `.env` - Configurazione privata (da creare)

## Mantenere il bot sempre attivo

Per Windows, puoi usare:
```bash
# Installa pm2 globalmente
npm install -g pm2

# Avvia il bot con pm2
pm2 start bot.js --name minecraft-bot

# Il bot si riavvierà automaticamente se si chiude
```

Per Linux/Mac:
```bash
# Usa screen per mantenere il processo attivo
screen -S minecraft-bot
node bot.js
# Premi Ctrl+A poi D per uscire senza chiudere il bot
```
