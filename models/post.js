const promisePool = require("./database.js")

const postModel = {
    addPost : async(userId, dateTime, postText, location) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `INSERT INTO post (userId, dateTime, postText, location) 
            VALUES (?, ?, ?, ?);`
            let params = [userId, dateTime, postText, location]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    postImage : async(postId, image) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `INSERT INTO postImage (postId, image) VALUES (?, ?);`
            let params = [postId, image]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    getPostId : async(userId, dateTime) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT * FROM post WHERE userId = ? and dateTime = ? ;`
            let params = [userId, dateTime]
            let [[result]] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    getPostImage : async(postId) =>{
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT * FROM postImage WHERE postId = ? ;`
            let params = [postId]
            let [results] = await connect.query(sql, params);
            let data = []
            for(let result of results){
                data.push(result.image)
            }
            return data
        }finally{
            connect.release()
        }
    },
    getAllPosts : async(userId, Page) => {
        const connect = await promisePool.getConnection()
        try{
            // const sql = `
            //     SELECT
            //     post.postId, post.userId AS postUserId, post.dateTime AS postDateTime,
            //     post.postText, post.location,
            //     user.username AS postUserName, user.useravatar AS postUserAvatar
            //     FROM post
            //     INNER JOIN user ON post.userId = user.userId
            //     ORDER BY post.dateTime DESC
            //     LIMIT ?, 6
            // `;
            const sql = `
            SELECT post.postId, post.userId, post.dateTime, post.postText, post.location,
            user.userId AS postUserId, user.username AS postUserName, user.useravatar AS postUserAvatar
            FROM post
            INNER JOIN user ON post.userId = user.userId
            WHERE post.userId = ? OR post.userId IN (
                SELECT friendId FROM friend WHERE userId = ? AND status = "ACCEPTED"
            )
            ORDER BY post.dateTime DESC
            LIMIT ?, 6
            `
            let params = [userId, userId, Page*5]
            let [results] = await connect.query(sql, params);
            return results
        }finally{
            connect.release()
        }
    },
    getLikes : async(postId, userId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT COUNT(*), postId, userId FROM postLike WHERE postId = ? AND userId = ?`;
            let params = [postId, userId];
            const [[result]] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    getAllLikes : async(postId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT COUNT(*) FROM postLike WHERE postId = ?`;
            let params = [postId];
            const [[result]] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    addlike : async(postId, userId, timestamp) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `INSERT INTO postLike(postId, userId, dateTime) VALUES (?, ?, ?)`;
            let params = [postId, userId, timestamp]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    deleteLike : async(postId, userId)=>{
        const connect = await promisePool.getConnection()
        try{
            const sql = `DELETE FROM postLike WHERE postId = ? AND userId = ?`;
            let params = [postId, userId]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    comment : async(postId, userId, comment, dateTime)=>{
        const connect = await promisePool.getConnection()
        try{
            const sql = `INSERT INTO postComment (postId, userId, commentText, dateTime)
            VALUES (?, ?, ?, ?)
            `;
            let params = [postId, userId, comment, dateTime]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    getAllComment : async(postId)=>{
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT
                postComment.postCommentId, postComment.userId AS postCommentUserId, postComment.dateTime AS postCommentDateTime, 
                postComment.commentText, user.username AS postCommentUserName, user.useravatar AS postCommentAvatar
            FROM postComment
            INNER JOIN user ON postComment.userId = user.userId
            WHERE postId = ?
            `;
            let params = [postId]
            const [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    getAllLiker : async(postId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT 
            postLike.postId, user.userid, user.username AS userName, user.useravatar
            FROM postLike 
            INNER JOIN user ON postLike.userId = user.userId
            WHERE postId = ? ;`;
            let params = [postId];
            const [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    getLikerSelfPost : async(userId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT postLike.postId, postLike.dateTime, postLike.userId, user.userName, userAvatar
            FROM postLike 
            INNER JOIN post ON postLike.postId = post.postId  
            INNER JOIN user ON postLike.userId = user.userId
            WHERE post.userId = ? ORDER BY postLike.dateTime DESC;
            `;
            let params = [userId];
            const [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    deletePost : async(postId) => {
        const connect = await promisePool.getConnection()
        try{
            let sql = `DELETE FROM postImage WHERE postId = ?;`;
            let params = [postId];
            await connect.query(sql, params);
            sql = `DELETE FROM postLike WHERE postId = ?;`;
            await connect.query(sql, params);
            sql = `DELETE FROM postComment WHERE postId = ?;`;
            await connect.query(sql, params);
            sql = `DELETE FROM post WHERE postId = ?;`;
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    }, 
    updatePost : async(postId, userId, postText, location) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            UPDATE post SET
            postText = ?, location = ?
            WHERE postId = ? AND userId = ?
            `
            const params = [postText, location, postId, userId]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    deletePostImage :async(postId, imageurl) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            DELETE FROM postImage WHERE postId = ? AND image = ? ; 
            `
            const params = [postId, imageurl]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    updatePostImage : async(postId, imageurl) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            INSERT INTO postImage (postId, image) VALUES (?, ?);
            `
            const params = [postId, imageurl]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    }
}


module.exports = postModel
