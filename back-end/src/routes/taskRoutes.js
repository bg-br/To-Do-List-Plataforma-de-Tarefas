// --- Importando 
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middlewares/Authentication');

// --- Rotas 
router.get('/', authenticateToken, taskController.taskUser);
router.post('/', authenticateToken, taskController.taskCreate);
router.put('/:taskId', authenticateToken, taskController.taskAtt);
router.delete('/:taskId', authenticateToken, taskController.taskDelete);
router.patch('/:taskId/toggle', authenticateToken, taskController.taskCompleted);

module.exports = router;