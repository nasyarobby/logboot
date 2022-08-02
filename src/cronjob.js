require('dotenv').config();
const cron = require('node-cron');
const { autosak } = require("./autosak");
const { autoabsen } = require("./autoabsen");
const bot = require("./telegrambot").telegrambot;

const id_admin = parseInt(process.env.ID_TELEGRAM_ADMIN);

function cronjob() {
    try {
        // SAK
        cron.schedule('3 9 * * *', () => {
            autosak(); 
        }, {
            scheduled: true,
            timezone: "Asia/Jakarta"
        });

        // Absen Pagi
        cron.schedule('23 6 * * 1,2,3,4,5', () => {
            autoabsen(); 
        }, {
            scheduled: true,
            timezone: "Asia/Jakarta"
        });

        // Absen Sore
        cron.schedule('43 17 * * 1,2,3,4,5', () => {
            autoabsen(); 
        }, {
            scheduled: true,
            timezone: "Asia/Jakarta"
        });

    } catch (error) {
        bot.sendMessage(id_admin, "Error di cronjob = "+error);
    }

}

module.exports.cronjob = cronjob;