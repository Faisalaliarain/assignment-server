const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const User = require('../user/users');
const ChatRoom = require('./chatRoom');

const Schema = mongoose.Schema;
const message = new Schema({
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref:  User
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref:  User
	},
	receiver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User
	},
	room: {
		type: mongoose.Schema.Types.ObjectId,
		ref:  "ChatRoom"
	},
	text: {
		type: String,
		required: true
	},
	read: {
		type: Boolean,
		default: false
	},
	type: {
		type: String,
		enum: [
			"text",
		],
		default: "text"
	}
});
const populate = function (next){
	this.populate('room');
	next();
};
message.plugin(timestamps);
message.pre('find', populate);
const Message = mongoose.model("Message", message);
module.exports = Message;
