const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Routes utilisateurs
router.post('/register', UserController.register);
router.get('/me', UserController.getCurrentUser);
router.get('/', UserController.listUsers);
router.get('/:user_id', UserController.getUser);
router.put('/:user_id', UserController.updateUser);
router.delete('/:user_id', UserController.deleteUser);

module.exports = router;
