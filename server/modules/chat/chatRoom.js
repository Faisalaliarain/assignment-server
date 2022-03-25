const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const User = require('../user/users')
const Message = require('./message')
const Schema = mongoose.Schema;
const chatRoom = new Schema({
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User
	},
	participants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: User
		}
	],
	lastMessage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Message
	}
});

chatRoom.plugin(timestamps);

const ChatRoom = mongoose.model("ChatRoom", chatRoom);
module.exports = ChatRoom;
