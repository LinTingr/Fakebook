const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRouter = express.Router();
const userModel = require("../models/user");
const memberModel = require("../models/member");
require("dotenv").config();

const secret = process.env.SSjwtSS;
const Rounds = 10;

userRouter.post("/", async(req, res)=>{
    const nameRe = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,15}$/
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRe = /^(?=.*[a-zA-Z\d])[a-zA-Z\d]{4,}$/
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const nameRules = nameRe.test(name)
        const emailRules = emailRe.test(email)
        const passwordRules = passwordRe.test(password)
        const useravatar = "https://dj4dpx5jn61t7.cloudfront.net/avatar/KuMdVSnQ81tb7aSg"
        const result = await userModel.checkAccount(email);
        if(!nameRules){
            data = {
                "error":true,
                "message":"名字長度限制 1~15 個字元 ! "
            }
            res.status(400).json(data)
        }else{
            if(!emailRules){
                data = {
                    "error":true,
                    "message":"帳號格式錯誤 ! "
                }
                res.status(400).json(data)
            }else{
                if(!passwordRules){
                    data = {
                        "error":true,
                        "message":"密碼最少 4 個字元 ! "
                    }
                    res.status(400).json(data)
                }else{
                    if (result){
                        data = {
                            "error":true,
                            "message":"帳號已有人使用 ! "
                        }
                        res.status(400).json(data)
                    }else{
                        bcrypt.hash(password, Rounds).then(async(hashpassword)=>{
                            const scuessUserId = await userModel.signUp(name, email, hashpassword, useravatar)
                            const setcookie = {
                                "userid":scuessUserId,
                                "username":name,
                                "useremail":email,
                                "useravatar":useravatar,
                            }
                            data = {
                                "ok" : true,
                                "userid":scuessUserId,
                                "message" : "註冊成功 ! 3秒後跳轉 ! !"
                            }
                            const token = jwt.sign(setcookie, secret)
                            res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 3600000 * 24 * 7) })
                            res.status(200).json(data)
                        })
                    }
                }
            }
        }
       
    }catch{
        data = {
            "error":true,
            "message":"伺服器錯誤"
        }
        res.status(500).json(data)
    }
})

userRouter.put("/", async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const signInResult = await userModel.signIn(email)
        if(signInResult){
            const checkPassword = bcrypt.compareSync(password, signInResult.userpassword)
            if(checkPassword && email == signInResult.useremail){
                const setcookie = {
                    "userid":signInResult.userid,
                    "username":signInResult.username,
                    "useremail":signInResult.useremail,
                    "useravatar":signInResult.useravatar,
                }
                const data = {
                    "ok":true,
                    "userId":signInResult.userid,
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
userRouter.get("/", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie;
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
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
    }catch{
        data = {
            "error":true,
            "message":"伺服器錯誤"
        }
        res.status(500).json(data)
    }
})

userRouter.delete("/", (req, res)=>{
    let data = {
        "ok":true
    }
    res.clearCookie("token", "")
    res.status(200).json(data)
})

module.exports = userRouter