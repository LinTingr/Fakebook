const promisePool = require("./database.js")

const chatModel = {
    addchat : async(sendId, reciveId, content, sendTime) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            INSERT INTO chatMessage (sendId, reciveId, content, sendTime) 
            values (?, ?, ?, ?);`
            let params = [sendId, reciveId, content, sendTime];
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    },
    searchChat : async(sendId, reciveId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT chatMessage.sendId, chatMessage.reciveId, chatMessage.content, chatMessage.sendTime,
            user.userName, user.userAvatar
            FROM chatMessage
            INNER JOIN user ON user.userId = chatMessage.sendId
            WHERE sendId = ? AND reciveId = ? OR sendId = ? AND reciveId = ?`
            let params = [sendId, reciveId, reciveId, sendId];
            let [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    searchAllChat : async(sendId, reciveId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
            SELECT chatMessage.sendId, chatMessage.reciveId, chatMessage.content, chatMessage.sendTime,
            user.userName, user.userAvatar
            FROM chatMessage
            INNER JOIN user ON user.userId = chatMessage.sendId
            WHERE sendId = ? AND reciveId = ? OR sendId = ? AND reciveId = ?`
            let params = [sendId, reciveId, reciveId, sendId];
            let [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    }, 
    searchLastChat : async(sendId, reciveId) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = `
                SELECT * FROM chatMessage
                WHERE (sendId = ? AND reciveId = ?)
                OR (sendId = ? AND reciveId = ?)
                ORDER BY sendTime DESC
                LIMIT 1;
            `
            let params = [sendId, reciveId, reciveId, sendId];
            let [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    addChatroom : async(sendId, reciveId) => {
        const connect = await promisePool.getConnection()
        try{
            let sql = `
                SELECT * FROM chat WHERE sendId = ? AND reciveId = ?;
            `
            let params = [sendId, reciveId];
            let [[result]] = await connect.query(sql, params);
            if(!result){
                sql = `INSERT INTO chat (sendId, reciveId) VALUES (?, ?);`
                params = [sendId, reciveId];
                await connect.query(sql, params);
                params = [reciveId, sendId];
                await connect.query(sql, params);
            }else{
                sql = `UPDATE chat SET updatedAt = NOW() WHERE sendId = ? AND reciveId = ?;`
                params = [sendId, reciveId];
                await connect.query(sql, params);
                params = [reciveId, sendId];
                await connect.query(sql, params);
            }
        }finally{
            connect.release()
        }
    },
    chatroom : async(sendId) => {
        const connect = await promisePool.getConnection()
        try{
            let sql = `SELECT chat.chatId, chat.sendId, chat.reciveId, chat.updatedAt, user.userId, user.userName, user.userAvatar FROM chat 
            INNER JOIN user ON user.userId = chat.reciveId 
            WHERE sendId = ? ORDER BY chat.updatedAt DESC;`
            let params = [sendId];
            let [result] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    }
}

module.exports = chatModel