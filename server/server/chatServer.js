const { Server } = require("socket.io");
const User = require('../modules/user/users');
const JWT = require('jsonwebtoken');
const JWT_SECRET = require('../config/serverConfig').jwtSecret;
const cors = require('cors');
let io;
const {
	joinChat,
	messages,
	typing,
	disconnect,
	checkUnreadMsg,
	readMsg
} = require('../services/socket');
const storeSocketId = async (st, io) => {
	const token = st.handshake.headers.authorization;
	if (token) {
		const decoded = await JWT.verify(token, JWT_SECRET);
		const user = await User.findOne({ _id: decoded.id });
		if (user) {
			user.socketId = st.id;
			user.save();
		}
	}
}
const updateSocket = async (socket, io) => {
	const st = socket;
	storeSocketId(st, io);
	socket.on('check-socket', async (data) => {
		console.log(`Socket Started! ${st.id}`);

	});
	joinChat(socket, io);
	messages(socket, io);
	typing(socket, io);
	disconnect(socket, io);
	checkUnreadMsg(socket, io);
	readMsg(socket, io);
};

const getIo = () => {
	return io;
}
const connectSocket = (server) => {
	io = new Server(server, {
		cors: {
			origins:['*'],
			handlePreflightRequest: (req, res) => {
				res.writeHead(200,{
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET,POST',
					'Access-Control-Allow-Headers': 'Authorization',
				});
				res.end();
			}
		}
	});
	io.sockets.on('connection', (socket) => {
		console.log('connected');
		updateSocket(socket, io);
	})
};

module.exports = {
	connectSocket,
	getIo
};
