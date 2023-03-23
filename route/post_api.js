const express = require("express");
const multer = require('multer');
const postRoute = express.Router();
postRoute.use(express.json()); 
const upload = multer();
const randtoken = require('rand-token');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const secret = process.env.SSjwtSS;
const postModel = require("../models/post")
const memberModel = require("../models/member")

const AWS = require('aws-sdk');
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

postRoute.post("/", upload.array('images', 3), (req, res)=>{
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
                    const societyId = null;
                    const imageFiles = req.files;
                    if(postText||location||imageFiles[0]){
                        await postModel.addPost(userId, societyId, dateTime, postText, location);
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
                                // console.log('All files uploaded successfully:', results);
                                for (const result of results) {
                                    let imageUrl = result.Location.replace(myawsurl, cloudfront)
                                    imageUrl = imageUrl.replace(myawsurlloc, cloudfront)
                                    await postModel.postImage(postId, imageUrl)
                                }
                            })
                            const getPostImage = await postModel.getPostImage(postId)
                            // console.log("getPostImage",getPostImage)
                            const getuserdata = await memberModel.checkCookie(userEmail)
                            // console.log(getuserdata)
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

postRoute.get("/", async(req, res)=>{
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
            let article = await postModel.getAllPosts(Page)
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

// postRoute.get("/:id", async(req, res)=>{
//     try{
//         const myCookie = req.headers.cookie;
//         const memberId = req.params.id; // 要瀏覽的會員 ID
//         console.log(memberId)
//         if(myCookie){
//             const token = myCookie.replace("token=", "")
//             const decoded = jwt.verify(token, secret);
//             const userId = decoded.userid
//             const { userid, username, useremail, useravatar } = await memberModel.checkMember(memberId);
//             let allData = []
//             let nextPage
//             let Page = req.query.postPage;
//             console.log("Page", Page)
//             Page = Number(Page);
//             // let article = await postModel.getAllPosts(Page)
//             let article = await memberModel.getPost(memberId)
//             if(article.length <= 5){
//                     nextPage = null
//             }else{
//                 nextPage = 1
//             }
//             await getPostData(userId, article, allData);
//             let data = {
//                 nextPage : nextPage,
//                 user : {
//                     "userid" : userid,
//                     "username" : username,
//                     "useremail" : useremail,
//                     "useravatar" :  useravatar
//                 },
//                 articleData : allData
//             }
//             res.status(200).json(data)
//         }else{
//             let data ={
//                 "error" : true,
//                 "message" : "用戶未登入"
//             }
//             res.status(401).json(data)
//         } 
//     }catch{
//         let data = {
//             error : true,
//             message : "server error"
//         }
//         res.status(404).json(data)
//     }
// })

postRoute.post("/like", async(req, res)=>{
    const myCookie = req.headers.cookie;
    if(myCookie){
        const token = myCookie.replace("token=", "")
        const decoded = jwt.verify(token, secret);
        const userId = decoded.userid
        const likeCount = req.body.likeCount 
        const postId = req.body.postId 
        if(likeCount){
            await postModel.addlike(postId, userId)
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

})

postRoute.post("/comment", async(req, res)=>{
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
        const getAllComment = await postModel.getAllComment(article[i].postId);
        const count = getAllLikes['COUNT(*)'];
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
            "societyId": article[i].societyId,
            "postText": article[i].postText,
            "location": article[i].location,
            "images": photos,
            "postLike": postLike,
            "postComment": getAllComment
        }
        allData.push(oneData);
    }

}

module.exports = postRoute