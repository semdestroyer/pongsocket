//import "../objects/player";
//import "../objects/ball";


var ctx;
var socket;
var cheight;
var cwidth;
var roomid;
var wait = true;
function init()
{  

    socket = io();
    let url = new URL(document.URL);
    roomid = url.searchParams.get("id");
    let nickname = url.searchParams.get("nickname")
    let id = roomid;
    socket.emit("room_connect",{id,nickname});
    var canvas = document.getElementById("canvas");
    cwidth = canvas.getAttribute("width");
    cheight = canvas.getAttribute("height");
    ctx = canvas.getContext("2d");
    window.requestAnimationFrame(render);
}
function render()
{
  ctx.fillStyle="black";
  ctx.fillRect(0,0,cwidth,cheight);
  socket.on("update", data =>
  {
    wait = false;
    ctx.fillStyle="white";
    ctx.fillRect(data.ball.x,data.ball.y,50,50);
    ctx.fillStyle="white";
    ctx.fillRect(data.player1.x,data.player1.y,50,150);
    ctx.fillStyle="white";
    ctx.fillRect(data.player2.x,data.player2.y,50,150);
    return
  });
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
addEventListener("keypress",function(e)
{
  socket.emit("keypress",{key:e.keyCode,id:roomid});
});