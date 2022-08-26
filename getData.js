const {getCookieCloudflare ,getCookieCloudflareNotChallenge} = require('./common');
let request = require('request-promise');
const getDataHotTruyen = async (url)=>{
    const USER_ARGENT = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/93.0.148 Chrome/87.0.4280.148 Safari/537.36";
    const cookie = await getCookieCloudflare("https://hotruyen.com/",USER_ARGENT);
    console.log('cookie',cookie);
    let options = {
        method:"GET",
        uri:url,
        headers:{
            Referer:"https://hotruyen.com/",
            'User-Agent': USER_ARGENT,
            cookie:cookie
        },
        referrerPolicy: "strict-origin-when-cross-origin",
    }
    console.log('url',url);
    let data = await request(options);
    return data ;
}
const getDataMeTruyenChu = async (url)=>{
    const USER_ARGENT = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/93.0.148 Chrome/87.0.4280.148 Safari/537.36";
    const dataCookie = await getCookieCloudflareNotChallenge("https://metruyenchu.com",USER_ARGENT);
    console.log('dataCookie',dataCookie);
    let options = {
        method:"GET",
        uri:url,
        headers:{
            Referer:"https://metruyenchu.com",
             'User-Agent': dataCookie.userAgent,
            cookie:dataCookie.cookie
        },
        //referrerPolicy: "strict-origin-when-cross-origin",
    }
    console.log('options',options);
    let data = await request(options);
    return data ;
}
module.exports ={
    getDataHotTruyen,
    getDataMeTruyenChu
}