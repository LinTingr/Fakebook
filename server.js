const express = require("express");
const app = express();
const userRouter = require("./route/user_api")
const memberRouter = require("./route/member_api")
const locationRouter = require("./route/location_api")
const postRouter = require("./route/post_api")
const friendRouter = require("./route/friend_api")
const searchRouter = require("./route/search_api")
const chatMessageRouter = require("./route/chatMessage_api")
const societyRouter = require("./route/society_api")
const httpServer = require("http").createServer(app);
const socketio = require("./socketio");
socketio.start(httpServer);

app.set("view engine", "ejs")
app.use(express.static("static"))
// Parse JSON bodies (bodyparser for json)
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.use("/api/search", searchRouter)
app.use("/api/location", locationRouter)
app.use("/api/user", userRouter)
app.use("/api/member", memberRouter)
app.use("/api/post", postRouter)
app.use("/api/friend", friendRouter)
app.use("/api/chatMessage", chatMessageRouter)
app.use("/api/society", societyRouter)

app.get("/", function(req, res){
    res.render("index")
});
app.get("/login", function(req, res){
    res.render("login")
});
app.get("/member/:id", function(req, res){
    const id = req.params.id
    res.render("member", {id:id})
});
app.get("/society/:id", function(req, res){
    const id = req.params.id
    res.render("society", {id:id})
});

httpServer.listen(3000, function(){
    console.log("伺服器啟動，http://localhost:3000/")
});
