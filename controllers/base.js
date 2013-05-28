var
    ejs = require('ejs'),
    fs = require('fs')
;

var templateCache = {};

exports = BaseController;

function BaseController(req, res) {
    this.req = req;
    this.res = res;
}

var proto = BaseController.prototype;

proto.render = function(templFN) {
    var template = templateCache[templFN];
    if (!template){
        template = {
            str: fs.readFileSync(templFN),
            options: { filename: templFN }
        }
        ejs.compile(template.str, template.options);
        templateCache[templFN] = template;
    }

    this.res.write(ejs.render(template.str, template.options));
}
