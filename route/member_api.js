const express = require("express");
const multer = require('multer');
const memberRoute = express.Router();
const jwt = require("jsonwebtoken");
const AWS = require('aws-sdk');
const randtoken = require('rand-token');
require('dotenv').config();
const secret = process.env.SSjwtSS;
const upload = multer();
const postModel = require("../models/post")
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

memberRoute.post("/", upload.single('image'), (req, res) => {
    const mycookie = req.headers.cookie;
    if(mycookie){
        const token = mycookie.replace("token=", "")
        jwt.verify(token, secret, (err, decoded) => {
            if(decoded){
                const useremail = decoded.useremail
                bucketName = "mywebting"
                let upload = req.file
                console.log(upload)
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
                        } else {
                            console.log("picdata",picdata)
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
})

memberRoute.get("/:id", async(req, res) => {
    const mycookie = req.headers.cookie;
    const memberId = req.params.id; // 要瀏覽的會員 ID
    if(mycookie){
        const token = mycookie.replace("token=", "")
        const decoded = jwt.verify(token, secret);
        const { userid, username, useremail, useravatar } = await memberModel.checkMember(memberId);
        const userId = decoded.userid; 
        // let checkfriend = false
        let checkfriend = await friendModel.checkfriend(userId, memberId) || {status : ""}
        const userEmail = decoded.useremail;
        let allData = []
        let permissions
        let article = await memberModel.getPost(memberId)
        await getPostData(userid, article, allData);
        if(memberId != userId){
            permissions = false
        }else{
            permissions = true
        }
        const data = {
            ok : true,
            user : {
                "userid" : userid,
                "username" : username,
                "useremail" : useremail,
                "useravatar" :  useravatar
            },
            articleData : allData,
            checkfriend : checkfriend,
            permissions : permissions
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


module.exports = memberRoute