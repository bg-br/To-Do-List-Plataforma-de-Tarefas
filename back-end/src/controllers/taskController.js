// --- Importando 
const Task = require('../models/Task');

// --- Definindo Task Controller 
const taskController = {
    // Ver Tasks do Usuário
    async taskUser(request, respond) {
        try {
            const userId = request.user.userId;
            
            const tasks = await Task.findAll({
                where: { userId: userId }, // CORRIGIDO: userId minúsculo
                order: [['createdAt', 'DESC']]
            });
            
            console.log(`Encontradas ${tasks.length} tarefas`);
            respond.json(tasks);
        } catch (error) {
            console.error("Erro detalhado:", error);
            respond.status(500).json({ 
                message: "Erro ao ver tarefas do usuário",
                error: error.message 
            });
        }
    },

    // Fazer Nova Task
    async taskCreate(request, respond) {
        try {
            const { title, description, completed = false } = request.body;
            const userId = request.user.userId;

            // Verificando Título
            if (!title) { 
                return respond.status(400).json({ 
                    message: "Título é obrigatório." 
                });
            }

            // Prevenção de XSS
            const sanitizedTitle = title.replace(/[<>]/g, '');
            const sanitizedDescription = description ? description.replace(/[<>]/g, '') : '';
            
            // Criação de Task
            const task = await Task.create({
                userId,
                title,
                description: description || '',
                completed
            });
            
            return respond.status(201).json(task);
        } catch (error) {
            console.error("Erro ao criar task:", error);
            respond.status(500).json({ 
                message: "Erro ao criar tarefa",
                error: error.message 
            });
        }
    },

    // Atualizar Task
    async taskAtt(request, respond) {
        try {
            const { taskId } = request.params;
            const { title, description, completed } = request.body;
            const userId = request.user.userId;
            
            const task = await Task.findByPk(taskId);
            if (!task) { return respond.status(404).json({ message: "Tarefa não encontrada." }); }
            
            // Sanitização
            if (title !== undefined) task.title = title.replace(/[<>]/g, '');
            if (description !== undefined) task.description = description.replace(/[<>]/g, '');
            if (completed !== undefined) task.completed = completed;
            
            await task.save();
            respond.json(task);
        } catch (error) {
            console.error("Erro ao atualizar task:", error);
            respond.status(500).json({ 
                message: "Erro ao atualizar tarefa",
                error: error.message 
            });
        }
    },

    // Deletar tarefa
    async taskDelete(request, respond) {
        try {
            const { taskId } = request.params;
            const userId = request.user.userId;

            const task = await Task.findByPk(taskId);
            
            // Procurando Tarefa
            if (!task) { 
                return respond.status(404).json({ message: "Tarefa não encontrada." }); 
            }

            // Verificando usuário
            if (task.userId !== userId) {
                return respond.status(403).json({ message: "Acesso negado a esta tarefa." });
            }
            
            await task.destroy();
            respond.json({ message: "Tarefa deletada com sucesso." });
        } catch (error) {
            console.error("Erro ao deletar task:", error);
            respond.status(500).json({ 
                message: "Erro ao deletar tarefa",
                error: error.message 
            });
        }
    },

    // Definir Tarefa Completa
    async taskCompleted(request, respond) {
        try {
            const { taskId } = request.params;
            const userId = request.user.userId;
            const task = await Task.findByPk(taskId);
            
            // Procurando Tarefa
            if (!task) { 
                return respond.status(404).json({ error: "Tarefa não encontrada" }); 
            }

            // Verificando usuário
            if (task.userId !== userId) {
                return respond.status(403).json({ message: "Acesso negado a esta tarefa." });
            }
            
            task.completed = !task.completed;
            await task.save();
            respond.json(task);
        } catch (error) {
            console.error("Erro ao toggle task:", error);
            respond.status(500).json({ 
                message: "Erro ao alternar status",
                error: error.message 
            });
        }
    }
};

module.exports = taskController;