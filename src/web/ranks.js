var
    async = require("async"),
    config = require('../config.json'),
    data = require('../data/client')
;

var rankthis;

exports.init = function(cb) {
    rankthis = new RankThis(cb);
};

function RankThis(cb) {
    this.init(cb);
}

var p = RankThis.prototype;

p.init = function(cb) {
    var me = this;
    async.parallel([
        function(cb) { data.ranks._getAllFromStore("cards", cb); },
        function(cb) { data.ranks._getAllFromStore("matches", cb); },
        function(cb) { data.ranks._getAllFromStore("votes", cb); }
    ], function(err, results){
        // don't care about the results, just pre-populating our cache before initialization is complete
        cb();
        
        me.initTasks();
    });
};

p.initTasks = function() {
    this.cardsTimer = setInterval(this.cardsCallback, 55000);
    this.matchesTimer = setInterval(this.matchesCallback, 65000);
};

p.cardsCallback = function() {
    data.ranks.cardsGetUpdates();
};

p.matchesCallback = function() {
    data.ranks.matchesGetUpdates();
};
