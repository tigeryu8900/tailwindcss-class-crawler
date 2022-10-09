const puppeteer = require('puppeteer');
const { pageExtend } = require('puppeteer-jquery');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    let page = pageExtend(await browser.newPage());
    await page.goto("https://tailwindcss.com/docs");
    let urls = await page.jQuery("nav#nav > ul > li.mt-12 > ul > li > a").map((id, elm) => elm.href).pojo();
    console.log(urls);
    let out = fs.createWriteStream("classes.txt");
    for (let url of urls) {
        console.log(`Visiting ${url}`);
        await page.goto(url);
        let classes = await page.jQuery("table:has(thead > tr > th:nth-child(1) > div:contains('Class')) > tbody > tr > td.text-sky-500").map((id, elm) => elm.textContent).pojo();
        console.log("Classes: ", classes);
        for (let c of classes) out.write(c + '\n');
    }
    await browser.close();
})();
