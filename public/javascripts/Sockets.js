exports.OnConnectChat = function (socket) {
    socket.emit('sayHello', {info:'Hello'});
    socket.on('sendinfo',function (data) {
        console.log(data);
    });
};