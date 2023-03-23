const express = require("express");
const locationRoute = express.Router()
require('dotenv').config();
locationRoute.use(express.json()); 

locationRoute.get("/", async(req, res)=>{
    let place = req.query.keyword
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&key=${process.env.googleAPIkey}`;
    await fetch(url).then(response => { 
        return response.json()
    }).then(data => {
        // 從回傳的結果中取得地點的經緯度資訊
        let results = data.results
        let searchlocation = []
        for(let i = 0; i<results.length; i++){
            let data = {
                name : results[i].name,
                address : results[i].formatted_address
            }
            searchlocation.push(data)
        }
        if(searchlocation){
            let data = {
                locationData : searchlocation,
            }
            res.status(200).json(data)
        }
    })
    
})

module.exports = locationRoute