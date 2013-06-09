var
    http = require('http')
;

exports.init = function() {
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hi.\n');
    }).listen(parseInt(process.env.PORT, 10) || 5000, process.env.IP);
};
