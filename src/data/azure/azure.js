var
    azure = require("azure"),
    async = require("async"),
    config = require("../../config.json")
;

exports.DataStore = DataStore;

function keyToString(str) {
    return new Buffer("Hello World").toString('base64').replace("=", "_");
}

function keyFromString(key) {
    return new Buffer(key.replace("_", "="), 'base64').toString('ascii');
}

function DataStore() {
    this.table = azure.createTableService(config.store.azure.name, config.store.azure.accessKey);
}

var p = DataStore.prototype;

p.onStart = function(cb)
{    
    var me = this;
    
    async.parallel([
        function(cb) { me.initUser(cb); }
    ], function(err, results){
        cb();
    });
}

p.initUser = function(cb){
    var me = this;
    me.table.createTableIfNotExists('user', function(err){
        if(!err){
            //console.log("table 'user' already exists");
        }
        else {
            console.log("table 'user' created");
        }

        cb();
    });
}

p.userGetOrCreateByPassport = function(profile, cb) {
    var me = this;
    this.userGetByAuth(profile.id, function(err, result) {
        if (err) {
            // auto-create user & auth
            result = {
                PartitionKey: profile.id,
                RowKey: '1',
                name: JSON.stringify(profile.name),
                displayName: profile.displayName,
                authProvider: profile.provider,
                userType: "guest",
                emails: JSON.stringify(profile.emails)
            }

            me.userInsert(result, cb);
        } else {
            delete result._;
            if (result.name) {
                result.name = JSON.parse(result.name);
            }
            if (result.emails && result.emails.indexOf('[') == 0) {
                result.emails = JSON.parse(result.emails);
            }
            cb(null, result);
        }
    });
}

p.userGetByAuth = function(authId, cb) {
    this.table.queryEntity('user', keyToString(authId), '1', function(err, result) {
        if (!err) {
            delete result._;
            result.PartitionKey = keyFromString(result.PartitionKey);
        }
        cb(err, result);
    });
}

p.userInsert = function(user, cb) {
    user.PartitionKey = keyToString(user.PartitionKey);
    this.table.insertEntity('user', user, cb);
}

