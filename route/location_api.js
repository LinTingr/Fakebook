const express = require("express");
const axios = require("axios");
const locationRouter = express.Router()
require("dotenv").config();
const googleAPIkey = process.env.googleAPIkey;
locationRouter.use(express.json()); 

locationRouter.get("/", async(req, res)=>{
    try{
        let place = req.query.keyword
        let searchlocation = []
        const config = {
            method: "get",
            url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&key=${googleAPIkey}`
        };
        await axios(config)
        .then(function (response) {
            const results = response.data.results
            if(results[0]){
                for(let i = 0; i < results.length; i++){
                    let locationData = {
                        name : results[i].name,
                        address : results[i].formatted_address
                    }
                    searchlocation.push(locationData)
                }
            }
        })
        .catch(function (error) {
        console.log(error);
        })
        if(searchlocation[0]){
            let data = {
                locationData : searchlocation,
            }
            res.status(200).json(data)
        }
    }catch{
        data = {
            "error":true,
            "message":"伺服器錯誤"
        }
        res.status(500).json(data)
    }
})

module.exports = locationRouter