var
    config = require("../config.json")
;

exports.DataCache = require("./" + config.cache.driver + "/cache").DataCache;
