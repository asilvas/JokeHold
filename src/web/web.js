var
    config = require("../config.json"),
    async = require("async"),
    express = require('express'),
    http = require('http'),
    path = require('path'),
    routes = require('./routes'),
    auth = require('./auth'),
    AzureSessionStore = require('express-session-azure')
;

var app, server, port, io;


exports.init = function() {
    app = express();
    server = http.createServer(app);
    port = parseInt(process.env.PORT) || 5000;
    /*io = require('socket.io').listen(server);


    io.configure('production', function(){
        io.enable('browser client etag');
        io.set('log level', 1);
        
        io.set('transports', [
            'websocket'
            , 'flashsocket'
            , 'htmlfile'
            , 'xhr-polling'
            , 'jsonp-polling'
        ]);
    });

    io.configure('development', function(){
        io.set('transports', [
            'websocket'
            , 'flashsocket'
            , 'htmlfile'
            , 'xhr-polling'
            , 'jsonp-polling'
        ]);
    });
*/
    app.configure(function () {
        //app.set('port', port);
        app.set('views', __dirname + '/../views');
        app.set('view engine', 'ejs');
        
        app.use(express.json());
        app.use(express.urlencoded());
        //app.use(express.multipart());
    
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser('wowsah'));
        app.use(express.session({
        	secret: config.session.secret,
			store: new AzureSessionStore(config.store.options)
		}));
        app.use("/res", express.static(path.join(__dirname, '..', 'res')));
    });
    app.configure('development', function () {
        app.use(express.errorHandler());
    });

    auth.init(app);
    routes.init(app, io);
    
    server.listen(port, process.env.IP, function (err) {        
        console.log("Listening on ", port, "at", process.env.IP);
        if (err) {
            console.log("server.listen.err: " + err);
        }
    });
}
