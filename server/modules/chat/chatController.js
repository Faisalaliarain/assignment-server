const ChatRoom = require("../chat/chatRoom");
const Message = require("../chat/message");

const joinchat = data => {
  return ChatRoom.find({
    participants: {
      $in: [data.sender, data.receiver]
    }
  }).populate(["participants", "lastMessage"]);
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      participants: {
        $in: [req.user._id]
      }
    })
      .populate(["participants", "lastMessage"])
      .sort({ updatedAt: -1 })
      .exec();
    if (!rooms) {
      throw new Error("not found");
    } else {
      rooms.forEach(d => {
        d.participants.forEach((p, i) => {
          if (req.user._id.toString() === p._id.toString()) {
            d.participants.splice(i, 1);
          }
        });
      });

      res.status(200).send(rooms);
    }
  } catch (e) {
    throw new Error(e.errmsg);
  }
};

const updateChatRooms = async (req, res) => {
  try {
    const room = await ChatRoom.findOne({
      _id: req.body.roomId
    });

    await room.save();
    res.status(200).send({ });
  } catch (error) {
    throw new Error(error);
  }
};

const getMessagesByChatroom = async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.chatId })
      .populate(["sender", "receiver", "createdBy"])
      .exec();
    if (!messages) {
      throw new Error("not found");
    } else {
      res.status(200).send(messages);
    }
  } catch (e) {

    res.status(400).send(e);
  }
};

const createChatRoom = async (req, res) => {
  try {
    const chat = new ChatRoom({
      participants: [req.user._id, req.body.receiver]
    });
    const chatSave = await chat.save();
    const message = new Message({
      createdBy: req.user._id,
      sender: req.user._id,
      receiver: req.body.receiver,
      room: chatSave._id,
      text: `Chat created by ${req.user.email}`
    });
    const saveMessage = await message.save();
    chatSave.lastMessage = saveMessage._id;
    await chatSave.save();
    const sendChat = await ChatRoom.find({ _id: chatSave._id })
      .populate(["participants", "lastMessage"])
      .exec();
    res.status(200).send(sendChat);
  } catch (e) {
    throw new Error(e);
  }
};


module.exports = {
  getMessagesByChatroom,
  getAllRooms,
  updateChatRooms,
  createChatRoom,
  joinchat
};
