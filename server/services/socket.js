const ChatRoom = require('../modules/chat/chatRoom')
const Message = require('../modules/chat/message')
const JWT = require('jsonwebtoken');
const JWT_SECRET = require('../config/serverConfig').jwtSecret


const joinChat = (socket, io) => {
	socket.on('createChatRoom', async data => {
		const room = await ChatRoom.findOneAndUpdate(
			{
				participants: [data.sender, data.receiver]
			}, {
				$set: {
					createdBy: data.sender,
					participants: [data.sender, data.receiver]
				}
			}, {
				new: true,
				upsert: true,
				useFindAndModify: false
			})
			.populate('participants')
			.exec();
		let chatUser = {
			sender: '',
			receiver: ''
		};
		if (room) {
			socket.join(room._id);

			room.participants.forEach((d, i) => {
				if (d._id.toString() === data.sender) {
					chatUser.sender = d;
				} else {
					chatUser.receiver = d;
				}
			})
		}

		io.to(chatUser.receiver.socketId).emit('chat-created', room)
		io.to(chatUser.sender.socketId).emit('chat-created', room)

		room.save();
	});
}


const messages = (socket, io) => {
	socket.on('messages', async (data) => {
		const q = {
			createdBy: data.sender,
			sender: data.sender,
			receiver: data.receiver,
			room: data.room,
			text: data.message
		}
		const message = await Message.create(q);
		const sendmsg = await Message
			.findOne({ _id: message._id })
			.populate(['sender', 'receiver', 'createdBy'])
			.exec();
		const room = await ChatRoom.findOneAndUpdate({ _id: data.room }, { $set: { lastMessage: message._id.toString() } }, { new: true ,useFindAndModify: false});
		const msgCount = await Message.find({ receiver: sendmsg.receiver._id, read: false }).countDocuments();
		io.to(sendmsg.receiver.socketId).emit('unread-messages', { count: msgCount });
		io.to(sendmsg.receiver.socketId).emit('new message', sendmsg)
		io.to(sendmsg.sender.socketId).emit('new message', sendmsg)

	});

}
const typing = (socket, io) => {
	socket.on('typing', (data) => {
		socket.broadcast.in(data.room).emit('typing', { data: data, isTyping: true,  roomid: data.roomid});
	})

}
const disconnect = (socket, io) => {
	socket.on('disconnect', () => {
	})
}


const checkUnreadMsg = (socket, io) => {
	socket.on('check-unread-msg-count', async data => {
		const msgCount = await Message.find({ receiver: data.id, read: false }).countDocuments();
		io.to(socket.id).emit('unread-messages', { count: msgCount });
	});
};
const readMsg = (socket, io) => {
	socket.on('read-message', async data => {
		const token = socket.handshake.headers.Authorization;

		// const decoded = await JWT.verify(cookies.jwtToken, process.env.JWT_SECRET);
		const decoded = await JWT.verify(token, JWT_SECRET);
		const updateMsg = await Message.update({ _id: { $in: data } }, { read: true }, { multi: true });
		const msgCount = await Message.find({ receiver: decoded.data.id, read: false }).countDocuments();
		io.to(socket.id).emit('unread-messages', { count: msgCount });
	});
};


module.exports = {
	joinChat,
	messages,
	typing,
	disconnect,
	checkUnreadMsg,
	readMsg
}

