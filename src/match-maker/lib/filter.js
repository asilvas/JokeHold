exports.fromString = fromString;
exports.toString = toString;
exports.matchExact = matchExact;
exports.matchAny = matchAny;


function fromString(str) {
    if (typeof str !== 'string') {
        return str;
    }
    var strs = str.split(",");
    var filter = {};
    for (var s in strs) {
        filter[s] = true;
    }
    return filter;
}

function toString(filter, ignoreNegatives) {
    var arr = [], k;
    if (ignoreNegatives === true) {
        for (k in filter) {
            if (k[0] === "!") {
                continue; // ignore negatives
            }
            arr.push(k);        
        }
    } else {
        for (k in filter) {
            arr.push(k);        
        }
    }
    
    return arr.join(",");
}

// pretty inefficient right now, should be able to optimize considerably
// in the future.
function matchExact(filter1, filter2)
{
    filter1 = fromString(filter1);
    filter2 = fromString(filter2);
    for (var f1 in filter1) {
        if (f1[0] == "!") { // negative filter
            if (f1.substr(1) in filter2) {
                return false; // if negative condition found, not a match
            }
        } else {
            if ((f1 in filter2) === false) {
                return false; // not found, not a match
            }
        }
    }
    for (var f2 in filter2) {
        if (f2[0] == "!") { // negative filter
            if (f2.substr(1) in filter1) {
                return false; // if negative condition found, not a match
            }
        } else {
            if ((f2 in filter1) === false) {
                return false; // not found, not a match
            }
        }
    }

    return true;
}

function matchAny(filter1, filter2) {
    filter1 = fromString(filter1);
    filter2 = fromString(filter2);
    for (var f1 in filter1) {
        if (f1[0] == "!") { // negative filter
            if (f1.substr(1) in filter2) {
                return false; // if negative condition found, not a match
            }
        } else {
            if ((f1 in filter2) === true) {
                return true; // found, partial match
            }
        }
    }

    return false;
}