const http = require('http');
const config = require('../config/serverConfig');
const {connectSocket} = require('./chatServer');

module.exports = function (app, callback) {
	let httpServer =  http
		.createServer(app)
		.listen(config.httpPort, config.httpHost, function serverReady (err) {
			if (err) {
				callback(err);
			} else{
				console.log(`Server Started on PORT ${config.httpPort}`);
				callback(null);
			}
		});
	connectSocket(httpServer);
};
