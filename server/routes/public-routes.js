const express = require('express');
const router = express.Router();
router.all('/api/v1/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});
const user = require('./api/v1/user');
const chat = require('./api/v1/chat');
router.use(
	'/api/v1',
	[
		user,
		chat
	],
);

module.exports = router;
