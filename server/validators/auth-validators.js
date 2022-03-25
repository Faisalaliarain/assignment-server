const {	Joi }  = require('express-validation');


const loginValidation = {
	body:
		Joi.object({
			email: Joi.string().required().regex(/[a-zA-Z0-9+._%-+]{1,256}@[a-zA-Z0-9][a-zA-Z0-9-]{0,64}(.[a-zA-Z0-9][a-zA-Z0-9-]{0,25})/),
			password: Joi.string().min(8).max(20).required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z_@./#&!$*+-\d]{8,20}$/),
		})
};
const registerUserValidation = {
	body:
		Joi.object({
			firstName: Joi.string().required().min(3),
			lastName: Joi.string().required().min(3),
			email: Joi.string().required().regex(/[a-zA-Z0-9+._%-+]{1,256}@[a-zA-Z0-9][a-zA-Z0-9-]{0,64}(.[a-zA-Z0-9][a-zA-Z0-9-]{0,25})/),
			password: Joi.string().min(8).max(20).required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z_@./#&!$*+-\d]{8,20}$/),
		})
};
module.exports = {
	loginValidation,
	registerUserValidation
};