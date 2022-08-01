require('dotenv').config();
const puppeteer = require("puppeteer");
const bot = require("./telegrambot").telegrambot;
const dayjs = require('dayjs');

async function sak(id_telegram, nip, pass, wfo_lat, wfo_long, wfh_lat, wfh_long) {
    var jam = parseInt(dayjs().format('HH'));
    if ((jam < 6) || (jam >= 9 && jam < 14)) {
        bot.sendMessage(id_telegram, "memulai pengisian sak...");
    
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], ignoreDefaultArgs: ['--disable-extensions'] });

        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(0);

        await page.goto('https://logbook.pajak.go.id/login', {
            waitUntil: 'networkidle0',
        });

        // input login
        await page.waitForSelector('#nip');
        await page.waitForSelector('#password');

        bot.sendMessage(id_telegram, "form login berhasil diload!");

        await page.type('#nip', nip);
        await page.type('#password', pass);

        // tunggu sampai load, lalu klik button
        await Promise.all([
            page.waitForNavigation(),
            page.click('#m_login_signin_submit')
        ])

        if(page.url() === "https://logbook.pajak.go.id/Presensi") {
            bot.sendMessage(id_telegram, "berhasil login!");

            const stateElementSelector =
            "body > div > div.m-grid__item.m-grid__item--fluid.m-grid.m-grid.m-grid--hor.m-container.m-container--responsive.m-container--xxl > div > div.m-grid__item.m-grid__item--fluid.m-grid.m-grid--desktop.m-grid--ver-desktop.m-body__content > div > div.m-content > div > div:nth-child(1) > div > div > div:nth-child(1) > div > table > tbody > tr:nth-child(2) > td > b";
            await page.waitForSelector(stateElementSelector);
            const stateElement = await page.$(stateElementSelector);
            const label = await stateElement.evaluate((node) => node.innerText);
            const statusWfh = label.slice(label.length - 3, label.length);
            if (statusWfh === "WFO") {
                bot.sendMessage(id_telegram, "Anda sedang WFO");
                const context = browser.defaultBrowserContext();
                await context.overridePermissions("https://logbook.pajak.go.id", [
                    "geolocation",
                ]);
                await page.setGeolocation({ latitude: parseFloat(wfo_lat), longitude: parseFloat(wfo_long) });
            } else{
                bot.sendMessage(id_telegram, "Anda sedang WFH");
                const context = browser.defaultBrowserContext();
                await context.overridePermissions("https://logbook.pajak.go.id", [
                    "geolocation",
                ]);
                await page.setGeolocation({ latitude: parseFloat(wfh_lat), longitude: parseFloat(wfh_long) });
            }

            // sabar
            await page.goto('https://logbook.pajak.go.id/SelfAssessmentKesehatan/form', {
                waitUntil: 'networkidle0',
            });

            // close modal
            // body > div.swal2-container.swal2-center.swal2-fade.swal2-shown > div > div.swal2-header > button
            // await page.waitForSelector('.swal2-close')
            await page.waitForSelector('body > div.swal2-container.swal2-center.swal2-fade.swal2-shown > div > div.swal2-header > button')
            await page.click('body > div.swal2-container.swal2-center.swal2-fade.swal2-shown > div > div.swal2-header > button')
            await page.waitForTimeout(1000)

            // set button
            const button = await page.$('#form_self_assessment > div.actions.clearfix > ul > li:nth-child(2) > a')

            // form 0
            await page.click('#form_self_assessment > div.actions.clearfix > ul > li:nth-child(2) > a');
            bot.sendMessage(id_telegram, 'form induk berhasil diisi!')


            // form 1
            await page.waitForTimeout(250)
            await page.click('#form_self_assessment-p-1 > div > div > div:nth-child(1) > div:nth-child(2) > label > span')
            await page.click('#suhu > div:nth-child(3) > label > span')
            await button.evaluate((e) => e.click());
            bot.sendMessage(id_telegram, 'form 1 berhasil diisi!')

            // form 2
            await page.waitForTimeout(250)
            await button.evaluate((e) => e.click());
            bot.sendMessage(id_telegram, 'form 2 berhasil diisi!')

            // form 3
            await page.waitForTimeout(250)
            await page.click('#form_self_assessment-p-3 > div > div > div > div:nth-child(17) > label > span')
            await button.evaluate((e) => e.click());
            bot.sendMessage(id_telegram, 'form 3 berhasil diisi!')

            // form 4
            await page.waitForTimeout(250)
            await page.click('#form_self_assessment-p-4 > div > div > div > div:nth-child(8) > label > span')
            await button.evaluate((e) => e.click());
            bot.sendMessage(id_telegram, 'form 4 berhasil diisi!')

            // form 5
            await page.waitForTimeout(250)
            await page.click('#form_self_assessment-p-5 > div > div > div > div:nth-child(3) > label > span')
            await button.evaluate((e) => e.click());
            bot.sendMessage(id_telegram, 'form 5 berhasil diisi!')

            // form 6
            await page.waitForTimeout(250)
            await page.click('#form_self_assessment-p-6 > div > div > div > div:nth-child(3) > label > span')
            await button.evaluate((e) => e.click());
            bot.sendMessage(id_telegram, 'form 6 berhasil diisi!')

            // form 7
            await page.waitForTimeout(250)
            await page.click('#form_self_assessment-p-7 > div > div > div > div:nth-child(3) > label > span')
            await button.evaluate((e) => e.click());
            bot.sendMessage(id_telegram, 'form 7 berhasil diisi!')

            // form 8
            await page.waitForTimeout(250)
            await page.click('#form_self_assessment-p-8 > div > div > div > div:nth-child(4) > label > span')
            await button.evaluate((e) => e.click());
            bot.sendMessage(id_telegram, 'form 8 berhasil diisi!')

            // form 9
            await page.waitForTimeout(250)
            await page.click('#form_self_assessment-p-9 > div > div > div > div:nth-child(5) > label > span')
            await button.evaluate((e) => e.click());
            bot.sendMessage(id_telegram, 'form 9 berhasil diisi!')

            // form 10
            await page.waitForTimeout(250)
            await page.click('#form_self_assessment-p-10 > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(5) > label > span')
            await page.click('#pertayaan_10_donor_form > div:nth-child(3) > label > span')
            await page.click('#form_self_assessment-p-10 > div:nth-child(3) > div > div > div > label > span')
            bot.sendMessage(id_telegram, 'form 10 berhasil diisi!')

            // klik finish
            await page.click('#form_self_assessment > div.actions.clearfix > ul > li:nth-child(3) > a', {
                waitUntil: 'networkidle0',
            });

            const resultElementSelector =
            "body > div > div.m-grid__item.m-grid__item--fluid.m-grid.m-grid.m-grid--hor.m-container.m-container--responsive.m-container--xxl > div > div.m-grid__item.m-grid__item--fluid.m-grid.m-grid--desktop.m-grid--ver-desktop.m-body__content > div > div.m-content > div > div > div > div > div:nth-child(2) > div > div > div.card-header";
            await page.waitForSelector(resultElementSelector);
            const resultElement = await page.$(resultElementSelector);
            const labelResult = await resultElement.evaluate((node) => node.innerText);
            if (labelResult === "Hasil Self Assessment Hari ini") {
                bot.sendMessage(id_telegram, 'SAK berhasil diisi!');
            } else {
                bot.sendMessage(id_telegram, 'SAK gagal diisi!');
            }
            
            // logout
            await page.waitForTimeout(1000)
            await page.goto('https://logbook.pajak.go.id/logout', {
                waitUntil: 'networkidle0',
            });
            
        } else {
            bot.sendMessage(id_telegram, "gagal login, cek user dan password!");
        }
        
        await browser.close();
    } else {
        bot.sendMessage(id_telegram, "sekarang bukan waktunya SAK...");
    }
    
}

module.exports.sak = sak;