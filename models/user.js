const promisePool = require("./database.js")

const userModel = {
    signIn: async(email) => {
        const connect = await promisePool.getConnection()
        try{
            const sql = "SELECT * FROM user WHERE useremail = ?"
            let params = [email];
            const [[result]] = await connect.query(sql, params);
            return result
        }finally{
            connect.release()
        }
    },
    checkAccount: async(email) =>{
        const connect = await promisePool.getConnection()
        try{
            let sql = "SELECT useremail from user where useremail = ?;"
            let [[result]] = await connect.query(sql, email);
            return result
        }finally{
            connect.release()
        }
    },
    signUp: async(name, email, password, useravatar) =>{
        const connect = await promisePool.getConnection()
        try{
            let sql = "INSERT INTO user(username, useremail, userpassword, useravatar) VALUES (?, ?, ?, ?);"
            let params = [name, email, password, useravatar];
            await connect.query(sql, params);
        }finally{
            connect.release()
        }
    }
} 
module.exports = userModel