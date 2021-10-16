const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const ejs = require('ejs');
const https = require('https');



const app = express();


var obj = {};



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));



app.post("/:params" , function(req, res, next){
    
    // mongo url in body
    // status to be passed as query
    
    
    console.log(req.body.url);
    mongoose.connect(req.body.url);
    


    var deviceSchema = mongoose.Schema;  
    var statusSchema = mongoose.Schema;
    var Device = mongoose.model("Device", new deviceSchema({}), "devices");  
    var Status = mongoose.model("Status", new statusSchema({}), "status");
    
  
    
      Device.find({}).lean().sort({ _id: -1 }).limit(30).exec((err, posts) => {
          posts.forEach(post => {
            obj[post.id] = [];
            Status.find({device: post.id}).lean().sort({ _id: -1}).limit(50).exec((err, docs) => {
             docs.forEach(doc => {
               obj[post.id].push(doc.gps);
             })
            })
          })
        })
      
        // wait 30 seconds for result object to get filled 
      setTimeout(() => {
         res.send(obj);
      }, 30000)
    }
  )
  
        



app.listen(3000, function(){
    console.log("Server is up and running on port 3000");
})