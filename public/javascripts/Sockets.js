exports.OnConnectChat = function (socket) {
    socket.emit('sayHello', {info:'Hello'});
    socket.on('sendinfo',function (data) {
        console.log(data);
    });
};

exports.OnConnectRoom = function (socket) {
    socket.emit('sayHello', {info:'Room'});
    socket.on('sendinfo',function (data) {
        console.log(data);
    });
};