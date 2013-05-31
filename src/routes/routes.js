var
    home = require('../controllers/home'),
    user = require('../controllers/user')
;

exports.init = function(app, io) {
    app.get('/', home.index);

    app.get('/user/login', user.login);
	app.get('/user/logout', user.logout);

    io.sockets.on('connection', function (socket) {
      socket.on('ping', function (data) {
        console.log("RCV: ", data);
        socket.emit('pong', { pong: 'PONG!' });
      });
    });
    
}