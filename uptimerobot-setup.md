# Setup UptimeRobot per Mantenere il Bot Sempre Attivo

## Perché serve
Replit mette in "sleep" i progetti gratuiti quando nessuno li usa. Per evitarlo, serve un servizio esterno che faccia ping ogni 5 minuti.

## Setup UptimeRobot (Gratuito)

1. **Vai su**: https://uptimerobot.com
2. **Registrati gratis** (50 monitor gratis)
3. **Crea nuovo monitor**:
   - Monitor Type: HTTP(s)
   - Friendly Name: MineStay Bot
   - URL: `https://replit.com/@matteomaestro12/MineStay`
   - Monitoring Interval: 5 minuti

## Setup Alternativo con Cron-Job.org

1. **Vai su**: https://cron-job.org
2. **Registrati gratis**
3. **Crea nuovo cronjob**:
   - URL: La URL del tuo progetto Replit
   - Interval: Ogni 5 minuti
   - Title: MineStay Keep-Alive

## URL da Usare
Usa l'URL completo del tuo progetto Replit che risponde sulla porta 8080:
`https://[nome-progetto].[username].repl.co`

## Come Funziona
- Il servizio fa ping ogni 5 minuti
- Replit non mette in sleep il progetto
- Il bot rimane sempre connesso
- Completamente gratuito

## Alternativa: Deploy con Reserved VM
Se preferisci una soluzione più professionale, usa il deployment Reserved VM di Replit (a pagamento ma più affidabile).