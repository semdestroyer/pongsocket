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
  roomId:null,
  player1:{x:0,y:0},
  player2:{x:0,y:0},
  ball:{x:0,y:0}
}
let frames = new Map();
io.on("connection",socket=>
{
  socket.on("room_connect",data=>{
    socket.join(data.id);
    
    console.log("new player " + data.nickname + " joined room " + data.id);
    if(io.sockets.adapter.rooms[data.id].length == 2)
    {
      frame = {player1:{x:100,y:100},player2:{x:600,y:100},ball:{x:350,y:150}};
      roomid = data.id
      frames.set(roomid,frame);
      socket.to(data.id).emit("update",frame);
    }
  });
  /*
  socket.on("update", data=>
  {
    frame = {player1:{x:200,y:200},player2:{x:600,y:200},ball:{x:400,y:200}};
      if(ready) socket.to(data.id).emit(frame);
  })*/
  console.log("user connected");
  socket.on("keypress",data=>
  {
    
    frame = frames.get(data.id);
   // console.log(frames);
    frame.player1.y += 10;
    frames.set(roomid,frame);
    socket.to(data.id).emit("update",frame);        
  });

})

