const promisePool = require("./database.js")

const memberModel = {
    storePic : async(picdata, email) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = "UPDATE user SET useravatar = ? WHERE useremail = ?"
            let params = [picdata, email];
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    storeBackground : async(picdata, email) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = "UPDATE user SET userBackground = ? WHERE useremail = ?"
            let params = [picdata, email];
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    checkCookie : async(email) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = "SELECT userid, username, useremail, useravatar from user where useremail = ?;"
            let params = [email];
            const [[result]] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    checkMember : async(memberId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = "SELECT * FROM user WHERE userid = ?;"
            let params = [memberId];
            const [[result]] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    getPost : async(memberId, nextPage) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT
            post.postId, post.userId AS postUserId, post.dateTime AS postDateTime,
            post.postText, post.location,
            user.username AS postUserName, user.useravatar AS postUserAvatar
            FROM post
            INNER JOIN user ON post.userId = user.userId
            WHERE user.userId = ?
            ORDER BY post.dateTime DESC
            LIMIT ?, 6;
            `;
            let params = [memberId, nextPage*5];
            const [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    searchMemberName : async(memberName) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = "SELECT userId, userName, userEmail, userAvatar FROM user WHERE username LIKE ? ;"
            let params = [`%${memberName}%`];
            const [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    addIntroduction : async(userId, introduction) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = "UPDATE user SET userIntroduction = ? WHERE userId = ?;";
            let params = [introduction, userId];
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    }
}

module.exports = memberModel