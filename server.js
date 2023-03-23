const express = require("express");
const app = express();
const userRoute = require("./route/user_api")
const memberRoute = require("./route/member_api")
const locationRoute = require("./route/location_api")
const postRoute = require("./route/post_api")
const friendRoute = require("./route/friend_api")
const searchRoute = require("./route/search_api")

app.set("view engine", "ejs")
app.use(express.static("static"))
// Parse JSON bodies (bodyparser for json)
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.use("/api/search", searchRoute)
app.use("/api/location", locationRoute)
app.use("/api/user", userRoute)
app.use("/api/member", memberRoute)
app.use("/api/post", postRoute)
app.use("/api/friend", friendRoute)

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
app.listen(5000, function(){
    console.log("伺服器啟動，http://localhost:5000/")
});