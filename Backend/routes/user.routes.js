const express = require('express');
const {register , login, logout, updateprofile, updateProfilephoto, resetPassword} = require('../Controllers/user.controller');
const router = express.Router();
const isAuthenticated = require('../middlewares/authmiddleware');
const singleUpload = require('../middlewares/multer');

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").put(isAuthenticated, singleUpload, updateprofile);
router.route("/profile/update/profilephoto").put(isAuthenticated, singleUpload, updateProfilephoto);
router.route("/reset-password").post(resetPassword); 

module.exports = router;