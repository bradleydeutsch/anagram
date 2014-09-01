var io = require('socket.io');

function init() {
    socket = io.listen(8000);

    socket.configure(function () {
        socket.set('transports', ['websocket']);
        socket.set('log level', 2);
    });

    setEventHandlers();
}
var setEventHandlers = function () {
    socket.sockets.on('connection', onSocketConnection);
};

var onSocketConnection = function (client) {
    var game;

    util.log('Player connected: ' + client.id);
};

init();