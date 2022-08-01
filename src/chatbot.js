require('dotenv').config();
const dayjs = require('dayjs');
const db = require("./database").database;
const bot = require("./telegrambot").telegrambot;

const id_admin = parseInt(process.env.ID_TELEGRAM_ADMIN);

function chatbot() {
    
    bot.onText(/\/start/, (msg) => {
    
        bot.sendMessage(msg.chat.id, "klik /help untuk melihat daftar perintah");
    
    });
    
    bot.onText(/\/help/, (msg) => {

        if (msg.from.id == id_admin) {
            bot.sendMessage(msg.chat.id, 
                "Daftar Perintah : \n  "+
                "/help - daftar perintah \n  "+
                "/info - informasi bot \n  "+
                "/up - sak dan absen otomatis dimulai \n  "+
                "/down - sak dan absen otomatis dihentikan \n  "+
                "/pause - sak dan absen otomatis dijeda \n  "+
                "/onlibursak - tidak isi sak otomatis saat libur \n  "+
                "/offlibursak - isi sak otomatis saat libur \n  "+
                "/register - mendaftarkan user \n  "+
                "/edit - mengubah user \n  "+
                "/delete - menghapus user \n  "+
                "/backup - membackup command untuk register user \n  "+
                "/status - informasi dan status bot per user \n  "+
                "/manual - sak dan absen secara manual \n\n  "+
                "Daftar Perintah Admin: \n  "+
                "/approvaluser - approval user baru \n  "+
                "/listuser - list user yang ada \n  "+
                "/deleteuser - hapus user"
                );
        } else {
            bot.sendMessage(msg.chat.id, 
                "Daftar Perintah : \n  "+
                "/help - daftar perintah \n  "+
                "/info - informasi bot \n  "+
                "/up - sak dan absen otomatis dimulai \n  "+
                "/down - sak dan absen otomatis dihentikan \n  "+
                "/pause - sak dan absen otomatis dijeda \n  "+
                "/onlibursak - tidak isi sak otomatis saat libur \n  "+
                "/offlibursak - isi sak otomatis saat libur \n  "+
                "/register - mendaftarkan user \n  "+
                "/edit - mengubah user \n  "+
                "/delete - menghapus user \n  "+
                "/backup - membackup command untuk register user \n  "+
                "/status - informasi dan status bot per user \n  "+
                "/manual - sak dan absen secara manual");    
        }
    
    });
    
    bot.onText(/\/up/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }

            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar... \nklik /help untuk daftar perintah");
                } else {
                    if(res[0].fg_status == 1){
                        bot.sendMessage(msg.chat.id, "otomatisasi sudah dalam kondisi aktif. \nklik /down untuk menonaktifkan otomatisasi");
                    }else{
                        db.query("UPDATE user_logbook SET fg_status = 1 WHERE id_user = " + res[0].id_user , function (err1, res1) {
        
                            if (err1) {
                                console.log('koneksi ke database error!');
                            }
    
                            if (res1 == undefined) {
                                bot.sendMessage(msg.chat.id, "tidak terdapat user...");
                            } else {
                                bot.sendMessage(id_admin, "otomatisasi user "+res[0].nip + " @" + res[0].username + ' ' + res[0].full_name+" berhasil diaktifkan!");
                                bot.sendMessage(res[0].id_telegram, "otomatisasi anda telah diaktifkan... \nketik /info untuk melihat informasi bot\nketik /status untuk melihat status user");
                            };
    
                        });
                    }
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });
    
    bot.onText(/\/down/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }

            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar... \nklik /help untuk daftar perintah");
                } else {
                    if(res[0].fg_status == 0){
                        bot.sendMessage(msg.chat.id, "otomatisasi sudah dalam kondisi nonaktif. \nklik /up untuk mengaktifkan otomatisasi");
                    }else{
                        db.query("UPDATE user_logbook SET fg_status = 0 WHERE id_user = " + res[0].id_user , function (err1, res1) {
        
                            if (err1) {
                                console.log('koneksi ke database error!');
                            }
    
                            console.log(res1)
    
                            if (res1 == undefined) {
                                bot.sendMessage(msg.chat.id, "tidak terdapat user...");
                            } else {
                                bot.sendMessage(id_admin, "otomatisasi user "+res[0].nip + " @" + res[0].username + ' ' + res[0].full_name+" berhasil dinonaktifkan!");
                                bot.sendMessage(res[0].id_telegram, "otomatisasi anda telah dinonaktifkan... \nketik /info untuk melihat informasi bot\nketik /status untuk melihat status user");
                            };
    
                        });
                    }
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });

    bot.onText(/\/onlibursak/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }

            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar... \nklik /help untuk daftar perintah");
                } else {
                    if(res[0].fg_libursak == 1){
                        bot.sendMessage(msg.chat.id, "Tidak mengisi SAK saat libur sudah dalam kondisi aktif. \nklik /offlibursak untuk mengisi SAK saat libur");
                    }else{
                        db.query("UPDATE user_logbook SET fg_libursak = 1 WHERE id_user = " + res[0].id_user , function (err1, res1) {
        
                            if (err1) {
                                console.log('koneksi ke database error!');
                            }
    
                            if (res1 == undefined) {
                                bot.sendMessage(msg.chat.id, "tidak terdapat user...");
                            } else {
                                bot.sendMessage(res[0].id_telegram, "Tidak mengisi SAK saat libur telah diaktifkan... \nketik /info untuk melihat informasi bot\nketik /status untuk melihat status user");
                            };
    
                        });
                    }
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });

    bot.onText(/\/offlibursak/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }

            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar... \nklik /help untuk daftar perintah");
                } else {
                    if(res[0].fg_libursak == 0){
                        bot.sendMessage(msg.chat.id, "SAK saat libur terisi sudah dalam kondisi aktif. \nklik /onlibursak untuk tidak mengisi SAK saat libur");
                    }else{
                        db.query("UPDATE user_logbook SET fg_libursak = 0 WHERE id_user = " + res[0].id_user , function (err1, res1) {
        
                            if (err1) {
                                console.log('koneksi ke database error!');
                            }
    
                            if (res1 == undefined) {
                                bot.sendMessage(msg.chat.id, "tidak terdapat user...");
                            } else {
                                bot.sendMessage(res[0].id_telegram, "Tidak mengisi SAK saat libur telah dinonaktifkan... \nketik /info untuk melihat informasi bot\nketik /status untuk melihat status user");
                            };
    
                        });
                    }
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });
    
    bot.onText(/\/pause/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }

            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar... \nklik /help untuk daftar perintah");
                } else {
                    bot.sendMessage(msg.chat.id, "balas dengan format berikut... \n\n/break dd/mm/yyyy (,) koma untuk memisahkan tanggal (-) untuk rentang tanggal \n\ncontoh:\n/break 01/08/2022,03/08/2022-06/08/2022");
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });

    bot.onText(/\/break/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }

            const x = msg.text.substring(7, msg.text.length)

            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar... \nklik /help untuk daftar perintah");
                } else {
                    db.query("UPDATE user_logbook SET on_leave = '"+x+"' WHERE id_user = " + res[0].id_user , function (err1, res1) {
        
                        if (err1) {
                            console.log('koneksi ke database error!');
                        }

                        if (res1 == undefined) {
                            bot.sendMessage(msg.chat.id, "tidak terdapat user...");
                        } else {
                            bot.sendMessage(res[0].id_telegram, "sak dan absen akan terjeda pada "+x+" \nketik /info untuk melihat informasi bot\nketik /status untuk melihat status user");
                        };

                    });
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });
    
    bot.onText(/\/register/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }

            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, "balas dengan format berikut... \n\n/store nip;password;wfh_lat;wfh_long;wfo_lat;_wfo_long \n\ncontoh: \n060xxx;xxxxx;-6.240000;106.840000;-6.240000;106.840000 \n\n - wfh_long & wfh_lat : posisi wfh\n - wfo_long & wfo_lat: posisi wfo\n - koordinat bisa dicari sendiri di maps");
                } else {
                    bot.sendMessage(msg.chat.id, "anda sudah terdaftar... \nklik /help untuk daftar perintah");
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });
    
    bot.onText(/\/store/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {
    
            if (err) {
                console.log('koneksi ke database error!');
            }
    
            // mulai input
    
            const x = msg.text.substring(7, msg.text.length).split(";");;
            const xnip = x[0];
            const xpass = x[1];
            const xwfh_lat = x[2];
            const xwfh_long = x[3];
            const xwfo_lat = x[4];
            const xwfo_long = x[5];
            var reg_date = dayjs().format('YYYY-MM-DD HH:mm:ss');

            if(res != undefined){
                if (res[0] == undefined) {
                    db.query("INSERT INTO user_logbook (id_telegram, username, full_name, nip, pass, fg_aktif, fg_status, wfh_lat, wfh_long, wfo_lat, wfo_long, register_date) VALUES ('" + msg.from.id + "', '" + msg.from.username + "', '" + msg.from.first_name + " " + msg.from.last_name + "', '" + xnip + "', '" + xpass + "', 0, 1, '" + xwfh_lat + "', '" + xwfh_long + "', '" + xwfo_lat + "', '" + xwfo_long + "', '" + reg_date + "')");
                    bot.sendMessage(msg.chat.id, "inputan berhasil... cek pada /info \nkalau salah input hapusnya di /help");
        
                    // kasih tau admin
                    bot.sendMessage(id_admin, "terdapat user yg baru join cek /approvaluser");
                } else {
                    bot.sendMessage(msg.chat.id, "anda sudah terdaftar...");
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });
    
    bot.onText(/\/edit/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }

            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar... \nklik /help untuk daftar perintah");
                } else {
                    bot.sendMessage(msg.chat.id, "balas dengan format berikut... \n\n/change nip;password;wfh_lat;wfh_long;wfo_lat;_wfo_long \n\ncontoh: \n060xxx;xxxxx;-6.240000;106.840000;-6.240000;106.840000 \n\n - wfh_long & wfh_lat : posisi wfh\n - wfo_long & wfo_lat: posisi wfo\n - koordinat bisa dicari sendiri di maps");
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });

    bot.onText(/\/change/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {
    
            if (err) {
                console.log('koneksi ke database error!');
            }
    
            // mulai input
    
            const x = msg.text.substring(8, msg.text.length).split(";");;
            const xnip = x[0];
            const xpass = x[1];
            const xwfh_lat = x[2];
            const xwfh_long = x[3];
            const xwfo_lat = x[4];
            const xwfo_long = x[5];

            if(res != undefined){
                if (res[0] != undefined) {
                    db.query("UPDATE user_logbook SET username='"+msg.from.username+"', full_name='"+ msg.from.first_name + " " + msg.from.last_name +"', nip='"+xnip+"', pass='"+xpass+"', wfh_lat='"+xwfh_lat+"', wfh_long='"+xwfh_long+"', wfo_lat='"+xwfo_lat+"', wfo_long='"+xwfo_long+"' WHERE id_telegram = " + msg.from.id);
                    bot.sendMessage(msg.chat.id, "update berhasil... cek pada /info \nkalau salah input hapusnya di /help");
        
                    // kasih tau admin
                    bot.sendMessage(id_admin, "terdapat perubahan user "+res[0].nip + " @" + res[0].username + ' ' + res[0].full_name);
                } else {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar...");
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });
    
    bot.onText(/\/delete/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }

            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar... \nklik /help untuk daftar perintah");
                } else {
                    bot.sendMessage(msg.chat.id, "balas dengan format berikut... /remove \n\ngunakan /backup sebelum menghapus dan gunakan untuk mendaftar kembali");
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });
    
    bot.onText(/\/remove/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }

            if(res != undefined){
                if (res[0] != undefined) {
                    db.query("DELETE FROM user_logbook WHERE id_telegram = " + msg.from.id, function (errDel, resDel) {

                        if (errDel) {
                            console.log('koneksi ke database error!');
                        }
                
                        if (resDel[0] == undefined) {
                            bot.sendMessage(id_admin, "terdapat penghapusan user "+res[0].nip + " @" + res[0].username + ' ' + res[0].full_name);
                            bot.sendMessage(msg.from.id, "user berhasil dihapus!");
                        } else {
                            bot.sendMessage(id_admin, "terdapat penghapusan user "+res[0].nip + " @" + res[0].username + ' ' + res[0].full_name);
                            bot.sendMessage(msg.from.id, "user berhasil dihapus!");
                        };
                    });
                } else {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar... \nklik /help untuk daftar perintah");
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });
    
    bot.onText(/\/backup/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {
    
            if (err) {
                console.log('koneksi ke database error!');
            }

            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, "anda belum terdaftar...");
                } else {
                    bot.sendMessage(msg.chat.id, "digunakan untuk mendaftarkan ulang user biar gak nulis lagi");
                    bot.sendMessage(msg.chat.id, "/store " + res[0].nip + ";" + res[0].pass + ";" + res[0].wfh_lat + ";" + res[0].wfh_long + ";" + res[0].wfo_lat + ";" + res[0].wfo_long + "");
                };
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
        });
    
    });
    
    bot.onText(/\/status/, (msg) => {
    
        db.query("SELECT * FROM user_logbook WHERE id_telegram = " + msg.from.id, function (err, res) {

            if (err) {
                console.log('koneksi ke database error!');
            }
    
            if(res != undefined){
                if (res[0] == undefined) {
                    bot.sendMessage(msg.chat.id, 'anda belum terdaftar... \n/register dulu dan pastikan sudah di approve!');
        
                } else {
                    const id = res[0].id_telegram;
                    const nip = res[0].nip;
                    const pass = res[0].pass;
        
                    const wfh_lat = res[0].wfh_lat;
                    const wfh_long = res[0].wfh_long;
                    const wfh = "<a href='https://www.google.com/maps/search/" + wfh_lat + "," + wfh_long + "'>" + wfh_lat + ", " + wfh_long + "</a>";
        
                    const wfo_lat = res[0].wfo_lat;
                    const wfo_long = res[0].wfo_long;
                    const wfo = "<a href='https://www.google.com/maps/search/" + wfo_lat + "," + wfo_long + "'>" + wfo_lat + ", " + wfo_long + "</a>";
                    const fg_approve = res[0].fg_aktif == 1 ? '<b>Approve</b>' : '-';
                    const fg_status = res[0].fg_status == 1 ? '<b>Jalan</b>' : '<b>Tidak Jalan</b>';
                    const fg_libursak = res[0].fg_libursak == 1 ? '<b>Ya</b>' : '<b>Tidak</b>';
                    const on_leave = res[0].on_leave == null ? '<b>Tidak Dijeda</b>' : '<b>Terjeda pada : '+res[0].on_leave+'</b>';
        
                    bot.sendMessage(msg.chat.id, "Nama: <b>" + msg.from.first_name + " " + msg.from.last_name + "</b>\nUsername : @" + msg.from.username + "\nUser ID: " + id + "\n\nNIP: " + nip + "\nPass: " + pass + "\n\nLokasi WFH: \n" + wfh + "\nLokasi WFO: \n" + wfo + "\n\nStatus Aktif: " + fg_approve + "\nStatus Otomatisasi: " + fg_status + "\nTidak SAK Saat Libur: " + fg_libursak + "\nStatus Jeda: " + on_leave + "\n\n/backup", { parse_mode: "HTML" });
                }
            }else{
                bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
            }
    
        });
    
    });
    
    bot.onText(/\/info/, (msg) => {
    
        bot.sendMessage(msg.chat.id, "sak dan absen akan otomatis jalan setelah status otomatisasi aktif \nuntuk jadwal: \n- absen pagi mulai jam 6.30 dengan menit random\n- absen pulang mulai jam 17.40 dengan menit random\n- sak mulai jam 9.00 dengan menit random\n\n/status untuk melihat status user\n/help untuk melihat daftar perintah");
    
    });
    
    bot.onText(/\/manual/, (msg) => {
    
        bot.sendMessage(msg.chat.id, "fitur belum tersedia mohon sabar menunggu...");
    
    });

    // ADMIN command
    
    bot.onText(/\/approvaluser/, (msg) => {
    
        if (msg.from.id == id_admin) {
            db.query("SELECT * FROM user_logbook WHERE fg_aktif = 0", function (err, res) {
    
                if (err) {
                    console.log('koneksi ke database error!');
                }

                if(res != undefined){
                    if (res[0] == undefined) {
                        bot.sendMessage(msg.chat.id, "tidak terdapat user...");
                    } else {
                        var pesan = "Daftar user :\n";
                        for (let i = 0; i < res.length; i++) {
                            pesan = pesan+ '/acc_'+ res[i].id_user + ' - ' + res[i].nip + ' @' + res[i].username + ' ' + res[i].full_name +'\n';
                        }
                        bot.sendMessage(msg.chat.id, pesan);
                    };
                }else{
                    bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, "anda siapa?");
        }
    
    });

    bot.onText(/\/acc_/, (msg) => {

        var text = 'acc_';
    
        if (msg.text.toString().toLowerCase().includes(text)) {
    
            var mentah = msg.text;
            var user = mentah.split('_');
    
            if (msg.from.id !== id_admin) {
    
                bot.sendMessage(msg.chat.id, 'anda siapa?')
    
            } else {
    
                if (user[0] == '/acc') {
                    db.query("UPDATE user_logbook SET fg_aktif = 1 WHERE id_user = '" + user[1] + "'", function (err, res) {
    
                        if (err) {
                            console.log('koneksi ke database error!');
                        }
    
                        if (res == undefined) {
                            bot.sendMessage(id_admin, "user gagal diaktifkan!");
                        } else {
                            db.query("SELECT * FROM user_logbook WHERE id_user = " + user[1], function (err, res) {
                                if (err) {
                                    console.log('koneksi ke database error!');
                                }
    
                                if (res[0] == undefined) {
                                    bot.sendMessage(msg.chat.id, "tidak terdapat user...");
                                } else {
                                    bot.sendMessage(id_admin, "user berhasil diaktifkan!");
                                    bot.sendMessage(res[0].id_telegram, "user anda telah diaktifkan... ketik /up anda sudah bisa absen dan isi sak otomatis");
    
                                };
    
                            });
    
    
                        };
                    });
                }
            }
    
        }
    
    });
    
    bot.onText(/\/listuser/, (msg) => {
    
        if (msg.from.id == id_admin) {
            db.query("SELECT * FROM user_logbook", function (err, res) {
    
                if (err) {
                    console.log('koneksi ke database error!');
                }

                if(res != undefined){
                    if (res[0] == undefined) {
                        bot.sendMessage(msg.chat.id, "tidak terdapat user...");
                    } else {
                        var pesan = "Daftar user :\n";
                        for (let i = 0; i < res.length; i++) {
                            var aktif = res[i].fg_aktif == 1 ? "Aktif":"Tidak Aktif";
                            var status = res[i].fg_status == 1 ? "Jalan":"Tidak Jalan";
                            pesan = pesan + res[i].nip + ' @' + res[i].username + ' ' + res[i].full_name + ' - aktif: ' + aktif + ' - status: ' + status +'\n';
                        }
                        bot.sendMessage(msg.chat.id, pesan);
                    };
                }else{
                    bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, "anda siapa?");
        }
    
    });
    
    bot.onText(/\/deleteuser/, (msg) => {
    
        if (msg.from.id == id_admin) {
            db.query("SELECT * FROM user_logbook", function (err, res) {
    
                if (err) {
                    console.log('koneksi ke database error!');
                }

                if(res != undefined){
                    if (res[0] == undefined) {
                        bot.sendMessage(msg.chat.id, "tidak terdapat user...");
                    } else {
                        var pesan = "Daftar user :\n";
                        for (let i = 0; i < res.length; i++) {
                            pesan = pesan+ '/del_'+ res[i].id_user + ' - ' + res[i].nip + ' @' + res[i].username + ' ' + res[i].full_name +'\n';
                        }
                        bot.sendMessage(msg.chat.id, pesan);
                    };
                }else{
                    bot.sendMessage(msg.chat.id, 'terjadi kesalahan coba beberapa saat lagi');
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, "anda siapa?");
        }
    
    });

    bot.onText(/\/del_/, (msg) => {

        var text = 'del_';
    
        if (msg.text.toString().toLowerCase().includes(text)) {
    
            var mentah = msg.text;
            var user = mentah.split('_');
    
            if (msg.from.id !== id_admin) {
    
                bot.sendMessage(msg.chat.id, 'anda siapa?')
    
            } else {
    
                if (user[0] == '/del') {
                    db.query("SELECT * FROM user_logbook WHERE id_user = " + user[1], function (err, res) {
    
                        if (err) {
                            console.log('koneksi ke database error!');
                        }
    
                        if (res == undefined) {
                            bot.sendMessage(id_admin, "tidak terdapat user...");
                        } else {

                            db.query("DELETE FROM user_logbook WHERE id_user = " + res[0].id_user, function (errDel, resDel) {

                                if (errDel) {
                                    console.log('koneksi ke database error!');
                                }
                        
                                if (resDel[0] == undefined) {
                                    bot.sendMessage(id_admin, "user berhasil dihapus!");
                                    bot.sendMessage(res[0].id_telegram, "user anda telah dihapus oleh admin... silahkan hubungi admin untuk informasi lebih lanjut");
                                } else {
                                    bot.sendMessage(id_admin, "user berhasil dihapus!");
                                    bot.sendMessage(res[0].id_telegram, "user anda telah dihapus oleh admin... silahkan hubungi admin untuk informasi lebih lanjut");
                                };
                            });
    
    
                        };
                    });
                }
            }
    
        }
    
    });
}

module.exports.chatbot = chatbot;