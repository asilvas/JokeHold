
exports.matchFindBest = function(req, user, cb) {
    // user starting with matches 1-day old, unless the user has matched
    // newer than that.
    var last = this.getNewID((new Date() - 24*60*60));
    if (user.matchLast && user.matchLast > last) {
        last = user.matchLast;
    }

    var me = this;
    this.findNext("match", last, 25, function(err, results) {
        if (err) { // oops!
            cb(err);
            return;
        }
        if (results.length === 0) {
            cb("No appropriate match found");
            return;
        }

        // auto-set in case no other match is found
        last = results[results.length - 1].id;

        var user_matches = filterMatchByUser(user, results);

        user.matchLast = last;
        // no luck yet, keep looking
        me.matchFindBest(req, user, cb);
    });
};

function filterMatchByUser(user, matches) {
    // filter by match.properties and user.matchFilters
    
    // how should we be caching the filter/properties?
    
    
}