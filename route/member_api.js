const express = require("express");
const multer = require("multer");
const memberRouter = express.Router();
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const randtoken = require("rand-token");
require("dotenv").config();
const secret = process.env.SSjwtSS;
const upload = multer();
const userModel = require("../models/user")
const memberModel = require("../models/member");
const friendModel = require("../models/friend");

AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region:""
});
const cloudfront = "https://dj4dpx5jn61t7.cloudfront.net"
const myawsurl = "https://mywebting.s3.amazonaws.com"
const myawsurlloc = "https://mywebting.s3.ap-northeast-1.amazonaws.com"
const s3 = new AWS.S3();

memberRouter.post("/", upload.single("image"), (req, res) => {
    try{
        const mycookie = req.headers.cookie;
        if(mycookie){
            const token = mycookie.replace("token=", "")
            jwt.verify(token, secret, (err, decoded) => {
                if(decoded){
                    const useremail = decoded.useremail
                    bucketName = "mywebting"
                    let upload = req.file
                    if(upload){
                        const tokenrand = randtoken.generate(16);
                        const params = {
                            Bucket : bucketName,
                            Key : "avatar/" + tokenrand,
                            Body : upload.buffer,
                            ContentType : upload.mimetype
                        };
                        s3.upload(params, async (err, picdata) => {
                            if (err) {
                                res.status(500).json(picdata)
                            }else{
                                let imageUrl = picdata.Location.replace(myawsurl, cloudfront)
                                imageUrl = imageUrl.replace(myawsurlloc, cloudfront)
                                await memberModel.storePic(imageUrl, useremail)
                                const data ={
                                    ok : true,
                                    message : "上傳成功",
                                    picUrl : imageUrl
                                }
                                res.status(200).json(data)
                            }
                        });
                    }
                }else{
                    console.log(err)
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

memberRouter.post("/background", upload.single("image"), (req, res) => {
    try{
        const mycookie = req.headers.cookie;
        if(mycookie){
            const token = mycookie.replace("token=", "")
            jwt.verify(token, secret, (err, decoded) => {
                if(decoded){
                    const useremail = decoded.useremail
                    bucketName = "mywebting"
                    let upload = req.file
                    if(upload){
                        const tokenrand = randtoken.generate(16);
                        const params = {
                            Bucket : bucketName,
                            Key : "memberBackground/" + tokenrand,
                            Body : upload.buffer,
                            ContentType : upload.mimetype
                        };
                        s3.upload(params, async (err, picdata) => {
                            if(err){
                                res.status(500).json(picdata)
                            }else{
                                let imageUrl = picdata.Location.replace(myawsurl, cloudfront)
                                imageUrl = imageUrl.replace(myawsurlloc, cloudfront)
                                await memberModel.storeBackground(imageUrl, useremail)
                                const data ={
                                    ok : true,
                                    message : "上傳成功",
                                    picUrl : imageUrl
                                }
                                res.status(200).json(data)
                            }
                        });
                    }
                }else{
                    console.log(err)
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

memberRouter.get("/:id", async(req, res) => {
    try{
        const mycookie = req.headers.cookie;
        const memberId = req.params.id; // 要瀏覽的會員 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const { userid, username, useremail, useravatar, userIntroduction, userBackground } = await memberModel.checkMember(memberId);
            const userId = decoded.userid; 
            let checkUser = await userModel.checkUser(memberId)
            if(checkUser){
                let checkfriend = await friendModel.checkfriend(userId, memberId) || {status : ""}
                let friendCount = await friendModel.friends(memberId)
                let friends = await friendModel.checkFriends(memberId)
                const count = friendCount["COUNT(*)"];
                const userEmail = decoded.useremail;
                let permissions
                if(memberId != userId){
                    permissions = false
                }else{
                    permissions = true
                }
                const data = {
                    ok : true,
                    user : {
                        "userId" : userid,
                        "userName" : username,
                        "userEmail" : useremail,
                        "userAvatar" :  useravatar,
                        "userBackground" : userBackground,
                        "userIntroduction" : userIntroduction
                    },
                    friendCount : count,
                    friends : friends,
                    checkfriend : checkfriend,
                    permissions : permissions
                }
                res.status(200).json(data)
            }else{
                let data ={
                    "error" : true,
                    "message" : "無此用戶!"
                }
                res.status(404).json(data) 
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

memberRouter.patch("/:id", async(req, res) => {
    try{
        const mycookie = req.headers.cookie;
        const memberId = req.params.id; // 要瀏覽的會員 ID
        const introduction = req.body.introduction;
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            await memberModel.addIntroduction(memberId, introduction)
            const data ={
                ok : true
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


module.exports = memberRouter