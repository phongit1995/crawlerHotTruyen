const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require("dotenv").config();
let request = require('request-promise');
let cheerio = require('cheerio');
const cacheMemory = require('memory-cache');
let fs = require("fs");
let path = require('path');
puppeteer.use(StealthPlugin());
const getCookieCloudflare=async(url,argent)=>{
    const USER_ARGENT = argent || "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/93.0.148 Chrome/87.0.4280.148 Safari/537.36";
    const KEY_CACHE="KEY_CACHE"+url;
    const dataCache = cacheMemory.get(KEY_CACHE);
    if(dataCache){
        return dataCache;
    }
    browser = await puppeteer.launch({
        args : ['--no-sandbox', '--disable-setuid-sandbox'],
        //headless: false
    });
    const page = await browser.newPage();
    await page.setUserAgent(USER_ARGENT);
    await page.authenticate();
    await page.goto(url,{
        timeout:45000,
        waitUntil: 'domcontentloaded'
    })
    await page.waitForResponse(
    response =>{
        console.log('url',response.url(), "status",response.status())
        return response.url() == url && response.status() == 200
    },{timeout:30000})
    const cookies = await page.cookies();
    let result ="";
    for(let cookie of cookies){
        result+= `${cookie.name}=${cookie.value};` ;
    }
    const pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));
    await browser.close();
    cacheMemory.put(KEY_CACHE,result,1000*60*30);
    return result;

}
const getCookieCloudflareNotChallenge=async(url,argent)=>{
    const USER_ARGENT = argent || "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36";
    const KEY_CACHE="KEY_CACHE"+url;
    const dataCache = cacheMemory.get(KEY_CACHE);
    if(dataCache){
        return dataCache;
    }
    browser = await puppeteer.launch({
        args : ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: false
    });
    const page = await browser.newPage();
    await page.setUserAgent(USER_ARGENT);
    await page.authenticate();
    await page.goto(url,{
        timeout:10000,
        waitUntil: 'networkidle2'
    })
    const cookies = await page.cookies();
    const userAgent = await page.evaluate(() => navigator.userAgent );
    let result ="";
    for(let cookie of cookies){
        result+= `${cookie.name}=${cookie.value};` ;
    }
    let pages = await browser.pages(); 
    await Promise.all(pages.map(page =>page.close()));
    await browser.close();
    cacheMemory.put(KEY_CACHE,result,1000*60*30);
    return {
        cookie:result,
        userAgent
    };

}
const getDataOnUrl =async (url)=>{
    browser = await puppeteer.launch({
        args : ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    });
    const page = await browser.newPage();
    await page.authenticate();
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
            request.abort();
        } else {
            request.continue();
        }
    });
    await page.goto(url,{
        timeout:10000,
        waitUntil: 'networkidle2'
    });
    const content = await page.content();
    const pages = await browser.pages();
    await Promise.all(pages.map(page =>page.close()));
    await browser.close();
    return content ;

}
module.exports={
    getCookieCloudflare,
    getCookieCloudflareNotChallenge,
    getDataOnUrl
}
