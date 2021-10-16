const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const ejs = require('ejs');


const app = express();



var obj = {};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));



app.post("/:params" , function(req, res){
    
    // mongo url in body
    // status to be passed as query
    
    console.log(req.body.url);
    mongoose.connect(req.body.url);
    


    var deviceSchema = mongoose.Schema;  
    var statusSchema = mongoose.Schema;
    var Device = mongoose.model("Device", new deviceSchema({}), "devices");  
    var Status = mongoose.model("Status", new statusSchema({}), "status");
    
    
    
    Device.find(function(err, posts){
      posts.forEach(post => {
        obj[post.id] = [];
        Status.find({device: post.id}, function(err, docs){
            docs.forEach(doc => {
              obj[post.id].push(doc.gps);
            })
            console.log(obj);
        }).lean().sort({ _id: -1}).limit(50);
      })
    }).lean().sort({ _id: -1 }).limit(30);
});








app.listen(3000, function(){
    console.log("Server is up and running on port 3000");
})