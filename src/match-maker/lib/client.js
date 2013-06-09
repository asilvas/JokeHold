var
    async = require("async"),
    dateformat = require("dateformat")
;

module.exports = MatchClient;

function MatchClient() {
}

var p = MatchClient.prototype;

/* IMPLEMENT METHODS: BEGIN */

p.getNewID = function(now) {
    now = now || new Date();
    return dateformat(now, "isoDateTime");
};

p.getAll = function(key, cb) {
    throw "Not implemented";
};

p.get = function(key, id, cb) {
    throw "Not implemented";
};

p.findNext = function(key, id, count, cb) {
    throw "Not implemented";
};

p.insertOrUpdate = function(key, obj, cb) {
    throw "Not implemented";
};

/* IMPLEMENT METHODS: END */

p._getManyCb = function(key, results, idx, id) {
    var me = this;
    return function(asyncCb) {
        me.get(key, id, function(err, result) {
            results[idx] = result;
            asyncCb(err, result);                    
        });
    };
};

p.getMany = function(key, ids, cb) {
    var results = new Array(ids.length);
    var cbs = new Array(ids.length);
    
    for (var i = 0; i < results.length; i++) {
        // generate callback to wrap input params
        cbs[i] = this._getManyCb(key, results, i, ids[i]);
    }

    async.parallel(cbs, function(err, res){
        cb(err, results);
    });
};

p.matchFindBest = require('./match').matchFindBest;
