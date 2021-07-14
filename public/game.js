document.addEventListener("DOMContentLoaded", function() {
var ctx;
var socket;
var cheight;
var cwidth;
var roomid;
var wait = true;

    
    socket = io();
    let url = new URL(document.URL);
    roomid = url.searchParams.get("id");
    let nickname = url.searchParams.get("nickname")
    let id = roomid;
    socket.emit("room_connect",{id,nickname});
    var canvas = document.getElementById("canvas");
    addEventListener("keypress", function(e)
    {
      socket.emit("keypress",{key:e.keyCode,id:roomid});
    });
    cwidth = canvas.getAttribute("width");
    cheight = canvas.getAttribute("height");
    ctx = canvas.getContext("2d");
   
    
    socket.on("update", data =>
    {
      console.log(data);
      drawField();
      drawPlayer(data.player1.x,data.player1.y);
      drawPlayer(data.player2.x,data.player2.y);
      drawBall(data.ball.x,data.ball.y);
  
    });

function drawPlayer(x,y)
{
  ctx.fillStyle="white";
  ctx.fillRect(x,y,50,150);
}
function drawField()
{
  ctx.fillStyle="black";
  ctx.fillRect(0,0,cwidth,cheight);
}
function drawBall(x,y)
{
  ctx.fillStyle="white";
  ctx.fillRect(x,y,50,50);
}

function render()
{
  
    
  if(wait == true)
  {
    waiting(ctx,0);
  }      
}
function waiting(ctx,n)
{
  
  ctx.fillStyle="white";
  ctx.font = "48px serif";
  var text = "";
  switch(n)
  {
    case 0:
    text = "Waitng for players";
    break;

    case 1:
    text =  "Waitng for players."
    break;

    case 2:
    text ="Waitng for players.."
    break;

    case 3:
    text ="Waitng for players..."
    break;
  }
  ctx.fillText(text, cwidth/4, cheight/2);
    
}

});