const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const userRoute = express.Router();
const userModel = require("../models/user");
const memberModel = require("../models/member");
require('dotenv').config();

const secret = process.env.SSjwtSS;
const Rounds = 10;

userRoute.post("/", async(req, res)=>{
    try{
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let useravatar = "https://dj4dpx5jn61t7.cloudfront.net/avatar/KuMdVSnQ81tb7aSg"
        let result = await userModel.checkAccount(email);
        if (result){
            data = {
                "error":true,
                "message":"帳號已有人使用 ! "
            }
            res.status(400).json(data)
        }else{
            bcrypt.hash(password, Rounds, async(error, hashpassword)=>{
                if(error){
                    console.log(error)
                }else{
                    await userModel.signUp(name, email, hashpassword, useravatar)
                }
            })
            data = {
                "ok":true,
                "message":"註冊成功 ! "
            }
            res.status(200).json(data)
        }
    }catch{
        data = {
            "error":true,
            "message":"伺服器錯誤"
        }
        res.status(500).json(data)
    }
})

userRoute.put("/", async(req, res)=>{
    try{
        // console.log(req.body)
        const email = req.body.email;
        const password = req.body.password;
        const signInResult = await userModel.signIn(email)
        if(signInResult){
            const checkPassword = bcrypt.compareSync(password, signInResult.userpassword)
            // console.log(checkPassword)
            if(checkPassword && email == signInResult.useremail){
                const setcookie = {
                    "userid":signInResult.userid,
                    "username":signInResult.username,
                    "useremail":signInResult.useremail,
                    "useravatar":signInResult.useravatar,
                }
                const data = {
                    "ok":true,
                    "message":"登入成功 ! "
                }
                const token = jwt.sign(setcookie, secret)
                res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 3600000 * 24 * 7) })
                res.status(200).json(data)
            }else{
                let data = {
                    "error":true,
                    "message":"帳號或密碼錯誤 ! "
                }
                res.status(403).json(data)
            }
        }else{
            let data = {
                "error":true,
                "message":"帳號或密碼錯誤 ! "
            }
            res.status(403).json(data)
        }
    }catch{
        data = {
            "error":true,
            "message":"伺服器錯誤"
        }
        res.status(500).json(data)
    }
    
})
userRoute.get("/", async(req, res)=>{
    const mycookie = req.headers.cookie;
    if(mycookie){
        const token = mycookie.replace("token=", "")
        const decoded = jwt.verify(token, secret);
        console.log(decoded)
        const useremail = decoded.useremail
        const result = await memberModel.checkCookie(useremail)
        let data = {
            "ok":true,
            "user":{
                "userid" : result.userid,
                "username" : result.username,
                "useremail" : result.useremail,
                "useravatar" :  result.useravatar
            }
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

userRoute.delete("/", (req, res)=>{
    let data = {
        "ok":true
    }
    res.clearCookie("token", "")
    res.status(200).json(data)
})

module.exports = userRoute