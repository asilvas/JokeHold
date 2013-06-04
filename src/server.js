var
    async = require("async"),
    web = require('./web/web')
;

function run()
{
    if (process.argv.length > 2) {
        process.chdir(process.argv[2]);
    }
    
    async.series([
        initDB, // blocking
        initWeb
    ], function(err, results) {
        // done
    });
}

function initDB(cb){
    var db = new (require("./data/store").DataStore)();
    db.onStart(cb);
}

function initWeb(cb){
    web.init(cb);
}

run();
