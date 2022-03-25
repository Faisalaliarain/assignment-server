const bcrypt = require('bcrypt');
const Configs = require('../config/serverConfig')
const saltRounds = 10;
const jwt = require('jsonwebtoken');

module.exports.getHashSync = function (password) {
	return bcrypt.hashSync(password, saltRounds);
};

module.exports.comparePasswordSync = function (password, hash) {
	return bcrypt.compareSync(password, hash);
};

module.exports.createJWTToken = (data) => {

	return jwt.sign(data, Configs.jwtSecret, {
		expiresIn: Configs.jwtExpiry // in seconds
	});
};

module.exports.userObject = (data) => {

	return {
		id : data._id,
		firstName : data.first_name,
		lastName: data.lastName,
		email: data.email,
		token: data.token
	}
};