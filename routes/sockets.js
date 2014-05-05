var io = require('socket.io');

exports.initialize = function  (server) {
	io = io.listen(server);

    io.set('authorization', function (data, accept) {
    // check if there's a cookie header
        if (data.headers.cookie) {
          // if there is, parse the cookie
            data.cookie = require('cookie').parse(data.headers.cookie);
            data.sessionID = data.cookie['express.sid'].split('.')[0];
            data.nickname = data.cookie['nickname'];

        } else {
            // if there isn't, turn down the connection with a message
            // and leave the function.
            return accept('No cookie transmitted.', false);
        }
        // accept the incoming connection
        accept(null, true);
    });

    var self = this;

    this.chatInfra = io.of("/chat_infra");//设置通道
    //连接时用来设系统消息：欢迎登陆消息 设置加入者昵称
    this.chatInfra.on("connection", function (socket) {//在该通道上建立连接
       
            socket.on("join_room", function (room) {//响应jion_room事件
                var nickname = socket.handshake.nickname;//在cookie中获得名字
                socket.set('nickname', nickname, function () {//设置nickname
                    socket.emit('name_set', {'name': socket.handshake.nickname});//发送name_set事件，并携带nickname参数
                    //发送消息，由客户端的on(message ..)接受
                    socket.send(JSON.stringify({type:'serverMessage',
                      message:'Welcome to the most interesting ' +
                          'chat room on earth!'}));
                    socket.join(room.name);//使该通道加入这个房间
                    var comSocket = self.chatCom.sockets[socket.id];//获取chatCom的通道
                    comSocket.join(room.name);//将chatCom加入此房间
                    comSocket.room = room.name;

                    //在这个房间里进行广播
                    socket.in(room.name).broadcast.emit('user_entered', {'name':nickname});
                  });
            });


        socket.on("get_rooms", function(){//获取房间
            var rooms = {};
            for(var room in io.sockets.manager.rooms){//遍历检索房间
                console.log("rooooooooooom:"+room);
                if(room.indexOf("/chat_infra/") == 0){
                    console.log("==========================")
                    var roomName = room.replace("/chat_infra/", "");
                    rooms[roomName] = io.sockets.manager.rooms[room].length;//获取room
                }
            }
            socket.emit("rooms_list", rooms);
        });

    });

    
    this.chatCom = io.of("/chat_com");
    this.chatCom.on("connection", function (socket) {
        socket.on("message", function (message) {
            message = JSON.parse(message);
            if (message.type = "userMessage") {
                socket.get("nickname", function (err, nickname) {
                    message.username = nickname;
                    //在该房间里向自己以外的用户传递消息
                    // socket.broadcast.send(JSON.stringify(message));
                    socket.in(socket.room).broadcast.send(JSON.stringify(message));
                    message.type = "myMessage",//改变type向自己窗口发消息
                    // socket.send(JSON.stringify(message));
                    socket.in(socket.room).send(JSON.stringify(message));
                });
            }
        });
    });
}

