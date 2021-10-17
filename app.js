const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const ejs = require('ejs');
const https = require('https');
const axios = require('axios').default;

const app = express();

app.set('views', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(
  bodyParser.json({
    type: "json"
  })
);



// TASK 2
// GEOCODE
app.route("/")
.get(function(req, res){
  res.write("<h1>Task 2 - Geocode</h1>")
  res.write("<h2>Make a post request with a JSON array</h2>")
  res.write("<h2>For Task 1, enter valid param and query</h2>")
})
.post(function(req, res){

  // array to be returned
  const arr = [];
   
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
});





// TASK 1 
// GETTING DEVICES AND STATUS
app.route("/:params")
.get(function(req, res){
  if((req.params.params === "devices") && (req.query.query === "status")){
    res.write("<h1>Task 1</h1>");
    res.write("<h3>Please make a post request</h3>");
    res.end();
  }
  else{
    res.send("Please enter correct parameter and query");
  }
})
.post(function(req, res){

    // mongo url in body
    // status to be passed as query

    // checking if the user entered correct params and query
  if((req.params.params === "devices") && (req.query.query === "status")){

    // object to be sent
    var obj = {};
    

    // connecting to the mongo server
    mongoose.connect(req.body.url);
    
    // connecting to the collections via mongoose
    var deviceSchema = mongoose.Schema;  
    var statusSchema = mongoose.Schema;
    var Device = mongoose.model("Device", new deviceSchema({}), "devices");  
    var Status = mongoose.model("Status", new statusSchema({}), "status");
    
    // finding all the devices
    Device.find({}).lean().sort({ _id: -1 }).limit(30).exec((err, posts) => {
      posts.forEach(post => {
        obj[post.id] = [];
        // finding corresponding statuses for all the devices 
        Status.find({device: post.id}).lean().sort({ _id: -1}).limit(50).exec((err, docs) => {
            docs.forEach(doc => {
              obj[post.id].push(doc.gps);
            })
            obj[post.id].reverse();
          })
      })
    })
    
    // setting headers
    res.set('Name', 'Tushar Nagar');
    res.set('Contact', 'tusharnagar7800@gmail.com');

    // wait 20 seconds for result object to get filled 
    setTimeout(() => {
        res.send(obj);
      }, 20000)
    }
    else{
      res.send("Invalid parameter or query");
    }
  }
);

  
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

        
app.listen(port, function(){
    console.log("Server started successfully");
})
