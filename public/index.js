function createRoom()
{
    var textfield = document.getElementById("roomname");
    roomname = textfield.value;
    var body = {"name":roomname}
    $.ajax({
        type:"POST",
        url:"/api/createRoom",
        data:JSON.stringify(body),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {}
        
    });
    getRooms();
}
function connectRoom()
{
    id = document.getElementById("rooms").value;
    nickname = document.getElementById("nickname").value;
    document.location.href = "/api/connectRoom?id=" + id + "&nickname=" + nickname;
}
function getRooms()
{
    const sel = document.getElementById("rooms");
    sel.innerHTML = "";
    $.ajax({
        type:"GET",
        url:"/api/rooms",
        success: function (data) {
            data.forEach(function(elem){
                sel.innerHTML += "<option value =" + elem._id + ">" + elem.name + "</option>";
            });
            
        }
    });
    
}
