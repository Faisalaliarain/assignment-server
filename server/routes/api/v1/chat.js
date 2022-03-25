const express = require("express"),
  router = express.Router(),
  {
    getMessagesByChatroom,
    getAllRooms,
    updateChatRooms,
    createChatRoom
  } = require("../../../modules/chat/chatController"),
  { verifyJwtToken } = require("../../../middleware/verifyToken");
router.get("/rooms", verifyJwtToken, getAllRooms);
router.get("/:chatId", verifyJwtToken, getMessagesByChatroom);
router.post("/updateChatRooms", verifyJwtToken, updateChatRooms);
router.post("/createChatRoom", verifyJwtToken, createChatRoom);

router.use("/chats", [router]);
module.exports = router;
