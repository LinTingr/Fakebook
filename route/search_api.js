const express = require("express");
const jwt = require("jsonwebtoken");
const searchRoute = express.Router();
const userModel = require("../models/user");
const memberModel = require("../models/member");
require('dotenv').config();
const secret = process.env.SSjwtSS;

searchRoute.get("/", async(req, res)=>{
    const mycookie = req.headers.cookie;
    if(mycookie){
        const token = mycookie.replace("token=", "")
        let memberName = req.query.memberName
        let result = await memberModel.searchMemberName(memberName)
        console.log(result)
        let data = {
            results : result
        }
        res.status(200).json(data)
    }else{
        let data ={
            "error" : true,
            "message" : "用戶未登入"
        }
        res.status(401).json(data)
    }    
})


module.exports = searchRoute