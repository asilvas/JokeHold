var
    DataStore = require("./store/store").DataStore,
    db = new DataStore(),
    async = require("async"),
    express = require('express'),
//  home = require('./controller/home'),
//  user = require('./controller/user'),
//  apiV1 = require('./controller/apiV1'),
    http = require('http'),
    path = require('path'),
    routes = require('./routes')
;


var app, server, port, io;


function run()
{
    async.parallel([
        initDB,
        initWeb
    ], function(err, results) {
        // done
    });
}

function initDB(cb){
    db.onStart(cb);
}

function initWeb(cb){
    app = express();
    server = http.createServer(app);
    port = parseInt(process.env.PORT) || 5000;
    io = require('socket.io').listen(server);


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

    app.configure(function () {
        app.set('port', port);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        
        app.use(express.json());
        //app.use(express.urlencoded());
        //app.use(express.multipart());
    
        app.use(express.favicon());
        app.use(express.logger('dev'));
        //app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser('RAWRANDSTUFF99!'));
        app.use(express.session());
        app.use("/res", express.static(path.join(__dirname, 'res')));
    });
    app.configure('development', function () {
        app.use(express.errorHandler());
    });

    routes.init(app);
    
    
    //app.get('/api/v1/:cmd?/:id?', apiV1.all);
    //app.post('/api/v1/:cmd?/:id?', apiV1.all);
    server.listen(port, function () {
        console.log("Listening on ", port, "at", process.env.IP);
    });


    routes.init(app, io);
    
    
}

run();