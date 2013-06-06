var
    DataStore = require('../store').DataStore,
    cache = new (require('../cache').DataCache),
    async = require('async')
;

exports.cardsGet = function(id, cb) {
    this._get("cards", id, cb);
}

exports.cardsGetMany = function(ids, cb) {
    this._getMany("cards", ids, cb);
}

exports.cardsGetAll = function(cb) {
    this._getAll("cards", cb);
}

exports.cardsInsertOrUpdate = function(obj, cb) {
    this._insertOrUpdate("cards", obj, cb);
}

exports.matchesGet = function(id, cb) {
    this._get("matches", id, cb);
}

exports.matchesGetMany = function(ids, cb) {
    this._getMany("matches", ids, cb);
}

exports.matchesGetAll = function(cb) {
    this._getAll("matches", cb);
}

exports.matchesInsertOrUpdate = function(obj, cb) {
    this._insertOrUpdate("matches", obj, cb);
}

exports.votesGet = function(id, cb) {
    this._get("votes", id, cb);
}

exports.votesGetMany = function(ids, cb) {
    this._getMany("votes", ids, cb);
}

exports.votesGetAll = function(cb) {
    this._getAll("votes", cb);
}

exports.votesInsertOrUpdate = function(obj, cb) {
    this._insertOrUpdate("votes", obj, cb);
}

exports._getAll = function(container, cb) {
    cb(null, cache.getAll(container));
}

exports._getAllFromStore = function(container, cb) {
    var db = new DataStore();
    db[container + "GetAll"](function(err, results) {
        if (!err) {
            // update cache
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                cache.set(container + "/" + result.PartitionKey, result);
            }
        }
        cb(err, results);
    });
}

exports._get = function(container, id, cb) {
    var o = cache.get(container + "/" + id);
    if (o) { // fast and furious
        cb(null, o);
    } else { // lets fetch and store
        var db = new DataStore();
        db[container + "Get"](id, function(err, result) {
            if (!err) {
                // update cache
                cache.set(container + "/" + id, result);
            }
            cb(err, result);
        });
    }
}

exports._getMany = function(container, ids, cb) {
    var results = new Array(ids.length);
    var cbs = new Array(ids.length);
    
    for (var i = 0; i < results.length; i++) {
        // generate callback to wrap input params
        cbs[i] = (function(idx, id) {
            return function(asyncCb) {
                exports._get(container, id, function(err, result) {
                    results[idx] = result;
                    asyncCb(err, result);                    
                });
            };
        })(i, ids[i]);
    }

    async.parallel(cbs, function(err, res){
        cb(err, results);
    });
}

exports._insertOrUpdate = function(container, obj, cb) {
    var db = new DataStore();
    db[container + "InsertOrUpdate"](obj, function(err, result){
        if (!err) {
            // update cache
            cache.set(container + "/" + result.PartitionKey, obj);
        }
        cb(err, result);
    });
}