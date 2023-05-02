const promisePool = require("./database.js")

const societyModel = {
    addSociety : async(userId, societyName, societyPrivacy, societyHide) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            INSERT INTO society (societyName, societyPrivacy, societyHide) 
            VALUES (?, ?, ?);`
            let params = [societyName, societyPrivacy, societyHide]
            const [result] = await connect.query(sql, params);
            const societyId = result.insertId;

            const addSocietyAdministratorSql = `
            INSERT INTO societyAdministrator (societyId, userId) 
            VALUES (?, ?);`
            params = [societyId, userId]
            await connect.query(addSocietyAdministratorSql, params);

            const societyMember = `
            INSERT INTO societyMember (societyId, userId, status) 
            VALUES (?, ?, "ACCEPTED");`
            params = [societyId, userId]
            await connect.query(societyMember, params);

            return result
        }finally{
            connect.release()
        }
    },
    searchSocietyMember : async(userId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT societyMember.societyId, society.societyName
            FROM societyMember 
            INNER JOIN society ON societyMember.societyId = society.societyId
            WHERE userId = ? AND status = "ACCEPTED" ;`
            let params = [userId]
            const [result] = await connect.query(sql, params);
            return result
        }finally{ 
            connect.release()
        }
    },
    addSocietyAdministrator : async(societyId, userId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            INSERT INTO societyAdministrator (societyId, userId) 
            VALUES (?, ?);`
            let params = [societyId, userId]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    searchSociety : async(societyId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT societyName, societyPicture, societyDescription, societyPrivacy, societyHide
            FROM society 
            WHERE societyId = ? ;`
            let params = [societyId]
            const [[result]] = await connect.query(sql, params);
            return result
        }finally{ 
            connect.release()
        }
    },
    searchAllSociety : async(societyName) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT societyId, societyName, societyPicture, societyDescription, societyPrivacy
            FROM society 
            WHERE societyName LIKE ? AND societyHide != 1;`
            let params = [`%${societyName}%`]
            const [result] = await connect.query(sql, params);
            return result
        }finally{ 
            connect.release()
        }
    },
    societyAdministrator : async(userId, societyId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT * FROM societyAdministrator 
            WHERE userId = ? AND societyId = ?`
            let params = [userId, societyId]
            const [[result]] = await connect.query(sql, params);
            return result
        }finally{ 
            connect.release()
        }
    },
    addsocietyintroduction : async(societyId, societydescription) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `UPDATE society SET societyDescription = ? WHERE societyId = ?;`
            let params = [societydescription, societyId]
            await connect.query(sql, params);
        }finally{ 
            connect.release()
        }
    },
    storeSocietybackground : async(societyId, societybackground) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `UPDATE society SET societyPicture = ? WHERE societyId = ?;`
            let params = [societybackground, societyId]
            await connect.query(sql, params);
        }finally{ 
            connect.release()
        }
    },
    addSocietyMember : async(societyId, userId) => {
        const connect = await promisePool.getConnection()
        try{
            const searchSql = `SELECT * FROM societyMember WHERE userId = ? AND societyId = ? `;
            let params = [userId, societyId]
            let [[result]] = await connect.query(searchSql, params);
            if(!result){
                const sql = "INSERT INTO societyMember (userId, societyId) values (?, ?)"
                await connect.query(sql, params);
            }else{
                const sql = `
                UPDATE societyMember SET 
                status = "PENDING", 
                updatedAt = NOW() 
                WHERE userId = ? AND societyId = ?;
                `;
                await connect.query(sql, params);
            }
        }finally{ 
            connect.release()
        }
    },
    checkSocietyMember : async(userId, societyId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT status 
            FROM societyMember 
            WHERE userId = ? AND societyId = ? `;
            let params = [userId, societyId]
            let [[result]] = await connect.query(sql, params);
            return result
        }finally{ 
            connect.release()
        }
    },
    societyMemberRequest : async(societyId, userId) => {
        const connect = await promisePool.getConnection()
        try{
            const searchSql = `
            SELECT societyMember.status,
            user.userId, user.userName, user.userAvatar
            FROM societyMember 
            INNER JOIN user ON user.userId = societyMember.userId
            WHERE societyId = ? AND status = "PENDING";`;
            let params = [societyId]
            let [result] = await connect.query(searchSql, params);
            return result
        }finally{ 
            connect.release()
        }
    },
    confirmSocietyMember :  async(societyId, userId, confirm) => {
        const connect = await promisePool.getConnection()
        try{
            const searchSql = `
            UPDATE societyMember SET status = ?
            WHERE societyId = ? AND userId = ?`;
            let params = [confirm, societyId, userId]
            await connect.query(searchSql, params);
        }finally{ 
            connect.release()
        }
    },
    addSocietyPost : async(userId, societyId, dateTime, postText, location) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `INSERT INTO societyPost (societyId, societyPostUserId, dateTime, societyPostText, location) 
            VALUES (?, ?, ?, ?, ?);`
            let params = [societyId, userId, dateTime, postText, location]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    getSocietyPostId : async(userId, dateTime) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT * FROM societyPost WHERE societyPostUserId = ? and dateTime = ? ;`
            let params = [userId, dateTime]
            let [[result]] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    societyPostImage : async(societyId, societyPostId, image) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `INSERT INTO societyPostImage (societyId, societyPostId, image) VALUES (?, ?, ?);`
            let params = [societyId, societyPostId, image]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    getSocietyPostImage : async(societyPostId) =>{
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT * FROM societyPostImage WHERE societyPostId = ? ;`
            let params = [societyPostId]
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
    getAllLiker : async(postId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT 
            societyPostLike.societyPostId, user.userid, user.username AS userName, user.useravatar
            FROM societyPostLike 
            INNER JOIN user ON societyPostLike.userId = user.userId
            WHERE societyPostId = ? ;`;
            let params = [postId];
            const [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    addlike : async(societyId, societyPostId, userId, timestamp) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `INSERT INTO societyPostLike(societyId, societyPostId, userId, dateTime) VALUES (?, ?, ?, ?)`;
            let params = [societyId, societyPostId, userId, timestamp]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    deleteLike : async(societyId, societyPostId, userId)=>{
        const connect = await promisePool.getConnection()
        try{
            const sql = `DELETE FROM societyPostLike WHERE societyId = ? AND societyPostId = ? AND userId = ?`;
            let params = [societyId, societyPostId, userId]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    getAllLikes : async(societyPostId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT COUNT(*) FROM societyPostLike WHERE societyPostId = ?`;
            let params = [societyPostId];
            const [[result]] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    getLikes : async(societyPostId, userId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT COUNT(*), societyPostId, userId FROM societyPostLike WHERE societyPostId = ? AND userId = ?`;
            let params = [societyPostId, userId];
            const [[result]] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    getAllComment : async(societyPostId, societyId)=>{
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT
                societyPostComment.societyPostId, societyPostComment.userId AS societyPostCommentUserId, societyPostComment.dateTime AS societyPostCommentDateTime, 
                societyPostComment.commentText, user.username AS societyPostCommentUserName, user.useravatar AS societyPostCommentAvatar
            FROM societyPostComment
            INNER JOIN user ON societyPostComment.userId = user.userId
            WHERE societyPostId = ? AND societyId = ?
            `;
            let params = [societyPostId, societyId]
            const [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    }, 
    getSocietyPost : async(societyId, nextPage) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT
            societyPost.societyPostId, societyPost.societyId, societyPost.societyPostUserId AS postUserId, societyPost.dateTime AS postDateTime,
            societyPost.societyPostText AS postText, societyPost.location,
            user.username AS postUserName, user.useravatar AS postUserAvatar
            FROM societyPost
            INNER JOIN user ON societyPost.societyPostUserId = user.userId
            WHERE societyPost.societyId = ?
            ORDER BY societyPost.dateTime DESC
            LIMIT ?, 6;
            `;
            let params = [societyId, nextPage*5];
            const [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    }, 
    comment : async(societyId, societyPostId, userId, comment, dateTime)=>{
        const connect = await promisePool.getConnection()
        try{
            const sql = `INSERT INTO societyPostComment (societyId, societyPostId, userId, dateTime, commentText)
            VALUES (?, ?, ?, ?, ?)
            `;
            let params = [societyId, societyPostId, userId, dateTime, comment]
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    }, 
    deleteSociety : async(societyId) => {
        const connect = await promisePool.getConnection()
        try{
            let sql = `DELETE FROM societyPostImage WHERE societyId = ?;`;
            let params = [societyId]
            await connect.query(sql, params);
            sql = `DELETE FROM societyInvite WHERE societyId = ?;`;
            await connect.query(sql, params);
            sql = `DELETE FROM societyAdministrator WHERE societyId = ?;`;
            await connect.query(sql, params);
            sql = `DELETE FROM societyMember WHERE societyId = ?;`;
            await connect.query(sql, params);
            sql = `DELETE FROM societyPostImage WHERE societyId = ?;`;
            await connect.query(sql, params);
            sql = `DELETE FROM societyPostLike WHERE societyId = ?;`;
            await connect.query(sql, params);
            sql = `DELETE FROM societyPostComment WHERE societyId = ?;`;
            await connect.query(sql, params);
            sql = `DELETE FROM societyPost WHERE societyId = ?;`;
            await connect.query(sql, params);
            sql = `DELETE FROM society WHERE societyId = ?;`;
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    searchAllSocietyMember : async(societyId) => {
        const connect = await promisePool.getConnection();
        try{
            const sql = `SELECT societyMember.societyId, societyMember.userId,
            user.userid, user.username, user.useravatar FROM societyMember
            INNER JOIN user ON societyMember.userId = user.userid
            WHERE societyId = ? AND status = "ACCEPTED";`;
            const params = [societyId];
            const [results] = await connect.query(sql, params);
            return results
        }finally{
            connect.release();
        }
    },
    deleteSocietyMember : async(societyId, userId) => {
        const connect = await promisePool.getConnection();
        try{
            const sql = `DELETE FROM societyMember WHERE societyId = ? AND userId = ? AND status = "ACCEPTED";`;
            const params = [societyId, userId];
            await connect.query(sql, params);
        }finally{
            connect.release();
        }
    },
    societyInvite : async(societyId, userId, inviteUserId) => {
        const connect = await promisePool.getConnection();
        try{
            let sql = `
            SELECT societyInvite.societyId, societyInvite.userId, societyInvite.inviteUserid, societyInvite.checkClick
            FROM societyInvite 
            WHERE societyId = ? AND userId = ? AND inviteUserId = ?;
            `;
            const params = [societyId, userId, inviteUserId];
            const [[result]] = await connect.query(sql, params);
            if(!result){
                console.log("test")
                sql = `INSERT INTO societyInvite(societyId, userId, inviteUserId) VALUES(?, ?, ?)`;
                await connect.query(sql, params);
            }
        }finally{
            connect.release();
        }
    },
    clickSocietyInvite : async(societyId, userId, inviteUserId) => {
        const connect = await promisePool.getConnection();
        try{
            const sql = `UPDATE societyInvite SET checkClick = True WHERE inviteUserId = ? AND userId = ?;`;
            const params = [societyId, userId, inviteUserId];
            await connect.query(sql, params);
        }finally{
            connect.release();
        }
    },
    searchSocietyInvite : async(userId) => {
        const connect = await promisePool.getConnection();
        try{
            const sql = `
            SELECT societyInvite.societyId, societyInvite.userId, societyInvite.inviteUserid, societyInvite.checkClick,
            user.userName, user.userAvatar, society.societyName
            FROM societyInvite 
            INNER JOIN user ON user.userId = societyInvite.userId
            INNER JOIN society ON society.societyId = societyInvite.societyId
            WHERE inviteUserId = ? AND checkClick = False;
            `;
            const params = [userId];
            const [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release();
        }
    },
    searchSocietyInviteMember : async(userId, societyId) => {
        const connect = await promisePool.getConnection();
        try{
            const sql = `
            SELECT societyInvite.societyId, societyInvite.userId, societyInvite.inviteUserid, societyInvite.checkClick,
            user.userName, user.userAvatar
            FROM societyInvite 
            INNER JOIN user ON user.userId = societyInvite.userId
            WHERE inviteUserId = ? AND societyId = ?;
            `;
            const params = [userId, societyId];
            const [[result]] = await connect.query(sql, params);
            return result
        }finally{
            connect.release();
        }
    },
    deleteSocietyInvite : async(societyId, userId) => {
        const connect = await promisePool.getConnection();
        try{
            const sql = `
            DELETE FROM societyInvite WHERE inviteUserId = ? AND societyId = ?;
            `;
            const params = [userId, societyId];
            await connect.query(sql, params);
        }finally{
            connect.release();
        }
    }

}

module.exports = societyModel
