const puppeteer = require('puppeteer');
(async () => {
     const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        args: [
            '--proxy-server=http://189.84.48.122:8080'
        ]
    });
    const page = await browser.newPage();

    // await page.setExtraHTTPHeaders({
    //     'Proxy-Authorization': 'Basic ' + Buffer.from(':').toString('base64'),
    // });
    
    console.log('Opening page ...');
    try {
        await page.goto('https://httpbin.scrapinghub.com/redirect/6', {timeout: 15000})
    } catch(err) {
        console.log(err);
    }
  
    console.log('Taking a screenshot ...');
    await page.screenshot({path: 'screenshot.png', fullPage: true});
    await browser.close();
})();