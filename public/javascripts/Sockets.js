exports.OnConnectChat = function (socket) {
    socket.emit('sayHello', {info:'Hello'});
    socket.on('sendinfo',function (data) {
        console.log(data);
    });
};

exports.OnConnectRoom = function (socket) {
    socket.join('BTRDnmRSifcrZYt9C2gESe');
    socket.request.session.idRoom = 'BTRDnmRSifcrZYt9C2gESe';
    socket.on('sendinfo',function (data) {
        console.log(data);
    });
    socket.on('sayHello',function (data) {
        console.log('Hola');
    });
};