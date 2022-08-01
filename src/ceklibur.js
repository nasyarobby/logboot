require('dotenv').config();
const dayjs = require('dayjs');
const axios = require('axios');
const bot = require("./telegrambot").telegrambot;

const key = process.env.API_KEY_GOOGLE;

async function ceklibur() {
    var cekLibur = null;
    const today = dayjs().format('YYYY-MM-DD');
    const urlLibur = 'https://www.googleapis.com/calendar/v3/calendars/55nqalkhrjjl0rtvfda0jno7eo@group.calendar.google.com/events?key='+ key;
    await axios.get(urlLibur)
    .then(response => {
        var result = response.data;
        if(result.items.length > 1){
            var holiday = [];
            result.items.forEach(element => {
                var date_list_holiday = element.start.date;
                var title_list_holiday = element.summary;
                holiday[date_list_holiday] = {
                    "title": title_list_holiday
                }
            });

            if(dayjs().day() == 0 || dayjs().day() == 6){
                cekLibur = "Weekend";
            }

            if(holiday[today] != undefined){
                cekLibur = holiday[today].title
            }
        }
    })
    .catch(error => {
        bot.sendMessage(parseInt(process.env.ID_TELEGRAM_ADMIN), "Error di get API hari libur = "+error);
    });

    Promise.resolve();
    return cekLibur;
}

module.exports.ceklibur = ceklibur;

    