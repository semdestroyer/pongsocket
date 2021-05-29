const express = require("express");
const port = 3001;
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(server);
const mongo = require("mongodb").MongoClient;
const jsonParser = express.json();


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
  collection.find({}).toArray(function(err, rooms){
    if(err) return console.log(err);
    responce.send(rooms)});

});
app.post("/api/createRoom", jsonParser,function(request,responce)
{
  const collection = request.app.locals.collection
  const name = request.body.name;
  const room = {"name":name,players:0}
  collection.insertOne(room,function(err,result){
    if(err) return console.log(err);
    responce.send(room);
  });
});
app.get("/api/connectRoom",function(request,responce)
{
  responce.redirect("/game.html");
});
io.on("connection",socket=>
{
  socket.on("room_connect",id=>{
    socket.join(id);
    
    

  }
  );
  
  
  console.log("user connected");

  socket.on("keypress",data=>
  {
    socket.emit("update");
  });

})

