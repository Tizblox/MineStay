const Eris = require("eris");

const keep_alive = require('./keep_alive.js')

//python: from ka import keep alive keep_alive()

// Replace TOKEN with your bot account's token const bot = new Eris(process.env.token);

bot.on("error", (err) 1f

console.error(err); or your preferred logger

});

8357

bot.connect();