var
    ejs = require('ejs'),
    fs = require('fs'),
    path = require('path')
;

var templateCache = {};

exports.render = function(req, res, master, view, options) {
    options = options || {};
    options.root = '/';
    options.head = options.head || "";
    options.title = options.title || "...";
	options.content = options.content || "";
	options.req = req;
	options.res = res;

    var viewPath = path.join('./views', view + '.ejs');
    var template = templateCache[viewPath];
    if (!template){ // cache views
        template = {
            str: fs.readFileSync(viewPath, 'utf8')
        };
        templateCache[viewPath] = template;
    }

    options.content = ejs.render(template.str, options);

    res.render(master, options);
};
