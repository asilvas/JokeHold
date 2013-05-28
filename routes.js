var
    home = require('./controllers/home')
;

exports.init = function(app, io) {
    
    app.get('/', home.index);

    io.sockets.on('connection', function (socket) {
      socket.on('ping', function (data) {
        console.log("RCV: ", data);
        socket.emit('pong', { pong: 'PONG!' });
      });
    });
    
}