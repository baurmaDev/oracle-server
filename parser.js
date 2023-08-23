const puppeteer = require('puppeteer');
const express = require("express");
const cheerio = require("cheerio");

async function parseWithRetries(maxRetries, userId, givenMatchId) {
    let retries = 0;
    let success = false;
    const url = `https://csgo.fastcup.net/id${userId}/matches`;

    while (retries < maxRetries && !success) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(url);
            await page.setViewport({width: 1080, height: 1024});

            let match = await page.$eval('.wP3v48', el => el.outerHTML);
            let matches = await page.$$eval('.wP3v48', options => {
                return options.map(option => option.outerHTML);
            });
            if(matches || match) success = true;
            matches.map(match => {
                const $ = cheerio.load(match);
                const matchId = $('.ktfKLd').text()
                const isWin = $('.Tctvwo').text()
                if(matchId === givenMatchId){
                    console.log(`Match id: ${matchId} is ${isWin}`)
                }

            })
            await browser.close();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
    if (!success) {
        console.error('Parsing failed after maximum retries.');
    }
};
module.exports = parseWithRetries;