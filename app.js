const express = require("express");
const port = 3000;
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(server);
const mongo = require("mongodb").MongoClient;
const jsonParser = express.json();
var ObjectID = require('mongodb').ObjectID;

let dbClient;

mongo.connect('mongodb://localhost:27017',
(err, client) => {
  dbClient = client;
  app.locals.collection = client.db("rooms").collection("game_rooms");
  if (err) {
    console.log('Mongo connection error: ', err)
    throw err
  }
  console.log('Mongo connected')
});



server.listen(port,()=>
{
  console.log("listen on", port);
});
app.use(express.static(path.join(__dirname, 'public')));
app.get("/api/rooms",function(request,responce)
{
  const collection = request.app.locals.collection;
  collection.find({players:{$lt:2}}).toArray(function(err, rooms){
    if(err) return console.log(err);
    responce.send(rooms)});

});
app.post("/api/createRoom", jsonParser,function(request,responce)
{
  const collection = request.app.locals.collection;
  const name = request.body.name;
  const room = {"name":name,"players":0}
  collection.insertOne(room,function(err,result){
    if(err) return console.log(err);
    responce.send(room);
  });
});
app.get("/api/connectRoom",function(request,responce)
{
  
  let id = request.query.id;
  let nickname = request.query.nickname;
  const collection = request.app.locals.collection;
  const prev = collection.find({"_id": ObjectID(id)}).toArray(function(err, results){
    
    if(results[0].players < 2)
    {
      collection.updateOne({"_id": ObjectID(id)},{$inc:{"players":1}});
      responce.redirect("/game.html?id=" + id + "&nickname=" + nickname);
    }
    else
    {
      responce.send("game is full");
    }


  });
  
  
   
});
let frame = {
  player1:{x:0,y:0},
  player2:{x:0,y:0},
  ball:{x:0,y:0}
}
io.on("connection",socket=>
{
  socket.on("room_connect",data=>{
    socket.join(data.id);
    //socket.id
    console.log("new player " + data.nickname + " joined room " + data.id);
  });
  socket.on("room_ready", ready=>
    {if(ready) socket.to().emit("start");}
  );
  console.log("user connected");

  socket.on("keypress",data=>
  {
    //socket.emit("update");
    console.log(data);
  });

})

