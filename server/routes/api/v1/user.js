const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");
const { verifyJwtToken } = require("../../../middleware/verifyToken");
const { loginValidation, registerUserValidation } = require ('../../../validators/auth-validators');
const userController = require('../../../modules/user/userController');

router.post("/login", validate(loginValidation), userController.login);
router.post("/register", validate(registerUserValidation), userController.register);
router.get('/all', verifyJwtToken , userController.onGetAllUsers);
router.post('/search', verifyJwtToken , userController.searchUser);

router.use("/user", [router]);
module.exports = router;
