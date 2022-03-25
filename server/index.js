const bodyParser = require('body-parser');
const express = require('express');
const routes = require('./routes/public-routes');
const start = require('./server/startServer');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors')
const app = express();
app.use(cors());
start(app, (error) => {
	if(error) {
		console.log(error);
		throw error
	} else {
		console.log('server started')
	}
});

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Content-Security-Policy', "frame-ancestors 'none';");
	next();
});
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }))
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use('/', routes);


app.use(errorHandler);
