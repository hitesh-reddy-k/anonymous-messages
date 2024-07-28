const express = require("express");
const { uploadMessage, getMessages,getUsername,handleLinkClick,redirectToSendPage,getUserData, getlinktomessage, sendlink,sendMessage} = require("../controller/messagecontroller");
const { isAuthenticatedUser } = require("../controller/usercontroller");
const router = express.Router();


router.post("/send/:reserverId", uploadMessage);
router.get("/getMessages", isAuthenticatedUser, getMessages);
router.get("/username/:userId", getUsername);
router.get("/anonymousMessages/:reserverId", handleLinkClick);
router.post("/sendMessage/:reserverId", sendMessage);






module.exports = router;
