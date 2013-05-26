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

var proto = DataStore.prototype;

DataStore.isInitialized = false;

proto.onStart = function(cb)
{    
    var me = this;
    
    async.parallel([
        function(cb) { me.initUser(cb); }
    ], function(err, results){
        cb();
    });
}

proto.initUser = function(cb){
    var me = this;
    me.table.createTableIfNotExists('user', function(error){
        if(!error){
            // Table exists
            console.log("table 'user' already exists");
        }
        else {
            console.log("table 'user' created");
        }

        cb();
    });
}

proto.getUsers = function(cb) {
    var query = azure.TableQuery
            .select()
            .from('user')
            //.where('PartitionKey eq ?', 'hometasks')
        ;

    this.table.queryEntities(query, function(err, results) {
        cb(err, results);
    });
}