const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const ejs = require('ejs');

const app = express();

// object to sent
var obj = {};

app.set('views', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res){
  res.send("<h1>Please enter parameter and query</h1>")
})

app.get("/:params", function(req, res){
  if((req.params.params === "devices") && (req.query.query === "status")){
    res.write("<h1>Task 1</h1>");
    res.write("<h3>Please make a post request</h3>");
    res.end();
  }
  else{
    res.send("Please enter correct parameter and query");
  }
})

app.post("/:params" , function(req, res, next){
    
    // mongo url in body
    // status to be passed as query
    console.log(req.params);
    console.log(req.query);

    // checking if the user entered correct params and query
  if((req.params.params === "devices") && (req.query.query === "status")){

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
)
  
        
app.listen(3000, function(){
    console.log("Server is up and running on port 3000");
})