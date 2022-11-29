const express = require('express');
const LoginController = require('../controller/LoginController');

const router = express.Router();
//Rutas para los procesos get/post de logIn, Registrar y LogOut
router.get('/login', LoginController.login);
router.post('/login', LoginController.auth);
router.get('/register', LoginController.register);
router.post('/register', LoginController.storeUser);
router.get('/logout', LoginController.logout);

module.exports = router; 