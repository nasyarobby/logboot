require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const puppeteer = require("puppeteer");
const dayjs = require('dayjs');

const token = process.env.TOKEN_TELEGRAM;

const bot = new TelegramBot(token, { polling: false });

async function absen(id_telegram, nip, pass, wfo_lat, wfo_long, wfh_lat, wfh_long) {
    var jam = parseInt(dayjs().format('HH'));
    if (jam >= 6) {
        bot.sendMessage(id_telegram, "memulai pengisian absen...");
        
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], ignoreDefaultArgs: ['--disable-extensions'] });

        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(0);

        await page.goto('https://logbook.pajak.go.id/login', {
            waitUntil: 'networkidle0',
        });

        // ketik user login
        await page.waitForSelector('#nip');
        await page.waitForSelector('#password');

        bot.sendMessage(id_telegram, "form login berhasil diload!");

        await page.type('#nip', nip);
        await page.type('#password', pass);

        await Promise.all([
            page.waitForNavigation(),
            page.click('#m_login_signin_submit')
        ]);

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
                await page.goto("https://logbook.pajak.go.id/Presensi");
            } else{
                bot.sendMessage(id_telegram, "Anda sedang WFH");
                const context = browser.defaultBrowserContext();
                await context.overridePermissions("https://logbook.pajak.go.id", [
                    "geolocation",
                ]);
                await page.setGeolocation({ latitude: parseFloat(wfh_lat), longitude: parseFloat(wfh_long) });
                await page.goto("https://logbook.pajak.go.id/Presensi");
            }

            // klik absen
            await page.waitForSelector("#btnPresensi:not([disabled])");
            page.click('#btnPresensi');

            const resultElementSelector =
                "body > div > div.m-grid__item.m-grid__item--fluid.m-grid.m-grid.m-grid--hor.m-container.m-container--responsive.m-container--xxl > div > div.m-grid__item.m-grid__item--fluid.m-grid.m-grid--desktop.m-grid--ver-desktop.m-body__content > div > div.m-content > div > div > div > div > div > div > div > div.card-header";
            await page.waitForSelector(resultElementSelector);
            const resultElement = await page.$(resultElementSelector);
            const labelResult = await resultElement.evaluate((node) => node.innerText);
            if (labelResult === "Berhasil") {
                bot.sendMessage(id_telegram, "berhasil presensi!");
            } else {
                bot.sendMessage(id_telegram, "gagal presensi!");
            }

            await page.waitForTimeout(2000)
            await page.goto('https://logbook.pajak.go.id/Presensi')
            await page.waitForTimeout(4000)
            
        } else {
            bot.sendMessage(id_telegram, "gagal login, cek user dan password!");
        }

        await browser.close();
    } else {
        bot.sendMessage(id_telegram, "sekarang bukan waktunya absen...");
    }
}

module.exports.absen = absen;