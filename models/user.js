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
            const [result] = await connect.query(sql, params);
            return result.insertId; 
        }finally{
            connect.release()
        }
    },
    checkUser: async(userId) =>{
        const connect = await promisePool.getConnection()
        try{
            let sql = "SELECT userId from user where userId = ?;"
            let [[result]] = await connect.query(sql, userId);
            return result
        }finally{
            connect.release()
        }
    }
} 
module.exports = userModel