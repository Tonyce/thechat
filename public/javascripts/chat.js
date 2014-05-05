var chatInfra = io.connect("/chat_infra");//设置系统消息通道
var chatCom   = io.connect("/chat_com");//设置聊天通道

// var roomName = decodeURL((RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
var roomName = decodeURI((RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);

    if (roomName) {
        // chatInfra.emit('join_room', {'room': roomName});
        chatInfra.emit('join_room', {'name':roomName});//发送jion_room请求并将roomName发送给服务端
        
        chatInfra.on("name_set", function (data) {//监听该通道上服务端传来的{emit（name_set..)并接受参数

            chatInfra.on("user_entered", function (user) {//监听emit(user_entered..)
                $('#messages').append('<div class = "systemMessage">' 
                                        + user.name + 'has joined the room' + '</div>');
            });

            chatInfra.on('message', function (message) {//接收chatInfra“通道"下得send消息
                var message = JSON.parse(message);
                $('#messages').append('<div class = " '+ message.type +' " >' 
                                       + message.message + '</div>');
            });

            chatCom.on('message', function (message) {//接收chatCom下的send消息
                var message = JSON.parse(message);
                $('#messages').append('<div class = " ' + message.type +' "><span class = "name">'
                                        + message.username + ':</span>' 
                                        + message.message + '</div>');
            });

            $('#nameform').hide();
            $('#messages').append('<div class = "systemMessage">Hello' + data.name + '</div>');

            $('#send').click(function () {
                var data = {
                    message: $('#message').val(),
                    type: 'userMessage'
                };
                chatCom.send(JSON.stringify(data));
                $('#message').val('');
            });
        });
    }

$(function () {
    $('#setname').click(function () {
        chatInfra.emit("set_name", {name: $('#nickname').val()});// 在此通道上发送set_name事件
    });
});


