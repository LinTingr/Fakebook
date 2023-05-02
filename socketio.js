const {Server} = require("socket.io")

const users = [];

function socketioServer(server){
    const socketServer = new Server(server);
    socketServer.on("connection", (socket) => {
        console.log("a user connected", socket.id);
        socket.on("login",(userId)=>{
            let data = {
                user : userId,
                socketId :socket.id
            }
            let index = users.findIndex(u => u.user === userId);
            if (index !== -1) {
                users[index].socketId = socket.id;
            } else {
                users.push(data);
            }
            console.log(users)
        })

        socket.on("sendMessage", (content)=>{
            console.log("content", content)
            for(let i = 0; i < users.length; i++){
                if(users[i].user == content.receiveUserId){
                    console.log(users[i].user)
                    socketServer.to(users[i].socketId).emit("privateMessage", {
                        sendUserId: content.sendUserId,
                        sendUserName: content.sendUserName,
                        sendUserAvatar: content.sendUserAvatar,
                        message : content.message
                    });
                }
            }
        })

        socket.on("ACCEPTED", (AcceptedData)=>{
            for(let i = 0; i < users.length; i++){
                if(users[i].user == AcceptedData.sendUserId){
                    socketServer.to(users[i].socketId).emit("acceptedMessage", {
                        sendUserId: AcceptedData.sendUserId,
                        sendUserName: AcceptedData.sendUserName,
                    });
                }
            }
        })
        
        socket.on("disconnect", () => {
            console.log("A user disconnected.", socket.id);
            for(let i = 0; i < users.length; i++){
                if(users[i].socketId == socket.id){
                    users.splice(i, 1)
                }
            }
            console.log("disconnect", users)
        })
    });
}


module.exports.start = socketioServer