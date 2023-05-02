const express = require('express');
const societyRouter = express.Router();
const societyModel = require("../models/society");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SSjwtSS;
const multer = require("multer");
const upload = multer();
const AWS = require("aws-sdk");
const randtoken = require("rand-token");
const memberModel = require("../models/member")


AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region:""
});
const cloudfront = "https://dj4dpx5jn61t7.cloudfront.net"
const myawsurl = "https://mywebting.s3.amazonaws.com"
const myawsurlloc = "https://mywebting.s3.ap-northeast-1.amazonaws.com"
const s3 = new AWS.S3();
const bucketName = "mywebting"

societyRouter.get("/invite", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const results = await societyModel.searchSocietyInvite(userId)
            const data = {
                invite : results
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

societyRouter.get("/:id/article", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const { userid, username, useremail, useravatar } = await memberModel.checkMember(userId);
            let allData = []
            let nextPage
            let Page = req.query.postPage;
            Page = Number(Page);
            let article = await societyModel.getSocietyPost(societyId, Page)
            if(article.length <= 5){
                nextPage = null
            }else{
                nextPage = 1
            }
            await getPostData(userId, article, allData, societyId);
            let data = {
                nextPage : nextPage,
                user : {
                    "userid" : userid,
                    "username" : username,
                    "useremail" : useremail,
                    "useravatar" :  useravatar
                },
                articleData : allData
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

societyRouter.post("/create", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = req.body.userId
            const userName = req.body.userName
            const societyName = req.body.societyName
            const privacy = req.body.privacy
            const hide = req.body.hide
            let privacyNum = 0
            let hideNum = 0
            if(privacy == "私密"){
                privacyNum = 1
                if(hide == "隱藏"){
                    hideNum = 1
                }
            }
            let result = await societyModel.addSociety(userId, societyName, privacyNum, hideNum)
            const data = {
                ok : true,
                link : result.insertId
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

societyRouter.get("/", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            let result = await societyModel.searchSocietyMember(userId)
            const data = {
                ok : true,
                society : result
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


societyRouter.get("/:id", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid;
            const confirm = await societyModel.checkSocietyMember(userId, societyId);
            const Administrator = await societyModel.societyAdministrator(userId, societyId);
            const result = await societyModel.searchSociety(societyId);
            const Inviter = await societyModel.searchSocietyInviteMember(userId, societyId);
            let permissions = false
            let societyMember = false
            if(Administrator){
                permissions = true
            }
            if(!result.societyPrivacy){ 
                if(confirm && confirm.status == "ACCEPTED"){
                    societyMember = true
                    res.status(200).json({
                        ok: true,
                        society : result,
                        societyMember : societyMember, 
                        permissions : permissions,
                        message: "進入社團"
                    });
                }else{
                    res.status(200).json({
                        ok : true,
                        society : result,
                        societyMember : societyMember,
                        confirm : confirm,
                        permissions : permissions,
                        message : "進入社團"
                    })
                }
            }else{
                if(result.societyHide){
                    if(confirm && confirm.status == "ACCEPTED"){
                        societyMember = true
                        res.status(200).json({
                            ok: true,
                            society : result,
                            societyMember : societyMember, 
                            confirm : confirm,
                            permissions : permissions,
                            message: "進入社團"
                        });
                    }else{
                        if(Inviter){
                            res.status(200).json({
                                ok: true,
                                society : result,
                                societyMember : societyMember, 
                                confirm : confirm,
                                permissions : permissions,
                                message: "進入社團"
                            });
                        }else{
                            res.status(403).json({
                                error: true,
                                message: "社團隱藏不公開"
                            });
                        }
                    }
                }else{
                    if(confirm && confirm.status == "ACCEPTED"){
                        societyMember = true
                        res.status(200).json({
                            ok: true,
                            society : result,
                            societyMember : societyMember, 
                            confirm : confirm,
                            permissions : permissions,
                            message : "進入社團"
                        });
                    }else{
                        res.status(200).json({
                            ok: true,
                            society : result,
                            societyMember : societyMember,
                            confirm : confirm,
                            message: "社團確認頁面"
                        });
                    }
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



societyRouter.patch("/:id", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const description = req.body.description
            const result = await societyModel.societyAdministrator(userId, societyId)
            if(result.userId == userId){
                await societyModel.addsocietyintroduction(societyId, description)
                res.status(200).json({
                    ok:true,
                    description : description
                })
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

societyRouter.post("/:id/background", upload.single("image"), async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            // const userId = decoded.userid
            // const result = await societyModel.societyAdministrator(userId, societyId)
            // if(result.userId == userId){
                
            // }
            jwt.verify(token, secret, (err, decoded) => {
                if(decoded){
                    const useremail = decoded.useremail
    
                    let upload = req.file
                    if(upload){
                        const tokenrand = randtoken.generate(16);
                        const params = {
                            Bucket : bucketName,
                            Key : "societyBackground/" + tokenrand,
                            Body : upload.buffer,
                            ContentType : upload.mimetype
                        };
                        s3.upload(params, async (err, picdata) => {
                            if (err) {
                                res.status(500).json(picdata)
                            } else {
                                let imageUrl = picdata.Location.replace(myawsurl, cloudfront)
                                imageUrl = imageUrl.replace(myawsurlloc, cloudfront)
                                await societyModel.storeSocietybackground(societyId, imageUrl)
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
            });
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

societyRouter.post("/:id/add", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const result = await societyModel.checkSocietyMember(userId, societyId)
            if(!result || result.status == "DECLINED"){
                await societyModel.addSocietyMember(societyId, userId)
            }else if (result == "ACCEPTED"){
                res.status(403).json({
                    error:true,
                    message : "已經是社團會員"
                })
            }else{
                res.status(200).json({
                    error : true,
                    message : "等待回應"
                })
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

societyRouter.get("/:id/member", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const result = await societyModel.societyAdministrator(userId, societyId)
            const results = await societyModel.searchAllSocietyMember(societyId)
            if(result){
                const data = {
                    ok : true,
                    allsocietyMember : results,
                    permissions : true
                }
                res.status(200).json(data)
            }else{
                const data = {
                    ok : true,
                    allsocietyMember : results,
                    permissions : false
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
societyRouter.delete("/:id/member", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const memberId = req.body.deleteMemberId
            const result = await societyModel.societyAdministrator(userId, societyId)
            if(result.userId == userId){
                await societyModel.deleteSocietyMember(societyId, memberId)
                res.status(200).json({ok:true})
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

societyRouter.get("/:id/memberRequests", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const result = await societyModel.societyMemberRequest(societyId, userId)
            const data = {
                societyMemberRequest : result
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

societyRouter.put("/:id/memberRequests", async(req, res)=>{
    try{
        const mycookie = req.headers.cookie
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            // const userId = decoded.userid
            const confirm = req.body.confirm
            const userId = req.body.userId
            await societyModel.confirmSocietyMember (societyId, userId, confirm)
            await societyModel.deleteSocietyInvite(societyId, userId)
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


societyRouter.post("/:id", upload.array("images", 3), (req, res)=>{
    try{
        const mycookie = req.headers.cookie;
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(mycookie){
            const token = mycookie.replace("token=", "")
            jwt.verify(token, secret, async(err, decoded) => {
                if(decoded){
                    const userId = decoded.userid;
                    const userEmail = decoded.useremail;
                    const userName = decoded.username;
                    const postText = req.body.postText;
                    const location = req.body.location;
                    const dateTime = req.body.dateTime;
                    // const societyId = societyId;
                    const imageFiles = req.files;
                    if(postText||location||imageFiles[0]){
                        await societyModel.addSocietyPost(userId, societyId, dateTime, postText, location);
                        const postIdResult = await societyModel.getSocietyPostId(userId, dateTime)
                        const postId = postIdResult.societyPostId
                        const getUserDataResult = await memberModel.checkCookie(userEmail)
                        const userAvatar = getUserDataResult.useravatar
                        if(imageFiles[0]){
                            const postIdResult = await societyModel.getSocietyPostId(userId, dateTime)
                            const postId = postIdResult.societyPostId
                            const uploadPromises = imageFiles.map((file) => {
                                const tokenrand = randtoken.generate(16);
                                const params = {
                                    Bucket : bucketName,
                                    Key : "societyPostImages/" + tokenrand,
                                    Body : file.buffer,
                                    ContentType : file.mimetype
                                };
                                
                                return s3.upload(params).promise(); // 返回一个 Promise，代表上传请求
                            });
                            await Promise.all(uploadPromises).then(async(results) => {
                                for (const result of results) {
                                    let imageUrl = result.Location.replace(myawsurl, cloudfront)
                                    imageUrl = imageUrl.replace(myawsurlloc, cloudfront)
                                    await societyModel.societyPostImage(societyId, postId, imageUrl)
                                }
                            })
                            const getPostImage = await societyModel.getSocietyPostImage(postId)
                            let data = {
                                userId : userId,
                                userAvatar : userAvatar, 
                                userName: userName,
                                postId : postId,
                                societyId : societyId,
                                dateTime : dateTime,
                                location : location,
                                postText : postText,
                                images : getPostImage
                            }
                            res.status(200).json(data)
                        }else{
                            let data = {
                                userId : userId,
                                userAvatar : userAvatar, 
                                userName: userName,
                                postId : postId,
                                societyId : societyId,
                                dateTime : dateTime,
                                location : location,
                                postText : postText
                            }
                            res.status(200).json(data)
                        }
                    }else{
                        let data = {
                            error : true,
                            message : "null"
                        }
                        res.status(400).json(data)
                    }
                }
            })
        }else{
            let data = {
                error : true,
                message : "Please Login"
            }
            res.status(403).json(data)
        }
    }catch{
        let data = {
            error : true,
            message : "server error"
        }
        res.status(404).json(data)
    }
})

societyRouter.get("/:id/like", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            let postId = req.query.postId;
            const getAllLiker = await societyModel.getAllLiker(postId);
            let data = {
                allLiker: getAllLiker
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

societyRouter.post("/:id/like", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const likeCount = req.body.likeCount 
            const postId = req.body.postId 
            const timestamp = req.body.timestamp 
            if(likeCount){
                await societyModel.addlike(societyId, postId, userId, timestamp)
                res.status(200).json({OK:true})
            }else{
                await societyModel.deleteLike(societyId, postId, userId)
                res.status(200).json({OK:true})
            }
        }else{
            let data = {
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

societyRouter.post("/:id/comment", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const postId = req.body.postId 
            const comment = req.body.comment 
            const dateTime = req.body.dateTime 
            if(comment){
                await societyModel.comment(societyId, postId, userId, comment, dateTime)
            }
            res.status(200).json({OK:true})
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

societyRouter.delete("/:id/delete", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const societyAdministrator = await societyModel.societyAdministrator(userId, societyId)
            if(societyAdministrator.userId == userId && societyAdministrator.societyId == societyId){
                await societyModel.deleteSociety(societyId)
                res.status(200).json({ok:true})
            }else{
                let data ={
                    "error" : true,
                    "message" : "用戶無權限"
                }
                res.status(403).json(data)
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

societyRouter.post("/:id/invite", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        const societyId = req.params.id; // 要瀏覽的社團 ID
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const inviteUserId = req.body.userId
            await societyModel.societyInvite(societyId, userId, inviteUserId)
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

societyRouter.patch("/invite", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const societyId = req.body.societyId
            const inviteUserId = req.body.userId
            await societyModel.clickSocietyInvite(societyId, userId, inviteUserId)
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


async function getPostData(userId, article, allData, societyId){
    let articleLength = article.length
    if(articleLength == 6 ){
        articleLength = articleLength - 1
    }
    for(let i=0 ; i < articleLength; i++){ 
        const postPhoto = await societyModel.getSocietyPostImage(article[i].societyPostId);
        const getLikes = await societyModel.getLikes(article[i].societyPostId, userId);
        const getAllLikes = await societyModel.getAllLikes(article[i].societyPostId);
        const getAllLiker = await societyModel.getAllLiker(article[i].societyPostId);
        const getAllComment = await societyModel.getAllComment(article[i].societyPostId, societyId);
        const count = getAllLikes["COUNT(*)"];
        let clickLike = false
        if(getLikes["societyPostId"] && getLikes["userId"]){
            clickLike = true
        }
        let postLike = {
            count : count, 
            clickLike : clickLike
        }
        let photos;
        if(postPhoto[0]){
            photos = postPhoto;
        }else{
            photos = null;
        }
        const oneData = {
            "userId": userId,
            "postId": article[i].societyPostId,
            "postUserId": article[i].postUserId,
            "postUserAvatar": article[i].postUserAvatar,
            "postUserName": article[i].postUserName,
            "postDateIime": article[i].postDateTime,
            "societyId": article[i].societyId,
            "postText": article[i].postText,
            "location": article[i].location,
            "images": photos,
            "postLiker" : getAllLiker,
            "postLike": postLike,
            "postComment": getAllComment
        }
        allData.push(oneData);
    }
}

async function getPostLikerData(article, allData){
    let articleLength = article.length
    if(articleLength == 6 ){
        articleLength = articleLength - 1
    }
    for(let i=0 ; i < articleLength; i++){ 
        const oneData = {
            "postLiker" : getAllLiker,
        }
        allData.push(oneData);
    }
}

module.exports = societyRouter