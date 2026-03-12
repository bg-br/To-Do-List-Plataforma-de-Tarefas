// --- Importando 
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/Authentication');
const { body } = require('express-validator');

// --- Rotas 
router.post('/registrar', [
    body('email').isEmail().normalizeEmail(),
    body('senha').isLength({ min: 6 })
], userController.userRegister);
router.post('/login', userController.userLogin);
router.post('/buscar-id', authenticateToken, userController.userFindId);

module.exports = router;