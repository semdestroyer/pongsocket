const express = require("express");
const router = express.Router();


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

module.exports = router;