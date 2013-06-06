var
    async = require("async"),
    web = require('./web/web'),
    ranks = require('./web/ranks')
;

function run()
{
    if (process.argv.length > 2) {
        process.chdir(process.argv[2]);
    }
    
    async.series([
        initDB, // blocking
        initCache, // blocking
        initRanks, // blocking
        initWeb // blocking
    ], function(err, results) {
        // done
    });
}

function initDB(cb){
    var db = new (require("./data/store").DataStore)();
    db.onStart(cb);
}

function initCache(cb){
    var cache = new (require("./data/cache").DataCache)();
    cache.onStart(cb);
}

function initWeb(cb){
    web.init(cb);
}

function initRanks(cb){
    ranks.init(cb);
}

run();
