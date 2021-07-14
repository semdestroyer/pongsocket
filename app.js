const express = require("express");
const port = 3000;
const app = express();
const server = require("http").createServer(app);
const path = require("path");

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

  
let frame = {
  roomId:null,
  player1:{x:0,y:0,socketid:null},
  player2:{x:0,y:0,socketid:null},
  ball:{x:0,y:0,direction:0}
  
}
let frames = new Map();

