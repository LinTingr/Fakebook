const express = require('express');
const chatMessageRouter = express.Router();
const chatModel = require("../models/chatMessage");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SSjwtSS;

chatMessageRouter.post("/", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie;
        if(mycookie){
            const sendUserId = req.body.sendUserId
            const receiveUserId = req.body.receiveUserId
            const message = req.body.message
            const timestamp = req.body.timestamp
            await chatModel.addChatroom(sendUserId, receiveUserId)
            await chatModel.addchat(sendUserId, receiveUserId, message, timestamp)
            res.status(200).json({"ok" : true})
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

chatMessageRouter.get("/chat", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie;
        const memberId = req.query.memberId;
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            let allMessage = await chatModel.searchChat(userId, memberId)
            let data = {
                allMessage : allMessage
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

chatMessageRouter.get("/", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie;
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            let allMessageLast = []
            let chatroom = await chatModel.chatroom(userId)
            for(let i in chatroom){
                const reciveId = chatroom[i].reciveId
                let messageLast = await chatModel.searchLastChat(userId, reciveId)
                const onemessageLast = {
                    reciveId : reciveId,
                    messageLast : messageLast
                }
                allMessageLast.push(onemessageLast)
            }
            
            let data = {
                chatroom : chatroom,
                allMessageLast : allMessageLast
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
module.exports = chatMessageRouter