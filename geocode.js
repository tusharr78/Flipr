const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const ejs = require('ejs');
const https = require('https');
const axios = require('axios').default;
const { stringify } = require('querystring');


const app = express();
const arr = [];

app.set('view engine', 'ejs');
app.use(
    bodyParser.json({
      type: "json"
    })
  );
app.use(express.static("public"));



// const url = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=" + process.env.API_KEY;

app.post("/geocode", function(req, res){
    
   let address = req.body;

   address.forEach(ad => {
    const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + ad + "&key=" + process.env.API_KEY;
    axios.get(url)
    .then((response) => {
        arr.push({
            add: [ad],
            location: [response.data.results[0].geometry.location]
        })
    })
    .then(() => console.log(arr[0]));
   });
    
})



app.listen(4000, function(){
    console.log("Server is up and running on port 4000");
})