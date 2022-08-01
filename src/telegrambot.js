require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TOKEN_TELEGRAM;

const bot = new TelegramBot(token, { polling: true });

bot.on("polling_error", function(err) {
    if(err.code !== 'EFATAL' || err.code !== 'ETELEGRAM') {
        console.log(err) ;
    }
});

module.exports.telegrambot = bot;