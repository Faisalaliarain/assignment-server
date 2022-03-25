const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	first_name: { type: String, default: null },
	last_name: { type: String, default: null },
	email: { type: String, unique: true },
	password: { type: String },
	token: { type: String },
	socketId: String,
});
userSchema.statics.getUsers = async function () {
	try {
		const users = await this.find();
		return users;
	} catch (error) {
		throw error;
	}
}
userSchema.statics.searchUsers = async function (text, userID) {
	try {
		const users = await this.find({$and: [{"first_name": new RegExp(text)},{'_id': {$ne: mongoose.Types.ObjectId(userID)}}]});
		return users;
	} catch (error) {
		throw error;
	}
}
module.exports = mongoose.model("user", userSchema);
