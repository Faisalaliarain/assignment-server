const initExpressApp =  require('./initExpress');
const startHTTPServer = require('./startHTTPServer');
const databaseConnection = require('./databaseConnection');

module.exports =  function (app, callback) {
	initExpressApp(app);

	databaseConnection((error) => {
		if(error) {
			callback(error)
		} else {
			startHTTPServer(app, (error) => {
				if(error) {
					callback(error)
				}
			})
		}
	});
}
