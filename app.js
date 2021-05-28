const express = require("express");
const port = 3001;
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(server);
const mongoClient = require("mongodb").MongoClient;
server.listen(port,()=>
{
  console.log("listen on", port);
});
app.use(express.static(path.join(__dirname, 'public')));
app.post("/api/createRoom",function(request,responce)
{
  
});
app.post("/api/connectRoom",function(request,responce)
{
  
});
io.on("connection",socket=>
{
  console.log("user connected");

  socket.on("update",data=>
  {
    
  });
  socket.on("keyup",data=>
  {
    console.log(data);
  });
  socket.on("keydown",data=>
  {
    console.log(data);
  });
})

