const express = require('express');
const router = express.Router();
const passwordController = require('../api/password.controller');
const authMiddleware = require('../Mid/auth.middleware');

router.post('/', authMiddleware.authenticateUser, passwordController.createPassword);
router.get('/:userId', authMiddleware.authenticateUser, passwordController.getPasswordsByUserId);
router.put('/:id', authMiddleware.authenticateUser, passwordController.updatePassword);
router.delete('/:id', authMiddleware.authenticateUser, passwordController.deletePassword);
router.post('/share', authMiddleware.authenticateUser, passwordController.sharePassword);

module.exports = router;