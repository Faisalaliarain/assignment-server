const User = require('../../modules/user/users');
const helper = require('../../utils/helper');
const { objectToSnakeCase } = require('../../utils/stringHandler');

const login = async (req, res) => {
	try {
		const params = objectToSnakeCase(req.body);
		let user = await User.findOne({ email: params.email });
		if(user) {
			if (!helper.comparePasswordSync(params.password, user.password)) {
				res.status(400).send({ 'message': 'Password or Email does not exist.' });
			}
			else {
					const userObj = helper.userObject(user)
					user.token = helper.createJWTToken({id : userObj.id});

					res.status(200).json({data : userObj, accessToken: user.token});
					user.save();
				}

		} else {
			res.status(400).send({ 'message': 'Incorrect Email or Password.' });
		}
	} catch (error ) {
		res.status(400).send({errors: error.toString()});
	}
};

const register = async (req, res) => {
	const params = objectToSnakeCase(req.body);
	try {
		let checkExistUser = await User.findOne({email: params.email})
		if (checkExistUser) {
			res.status(200).send({success: false, message: 'User already exists'});
		} else {
			let user = new User({
				...params,
			});
			user.password = helper.getHashSync(params.password);
			await user.save();
			res.status(200).send({success: true, message: 'User Successfully Registered'});
		}
	}
	catch
		(error)
		{
			console.log(error)
			res.status(400).send({'message': 'Something went wrong'});
		}

	};

const onGetAllUsers =  async (req, res) => {
	try {
		const users = await User.getUsers();
		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json({ success: false, error: error })
	}
};
const searchUser =  async (req, res) => {
	try {
		const params = objectToSnakeCase(req.body);
		const users = await User.searchUsers(params.text, req._id);
		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json({ success: false, error: error })
	}
};

module.exports = {
	login,
	register,
	onGetAllUsers,
	searchUser
};
