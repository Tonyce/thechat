var chatInfra = io.connect('/chat_infra')//设置连接通道（通道是我自己的理解）

chatInfra.on("connect", function () {//在此通道上建立连接
    chatInfra.emit("get_rooms", {});//向服务端发送‘get_rooms'事件，激发服务器的get_room并做相应处理
    chatInfra.on("rooms_list", function (rooms) {//响应服务端的‘rooms_list‘事件并接受数据更新ui，
        for(var room in rooms){

             var roomDiv = '<div class="room_div"><span class="room_name">' + room +
                          '</span><span class="room_users">[ ' + rooms[room] + ' Users ] </span>'
                          + '<a class="room" href="/chatroom?room=' + room + '">Join</a></div>';
            $('#rooms_list').append(roomDiv);
        }
    });
});

$(function  () {//创建新的房间，并跳转到新房间中
    $('#new_room_btn').click(function () {
        window.location = '/chatroom?room=' + $("#new_room_name").val();
    });
});