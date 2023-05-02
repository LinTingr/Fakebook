const express = require("express");
const multer = require("multer");
const postRouter = express.Router();
postRouter.use(express.json()); 
const upload = multer();
const randtoken = require("rand-token");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SSjwtSS;
const postModel = require("../models/post")
const memberModel = require("../models/member")

const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region:""
});
const cloudfront = "https://dj4dpx5jn61t7.cloudfront.net"
const myawsurl = "https://mywebting.s3.amazonaws.com"
const myawsurlloc = "https://mywebting.s3.ap-northeast-1.amazonaws.com"
const s3 = new AWS.S3();
const bucketName = "mywebting";

postRouter.post("/", upload.array("images", 3), (req, res)=>{
    try{
        const mycookie = req.headers.cookie;
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
                    const imageFiles = req.files;
                    if(postText||location||imageFiles[0]){
                        await postModel.addPost(userId, dateTime, postText, location);
                        const postIdResult = await postModel.getPostId(userId, dateTime)
                        const postId = postIdResult.postId
                        const getUserDataResult = await memberModel.checkCookie(userEmail)
                        const userAvatar = getUserDataResult.useravatar
                        if(imageFiles[0]){
                            const postIdResult = await postModel.getPostId(userId, dateTime)
                            const postId = postIdResult.postId
                            const uploadPromises = imageFiles.map((file) => {
                                const tokenrand = randtoken.generate(16);
                                const params = {
                                    Bucket : bucketName,
                                    Key : "postimages/" + tokenrand,
                                    Body : file.buffer,
                                    ContentType : file.mimetype
                                };
                                
                                return s3.upload(params).promise(); // 返回一个 Promise，代表上传请求
                            });
                            await Promise.all(uploadPromises).then(async(results) => {
                                for (const result of results) {
                                    let imageUrl = result.Location.replace(myawsurl, cloudfront)
                                    imageUrl = imageUrl.replace(myawsurlloc, cloudfront)
                                    await postModel.postImage(postId, imageUrl)
                                }
                            })
                            const getPostImage = await postModel.getPostImage(postId)
                            const getuserdata = await memberModel.checkCookie(userEmail)
                            let data = {
                                userId : userId,
                                userAvatar : userAvatar, 
                                userName: userName,
                                postId : postId,
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

postRouter.patch("/", upload.array("images", 3), (req, res)=>{
    try{
        const mycookie = req.headers.cookie;
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
                    const postId = req.body.postId;
                    const imageFiles = req.files;
                    const deleteImages = req.body.deleteImages;
                    if(imageFiles.length < 4){
                        if(deleteImages||postText||location||imageFiles[0]){
                            if(typeof(deleteImages) === "string"){
                                await postModel.deletePostImage(postId, deleteImages)
                            }else{
                                for(let i in deleteImages){
                                    await postModel.deletePostImage(postId, deleteImages[i])
                                }
                            }
                            await postModel.updatePost(postId, userId, postText, location);
                            if(imageFiles[0]){
                                const uploadPromises = imageFiles.map((file) => {
                                    const tokenrand = randtoken.generate(16);
                                    const params = {
                                        Bucket : bucketName,
                                        Key : "postimages/" + tokenrand,
                                        Body : file.buffer,
                                        ContentType : file.mimetype
                                    };
                                    return s3.upload(params).promise(); // 返回一个 Promise，代表上传请求
                                });
                                await Promise.all(uploadPromises).then(async(results) => {
                                    for (const result of results) {
                                        let imageUrl = result.Location.replace(myawsurl, cloudfront)
                                        imageUrl = imageUrl.replace(myawsurlloc, cloudfront)
                                        await postModel.updatePostImage(postId, imageUrl)
                                    }
                                })
                            }
                            res.status(200).json({ok:true})
                        }else{
                            let data = {
                                error : true,
                                message : "null"
                            }
                            res.status(400).json(data)
                        }
                    }else{
                        let data = {
                            error : true,
                            message : "圖片超過4張"
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

postRouter.get("/like/own", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const getLikerSelfPost = await postModel.getLikerSelfPost(userId);
            let data = {
                getLikerSelfPost: getLikerSelfPost
            }
            res.status(200).json(data)
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

postRouter.get("/like", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            let postId = req.query.postId;
            const getAllLiker = await postModel.getAllLiker(postId);
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

postRouter.get("/", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            let allData = []
            let nextPage
            let Page = req.query.postPage;
            Page = Number(Page);
            let article = await postModel.getAllPosts(userId, Page)
            if(article.length <= 5){
                    nextPage = null
            }else{
                nextPage = 1
            }
            await getPostData(userId, article, allData);
            let data = {
                nextPage : nextPage,
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
        let data = {
            error : true,
            message : "server error"
        }
        res.status(404).json(data)
    }
})

// 會員頁面 文章
postRouter.get("/:id", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        const memberId = req.params.id; // 要瀏覽的會員 ID
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const { userid, username, useremail, useravatar } = await memberModel.checkMember(memberId);
            let allData = []
            let nextPage
            let Page = req.query.postPage;
            Page = Number(Page);
            // let article = await postModel.getAllPosts(Page)
            let article = await memberModel.getPost(memberId, Page)
            if(article.length <= 5){
                nextPage = null
            }else{
                nextPage = 1
            }
            await getPostData(userId, article, allData);
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
        let data = {
            error : true,
            message : "server error"
        }
        res.status(404).json(data)
    }
})

postRouter.post("/like", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const likeCount = req.body.likeCount 
            const postId = req.body.postId 
            const timestamp = req.body.timestamp 
            if(likeCount){
                await postModel.addlike(postId, userId, timestamp)
            }else{
                await postModel.deleteLike(postId, userId)
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

postRouter.post("/comment", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const postId = req.body.postId 
            const comment = req.body.comment 
            const dateTime = req.body.dateTime 
            if(comment){
                await postModel.comment(postId, userId, comment, dateTime)
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

postRouter.delete("/", async(req, res)=>{
    try{
        const myCookie = req.headers.cookie;
        if(myCookie){
            const token = myCookie.replace("token=", "")
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userid
            const postUserId = req.body.postUserId
            const postId = req.body.postId
            if(userId == postUserId){
                await postModel.deletePost(postId)
                res.status(200).json({ok:true})
            }else{
                res.status(403).json({
                    error : true,
                    message : "用戶無權限"
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
        let data = {
            error : true,
            message : "server error"
        }
        res.status(404).json(data)
    }
})

async function getPostData(userId, article, allData){
    let articleLength = article.length
    if(articleLength == 6 ){
        articleLength = articleLength - 1
    }
    for(let i=0 ; i < articleLength; i++){ 
        const postPhoto = await postModel.getPostImage(article[i].postId);
        const getLikes = await postModel.getLikes(article[i].postId, userId);
        const getAllLikes = await postModel.getAllLikes(article[i].postId);
        const getAllLiker = await postModel.getAllLiker(article[i].postId);
        const getAllComment = await postModel.getAllComment(article[i].postId);
        const count = getAllLikes["COUNT(*)"];
        let clickLike = false
        if(getLikes["postId"] && getLikes["userId"]){
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
            "postId": article[i].postId,
            "postUserId": article[i].postUserId,
            "postUserAvatar": article[i].postUserAvatar,
            "postUserName": article[i].postUserName,
            "postDateIime": article[i].postDateTime,
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

module.exports = postRouter