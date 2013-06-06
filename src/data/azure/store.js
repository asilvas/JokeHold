var
    azure = require("azure"),
    async = require("async"),
    config = require("../../config.json")
;

exports.DataStore = DataStore;

function keyToString(str) {
    return new Buffer(str).toString('base64').replace("=", "_").replace("/", "-");
}

function keyFromString(key) {
    return new Buffer(key.replace("_", "=").replace("-", "/"), 'base64').toString('ascii');
}

function DataStore() {
    this.table = azure.createTableService(config.store.options.name, config.store.options.accessKey);
}

var p = DataStore.prototype;

p.onStart = function(cb)
{    
    var me = this;
    
    async.parallel([
        function(cb) { me.table.createTableIfNotExists('user', cb); },
        function(cb) { me.table.createTableIfNotExists('card', cb); },
        function(cb) { me.table.createTableIfNotExists('match', cb); },
        function(cb) { me.table.createTableIfNotExists('vote', cb); }
    ], function(err, results){
        cb();
    });
}

p.initUser = function(cb){
    this.table.createTableIfNotExists('user', cb);
}

p.getOne = function(table, id, cb) {
    this.table.queryEntity(table, id, '1', function(err, result) {
        if (!err) {
            delete result._;
        }
        cb(err, result);
    });
}

p.getAll = function(table, cb) {
    var query = azure.TableQuery
        .select()
        .from(table)
    ;

    this.table.queryEntities(query, function(err, results) {
        if (!err) {
            for (var i = 0; i < results.length; i++) {
                delete results[i]._;
            }
        }
        cb(err, results);
    });
}

p.userGetOrCreateByPassport = function(profile, cb) {
    var me = this;
    this.getOne('user', profile.id, function(err, result) {
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

p.userGet = function(authId, cb) {
    this.getOne('user', keyToString(authId), function(err, result) {
        if (!err) {
            result.PartitionKey = keyFromString(result.PartitionKey);
        }
        cb(err, result);
    });
}

p.userInsert = function(user, cb) {
    user.PartitionKey = keyToString(user.PartitionKey);
    this.table.insertEntity('user', user, cb);
}

p.cardsGetAll = function(cb) {
    this.getAll('card', cb);
}

p.cardsGet = function(id, cb) {
    this.getOne('card', id, cb);
}

p.cardsInsertOrUpdate = function(card, cb) {
    this.table.insertOrUpdateEntity('card', card, cb);
}

p.matchesGetAll = function(cb) {
    this.getAll('match', cb);
}

p.matchesGet = function(id, cb) {
    this.getOne('match', id, cb);
}

p.matchesInsertOrUpdate = function(match, cb) {
    this.table.insertOrUpdateEntity('match', match, cb);
}

p.votesGetAll = function(cb) {
    this.getAll('vote', cb);
}

p.votesGet = function(id, cb) {
    this.getOne('vote', id, cb);
}

p.votesInsertOrUpdate = function(vote, cb) {
    this.table.insertOrUpdateEntity('vote', vote, cb);
}
