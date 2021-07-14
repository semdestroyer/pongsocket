const io = require("socket.io")(server);
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
  console.log("user connected");
  socket.on("keypress",data=>
  {
    frame = frames.get(data.id);
    if(data.key == 119)
    {
      frame.player1.y += 4;
    }
    if(data.key == 115)
    {
      frame.player1.y -= 4;
    }
    frames.set(data.id,frame);
    //console.log(frames);
    io.to(data.id).emit("update",frame);
          
  });

});