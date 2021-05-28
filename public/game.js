//import "../objects/player";
//import "../objects/ball";
var frameNumber = 0;
var n = 0;
var ctx;
var socket;
var cheight;
var cwidth;
function init()
{  
     socket = io();
  
    /*socket.connect("connect",()=>{
      socket.send(name);  
    });*/
    var canvas = document.getElementById("canvas");
    cwidth = canvas.getAttribute("width");
    cheight = canvas.getAttribute("height");
    ctx = canvas.getContext("2d");
    //setInterval(render(ctx),10);
    window.requestAnimationFrame(render);
}
function render()
{
  ctx.fillStyle="black";
  ctx.fillRect(0,0,cwidth,cheight);
  socket.on("update", data =>
  {
    ctx.fillStyle="white";
    ctx.fillRect(500,100,50,50);
    ctx.fillStyle="white";
    ctx.fillRect(10,10,50,150);
    ctx.fillStyle="white";
    ctx.fillRect(600,40,50,150);
    
  })      
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
  ctx.fillText(text, 400, 200);
    
}
addEventListener("keypress",function(e)
{
  socket.emit("keydown",e.keyCode);
});