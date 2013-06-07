var
    azure = require("azure"),
    async = require("async"),
    config = require("../../config.json"),
    extend = require("extend")
;

var $cache = {
    dict: {},
    root: {}
};

exports.DataCache = DataCache;

function DataCache() {
    this.bus = new azure.ServiceBusService(config.cache.options.connectionString);
    this.subPath = require("os").hostname().split(".").shift();
}

var p = DataCache.prototype;

p.onStart = function(cb)
{    
    var me = this;
    
    async.parallel([
        function(cb) { me.initSubscription(cb); }
    ], function(err, results){
        cb();
    });
};

p.initSubscription = function(cb){
    var me = this;
    this.bus.createSubscription(config.cache.options.topic, this.subPath, { LockDuration: "PT1M0S", DefaultMessageTimeToLive: "PT1M0S" }, function(err, result) {
        console.log("cache.initSub.createSubscription:");
        if (err) {
            console.dir(err);
        } else {
            console.dir(result);
        }
        me.bus.receiveSubscriptionMessage(config.cache.options.topic, me.subPath, { isPeekLock: false }, function(err, result) {
            console.log("cache.msg:");
            if(!err){
                console.dir(result);
                if (result && result.key) {
                    me.set(result.key, result.val);
                }
            }
            else {
                console.dir(err);
            }
    
            cb();
        });
    });
};

/* eventually look into caching the hierchy itself for fast lookups. the
   complexity will come from keeping it consistent. a task for another day.
*/
p.buildCacheFromKey = function(key) {
    var parts = key.split('/');
    if (parts.length === 0) {
        throw "Invalid Key";
    }
    var parent = $cache.root;
    var dir;
    var val = parent[dir];
    if (!val) {
        val = parent[dir] = {};
    }
    
    for (var i = 0; i < parts.length; i++) {
        dir = parts[i];
        var o = parent[dir];
        if (!o) {
            o = parent[dir] = {};
        }
        if (i < (parts.length - 1)) { // if more parts, use this one as parent
            parent = o;
        }
    }

    return { parent: parent, val: val, dir: dir };
};

// super fast gets
p.get = function(key) {
    return $cache.dict[key];
};
p.getAll = function(key) {
    return this.buildCacheFromKey(key).val;
};

p.set = function(key, val) {
    // set is a bit slower so that gets are optimized...
    var o = this.buildCacheFromKey(key);
    if (val && o.val.Timestamp && val.Timestamp && o.val.Timestamp >= val.Timestamp) {
        // do not overwrite if cache is newer
    } else {
        if (val) {
            $cache.dict[key] = val;
        } else {
            delete $cache.dict[key];
        }
        // this way we can replace existing object instead of worrying about merging
        o.parent[o.dir] = val;
    }
    
    // inform the bus of the change
    this.bus.sendTopicMessage(config.cache.options.topic, { key: key, val: val });
};
