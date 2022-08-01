require('dotenv').config();
const { ceklibur } = require("./ceklibur");
const dayjs = require('dayjs');
const db = require("./database").database;
const bot = require("./telegrambot").telegrambot;
const { sak } = require("./sak");
const { range_date, delay } = require("./util");

const id_admin = parseInt(process.env.ID_TELEGRAM_ADMIN);

function autosak() {
    db.query("SELECT * FROM user_logbook", function (err, res) {
    
        if (err) {
            console.log('koneksi ke database error!');
        }

        if(res != undefined){
            if (res[0] == undefined) {
                bot.sendMessage(id_admin, "tidak terdapat user untuk sak otomatis...");
            } else {
                for (let i = 0; i < res.length; i++) {

                    (async() =>{
                        var getLibur = await ceklibur();
                        if(getLibur == null){
                            if(res[i].on_leave != null){
                                var list_date = range_date(res[i].on_leave);
                                if(list_date.includes(dayjs().format('DD/MM/YYYY'))){
                                    bot.sendMessage(res[i].id_telegram, "sak otomatis terjeda, jangan lupa sak manual");
                                }else{
                                    await delay(Math.floor(Math.random() * 5) * 60 * 1000);
                                    await sak(res[i].id_telegram, res[i].nip, res[i].pass, res[i].wfo_lat, res[i].wfo_long, res[i].wfh_lat, res[i].wfh_long);
                                }
                            }else{
                                await delay(Math.floor(Math.random() * 5) * 60 * 1000);
                                await sak(res[i].id_telegram, res[i].nip, res[i].pass, res[i].wfo_lat, res[i].wfo_long, res[i].wfh_lat, res[i].wfh_long);
                            }
                        }else{
                            if(res[i].fg_libursak == 1){
                                bot.sendMessage(res[i].id_telegram, "Selamat libur " + getLibur);
                            }else{
                                if(res[i].on_leave != null){
                                    var list_date = range_date(res[i].on_leave);
                                    if(list_date.includes(dayjs().format('DD/MM/YYYY'))){
                                        bot.sendMessage(res[i].id_telegram, "sak otomatis terjeda, jangan lupa sak manual");
                                    }else{
                                        await delay(Math.floor(Math.random() * 5) * 60 * 1000);
                                        await sak(res[i].id_telegram, res[i].nip, res[i].pass, res[i].wfh_lat, res[i].wfh_long, res[i].wfh_lat, res[i].wfh_long);
                                    }
                                }else{
                                    await delay(Math.floor(Math.random() * 5) * 60 * 1000);
                                    await sak(res[i].id_telegram, res[i].nip, res[i].pass, res[i].wfh_lat, res[i].wfh_long, res[i].wfh_lat, res[i].wfh_long);
                                }
                            }
                        }
                    })();
                }
            };
        }else{
            setTimeout(autosak(), 2000);
        }
    });
}

module.exports.autosak = autosak;