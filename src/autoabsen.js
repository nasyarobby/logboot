require('dotenv').config();
const { ceklibur } = require("./ceklibur");
const dayjs = require('dayjs');
const db = require("./database").database;
const bot = require("./telegrambot").telegrambot;
const { absen } = require("./absen");
const { range_date, delay } = require("./util");

const id_admin = parseInt(process.env.ID_TELEGRAM_ADMIN);

function autoabsen() {
    db.query("SELECT * FROM user_logbook", function (err, res) {
    
        if (err) {
            console.log('koneksi ke database error!');
        }

        if(res != undefined){
            if (res[0] == undefined) {
                bot.sendMessage(id_admin, "tidak terdapat user untuk absen otomatis...");
            } else {
                for (let i = 0; i < res.length; i++) {

                    (async() =>{
                        var getLibur = await ceklibur();
                        if(getLibur == null){
                            if(res[i].on_leave != null){
                                var list_date = range_date(res[i].on_leave);
                                if(list_date.includes(dayjs().format('DD/MM/YYYY'))){
                                    bot.sendMessage(res[i].id_telegram, "absen otomatis terjeda, jangan lupa absen manual");
                                }else{
                                    await delay(Math.floor(Math.random() * 3) * 60 * 1000);
                                    await absen(res[i].id_telegram, res[i].nip, res[i].pass, res[i].wfo_lat, res[i].wfo_long, res[i].wfh_lat, res[i].wfh_long);
                                }
                            }else{
                                await delay(Math.floor(Math.random() * 3) * 60 * 1000);
                                await absen(res[i].id_telegram, res[i].nip, res[i].pass, res[i].wfo_lat, res[i].wfo_long, res[i].wfh_lat, res[i].wfh_long);
                            }
                        }
                    })();
                }
            };
        }else{
            setTimeout(autoabsen(), 2000);
        }
    });
}

module.exports.autoabsen = autoabsen;