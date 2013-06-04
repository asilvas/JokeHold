var
    azure = require("azure"),
    async = require("async"),
    config = require("../../config.json")
;

exports.DataStore = DataStore;

function DataStore() {
    if (!DataStore.isInitialized) {
        DataStore.isInitialized = true;
        
        // azure lib uses env vars instead...
        process.env.AZURE_STORAGE_ACCOUNT = config.store.azure.name;
        process.env.AZURE_STORAGE_ACCESS_KEY = config.store.azure.accessKey;
    }
    
    this.table = azure.createTableService();
}

var p = DataStore.prototype;

DataStore.isInitialized = false;

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
                name: profile.name,
                displayName: profile.displayName,
                authProvider: profile.provider,
                userType: "guest",
                emails: JSON.stringify(profile.emails)
            }

            me.userInsert(result, cb);
        } else {
            if (result.emails && result.emails.indexOf('[') == 0) {
                result.emails = JSON.parse(result.emails);
            }
            cb(null, result);
        }
    });
}

p.userGetByAuth = function(authId, cb) {
    this.table.queryEntity('user', authId, '1', cb);
}

p.userInsert = function(user, cb) {
    this.table.insertEntity('user', user, cb);
}

