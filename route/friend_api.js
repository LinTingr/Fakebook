const express = require("express");
const friendRouter = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SSjwtSS;
const friendModel = require("../models/friend");

friendRouter.post("/", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie;
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const userName = decoded.username
            const sendMemberId = req.body.userId
            const sendMemberName = req.body.userName
            const receiveMember = req.body.visitUser
            if(decoded && userId == sendMemberId && userName == sendMemberName){
                let result = await friendModel.checkInvite(sendMemberId, receiveMember)
                if(!result || result.status == "DECLINED"){
                    await friendModel.sendInvite(sendMemberId, receiveMember)
                    res.status(200).json({ok:true})
                }else if (result.status == "ACCEPTED"){
                    res.status(403).json({
                        error:true,
                        message : "已經是朋友"
                    })
                }else{
                    res.status(403).json({
                        error : true,
                        message : "等待對方回應"
                    })
                }
            }
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

friendRouter.get("/confirm", async(req, res)=>{
    try{
        const allsendUser = []
        const mycookie = req.headers.cookie;
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const username = decoded.username
            let results = await friendModel.Invite(userId)
            if(results){
                for(let i in results){
                    let userId = results[i].userid
                    let userName =  results[i].username
                    let userAvatar = results[i].useravatar
                    let sendUser = {
                        userId: userId,
                        userName: userName,
                        userAvatar: userAvatar
                    }
                    allsendUser.push(sendUser)
                }
                let data = {
                    allsendUser : allsendUser
                }
                res.status(200).json(data)
            }
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

friendRouter.put("/", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie;
        const token = mycookie.replace("token=", "")
        if(mycookie){
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const username = decoded.username
            const confirm = req.body.confirm
            const sendUserId = req.body.sendUserId
            const sendUserName = req.body.sendUserName
            await friendModel.confirm(confirm, sendUserId, userId)
            res.status(200).json({ok:true})
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

friendRouter.get("/", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie;
        if(mycookie){
            const token = mycookie.replace("token=", "")
            jwt.verify(token, secret, async(err, decoded) => {
                if(decoded){
                    const userId = decoded.userid
                    const username = decoded.username
                    let results = await friendModel.checkFriends(userId)
                    let data = {
                        userId: userId,
                        friends : results
                    }
                    res.status(200).json({data})
                }   
            })
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

friendRouter.delete("/", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie;
        const token = mycookie.replace("token=", "")
        if(mycookie){
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const deleteFriendId = req.body.deleteFriendId
            await friendModel.deleteFriend(userId, deleteFriendId)
            res.status(200).json({ok : true})
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

module.exports = friendRouter