const promisePool = require("./database.js")

const postModel = {
    addPost : async(userId, societyId, dateTime, postText, location) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `INSERT INTO post (userId, societyId, dateTime, postText, location) 
            VALUES (?, ?, ?, ?, ?);`
            let params = [userId, societyId, dateTime, postText, location]
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
    getAllPosts : async(Page) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
                SELECT
                post.postId, post.userId AS postUserId, post.dateTime AS postDateTime,
                post.postText, post.location,
                user.username AS postUserName, user.useravatar AS postUserAvatar
                FROM post
                INNER JOIN user ON post.userId = user.userId
                ORDER BY post.dateTime DESC
                LIMIT ?, 6
            `;
            let params = Page*5
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
    addlike : async(postId, userId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `INSERT INTO postLike(postId, userId) VALUES (?, ?)`;
            let params = [postId, userId]
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
    }
}


module.exports = postModel
