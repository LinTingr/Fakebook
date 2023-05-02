const express = require("express");
const jwt = require("jsonwebtoken");
const searchRouter = express.Router();
const societyModel = require("../models/society");
const memberModel = require("../models/member");
require("dotenv").config();
const secret = process.env.SSjwtSS;

searchRouter.get("/", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie;
        if(mycookie){
            const token = mycookie.replace("token=", "")
            let text = req.query.text
            let memberResult = await memberModel.searchMemberName(text)
            let societyResult = await societyModel.searchAllSociety(text)
            let data = {
                memberResult : memberResult,
                societyResult : societyResult
            }
            res.status(200).json(data)
        }else{
            let data ={
                "error" : true,
                "message" : "用戶未登入"
            }
            res.status(401).json(data)
        }    
    }catch{
        data = {
            "error":true,
            "message":"伺服器錯誤"
        }
        res.status(500).json(data)
    }
})


module.exports = searchRouter