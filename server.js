var
    DataStore = require("./store/store").DataStore,
    async = require("async")
;

var db = new DataStore();

function run()
{
    async.parallel([
        initDB
    ], function(err, results) {
        // done
    });
}

function initDB(cb){
    db.onStart(cb);
}

run();