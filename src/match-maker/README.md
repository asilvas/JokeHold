MatchClient
===========

In order for the client library to function, you must override the four
prototype methods. Supported tables (key) include 'card', 'match', 'vote', and
'user'. The 'user' table only needs to support 'get' and 'insertOrUpdate'.
Try to avoid using switch statements if possible to avoid wasted cycles; 'key'
will only ever be one of those 4 tables.
Example:

    var mmclient = require("match-maker/client");

    mmclient.prototype.getAll = function(key, cb) {
        throw "Not implemented";
    };
    
    mmclient.prototype.get = function(key, id, cb) {
        throw "Not implemented";
    };
    
    mmclient.prototype.findNext = function(key, id, count, cb) {
        throw "Not implemented";
    };
    
    mmclient.prototype.insertOrUpdate = function(key, obj, cb) {
        throw "Not implemented";
    };





card
====
* id (string) - lexical time-based identifier, for fast searches.
    ex: 2001-10-26T19:32:52Z
* userId (string) - user identifier, whatever that may be. no knowledge of users otherwise
* properties (string) - a common-delimited list of properties associated with a
    given card. For matching purposes, only cards with matching properties
    will ever be paired with one another. Typically speaking, a card will only
    have one property. But more complex scenarios are permitted. Negative
    properties (ex: !offensive) are allowed as well to further refine match
    criteries.
* content (string) - ignored by match-maker. Only the app has any understanding
    of what to do with content. Typically JSON, but can be anything so long
    as it is in string format.
* rating (int) - effective rating of the user, where 1500 is average.
* rank (float) - rank from 0 (0%) to 1.0 (100%). Rank is specific to other
    cards in the same "category" based on their properties. No sense ranking
    against cards that they cannot be matched against.
* matches (int) - number of completed matches.



match
=====
* id (string) - lexical time-based identifier, for fast searches.
    ex: 2001-10-26T19:32:52Z
* cards (string) - comma-delimited list of competing card id's. Typically only
    two cards will be matched against one-another, but it is possible to do
    more.
* properties (string) - a comma-delimited list of properties associated with a
    a match. Typically only identical card.properties will result in a match,
    however negative properties can be the exception.
    Ex:
        card1.properties = "funny,!offensive"
        card2.properties = "funny"
        match.properties = "funny"
    Notice that the match was still made, but the negative properties do not
    carry over.
* votes (int) - number of votes casted so far.



vote
====
* id (string) - match.id and userId concenated. This allows fast lookups
    to prevent duplicate votes, as well as still be time-base searchable.
    ex: 2001-10-26T19:32:52Z_someuserid
matchId (string) - id of the match voted on.
userId (string) - id of the user casting the vote.
voteIndex (int) - 0-based index of the match.cards which was voted on. -1 is
    reserved for abstaining. The ability to abstain is up to the App.



user
====
* id (string) - format is determined by external system. all match-maker knows
    (or cares about) is it is a string.
* matchFilters (string) - this is the few fields of a user that is defined by
    match-maker. This is a comma-delimited list of *allowed* match.properties.
    What the properties are, is entirely up to the app and users preferences.
    Ex: clean,offensive,dirty
    Additionally, negative conditions are permitted as well, if you wish to
    detect for properties NOT allowed.
    Ex: !dirty,!offensive
* matchLast (string) - id of last match. always move forward
* matchOffRating (int) - effective rating of the user, where 1500 is average.
* matchOffRank (float) - rank from 0 (0%) to 1.0 (100%).
* matchOffWins (int) - number of successful (won) matches.
* matchOffCount (int) - number of completed matches.
    matchOff relates to "offensive" matches, or in other words, matches that
    the user has participated in by voting on other user matches.
* matchDefRating (int) - effective rating of the user, where 1500 is average.
* matchDefRank (float) - rank from 0 (0%) to 1.0 (100%).
* matchDefWins (int) - number of successful (won) matches.
* matchDefCount (int) - number of completed matches.
    matchDef relates to "defensive" matches, or in other words, matches that
    ones cards have participated in.



rewards
==========
While the match-maker lends itself to experience and rewards, that is ultimately
the responsibility of the app or an external framework. Of course, match-maker
can certainly be used to provide much of the data the app needs to build out
an awesome experience or reward system, it just isn't natively part of the
framework. For example, the app could increase xp/levels/rewards based on the
number of matches (user.matchCount) or successful matches (user.matchWins).



