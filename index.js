let express = require("express");
require("dotenv").config();
let {getDataHotTruyen,getDataMeTruyenChu} = require('./getData');
let app = express();
app.use(express.static('public'))
app.get("/",async(req,res)=>{
   res.send('hello');
})
app.get("/hotruyen",async( req,res)=>{
    try {
        if(!req.query.url){
            return res.send("HELLO");
        }
        const data = await getDataHotTruyen(req.query.url);
        res.setHeader('content-type', 'text/plain');
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})
app.get("/metruyenchu",async( req,res)=>{
    try {
        if(!req.query.url){
            return res.send("HELLO");
        }
        const data = await getDataMeTruyenChu(req.query.url);
        res.setHeader('content-type', 'text/plain');
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

app.listen(process.env.PORT|4000,function(){
    console.log("App Running On PORT : " +( process.env.PORT||4000 ))
})