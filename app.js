const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const ejs = require('ejs');


const app = express();

const arr = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// const deviceSchema = new mongoose.Schema({
//     deviceID: String
// }) 
// const Device = mongoose.model("device", deviceSchema);

// const statusSchema = new mongoose.Schema({
    
// })
// const Status = mongoose.model("status", statusSchema);

app.post("/:params" , function(req, res){
    console.log(req.body.url);
    mongoose.connect(req.body.url);
    


    var deviceSchema = mongoose.Schema;  
    var statusSchema = mongoose.Schema;
    var Device = mongoose.model("Device", new deviceSchema({}), "devices");  
    var Status = mongoose.model("Status", new statusSchema({}), "status");
    
    // Device.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
    //   console.log( post );
    // });
    
    // Device.find(function(e, post){

      // post.forEach(x => {
      //   Status.find({device: x.id}, (err, doc) => {
      //     console.log(doc);
      //   })
      // });


    //   post.forEach(x => {
    //     console.log(post[0].client);
    //     Status.find({device: x.id}, function(err, doc){
    //         for(var i = 0; i < 3; i++){
    //           console.log(doc[i].input);
    //         }
    //     }).sort({ _id: -1 }).limit(3)
    //   })
    // }).sort({ _id: -1 }).limit(1)
    
    Device.find(function(err, post){
      post.forEach(x => {
        Status.find({device: x.id}, function(err, doc){
            doc.forEach(y => {
              console.log(y.gps);
            })
        }).lean().sort({ _id: -1}).limit(3);
      })
    }).lean().sort({ _id: -1 }).limit(1);

});




app.listen(3000, function(){
    console.log("Server is up and running on port 3000");
})