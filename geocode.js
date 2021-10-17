const express = require('express');
const bodyParser = require('body-parser');
require('dotenv/config');
const ejs = require('ejs');
const https = require('https');
const axios = require('axios').default;

const app = express();

// array to be returned
const arr = [];

app.set('views', 'ejs');
app.use(
    bodyParser.json({
      type: "json"
    })
  );
app.use(express.static("public"));

app.get("/", function(req, res){
   res.redirect("/geocode")
})

app.get("/geocode", function(req, res){
      res.write("<h1>Task 2</h1>");
      res.write("<h3>Please make a post request</h3>");
      res.end();
  })

// having /geocode as an endpoint
app.post("/geocode", function(req, res){
   
    // accessing the address array recieved in the body
   const address = req.body;
   
   //looping through the array to find corresponding geocode
   address.forEach(ad => {
    const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + ad + "&key=" + process.env.API_KEY;
    axios.get(url)
    .then((response) => {
        arr.push({
            add: [ad],
            location: [response.data.results[0].geometry.location]
        })
    })
    // Sending the resultant array
    .then(() => res.send(arr));
   });
})



app.listen(4000, function(){
    console.log("Server is up and running on port 4000");
})