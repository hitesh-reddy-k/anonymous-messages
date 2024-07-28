const express = require("express");
const { register, login, logout,deleteUser, getmeUser,feedbackForm, isAuthenticatedUser, getuserlink, updateusername } = require("../controller/usercontroller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticatedUser, getmeUser);
router.put("/updateUsername",isAuthenticatedUser, updateusername)
router.delete("/deleteAccount", isAuthenticatedUser, deleteUser); 
router.post("/submit",isAuthenticatedUser,feedbackForm)


module.exports = router;
