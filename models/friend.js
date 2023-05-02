const promisePool = require("./database.js")

const friendModel = {
    sendInvite : async(sendMemberId, receiveMember) => {
        const connect = await promisePool.getConnection()
        try{
            const searchSql = `SELECT * FROM friend WHERE userId = ? AND friendId = ? `;
            let params = [sendMemberId, receiveMember];
            let [[result]] = await connect.query(searchSql, params);
            if(!result){
                const sql = "INSERT INTO friend (userId, friendId) values (?, ?)"
                await connect.query(sql, params);
            }else{
                const sql = `
                UPDATE friend SET 
                status = "PENDING", 
                updatedAt = NOW() 
                WHERE userId = ? AND friendId = ?;
                `;
                await connect.query(sql, params);
            }
        }finally{
            connect.release()
        }
    },
    checkInvite : async(sendMemberId, receiveMember) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT * FROM friend WHERE userId = ? AND friendId = ? AND status = "PENDING"; `;
            let params = [sendMemberId, receiveMember];
            let [[result]]= await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    Invite : async(receiveMember) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT 
            user.userid, user.username, user.useravatar,
            friend.userId AS sendUserId, friend.friendId AS receiveUserId
            FROM friend 
            INNER JOIN user ON friend.userId = user.userid
            WHERE friend.friendId = ? AND friend.status = "PENDING"; 
            `;
            let params = [receiveMember];
            let [result]= await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    confirm : async(confirm, sendUserId, userId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            UPDATE friend SET 
            status = ?, 
            updatedAt = NOW() 
            WHERE userId = ? AND friendId = ?;
            `;
            let params = [confirm, sendUserId, userId];
            await connect.query(sql, params);

            const searchSql = `SELECT * FROM friend WHERE userId = ? AND friendId = ? `;
            let params1 = [userId, sendUserId];
            let [[result]] = await connect.query(searchSql, params1);
            if(result){
                const sql = `
                UPDATE friend SET 
                status = ?, 
                updatedAt = NOW() 
                WHERE userId = ? AND friendId = ?;
                `;
                let params2 = [confirm, userId, sendUserId];
                await connect.query(sql, params2);
            }else{
                const sqlInsert = `INSERT INTO friend (userId, friendId, status) values (?, ?, ?)`
                let params2 = [userId, sendUserId, confirm];
                await connect.query(sqlInsert, params2);
            }
        }finally{
            connect.release()
        }
    },
    checkFriends : async(userId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT user.userId, user.userName, user.userAvatar,
            friend.friendId 
            from friend 
            INNER JOIN user ON friend.userId = user.userId
            where status = "ACCEPTED" AND friendId = ?;
            `;
            let params = [userId];
            let [results] = await connect.query(sql, params);
            return results
        }finally{
            connect.release()
        }
    },
    checkfriend : async(sendMemberId, receiveMember) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT status FROM friend WHERE userId = ? AND friendId = ? ; `;
            let params = [sendMemberId, receiveMember];
            let [[result]]= await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    friends : async(userId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `SELECT COUNT(*) FROM friend WHERE userId = ?  AND status = "ACCEPTED"; `;
            let params = [userId];
            let [[result]]= await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    deleteFriend : async(userId, friendId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql =`DELETE FROM friend WHERE userId = ? AND friendId = ? AND status = "ACCEPTED";`
            let params = [userId, friendId];
            await connect.query(sql, params);
            params = [friendId, userId];
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    }
}

module.exports = friendModel