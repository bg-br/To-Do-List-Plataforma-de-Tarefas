// --- Importando 
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const jwtSecretKey = 'taskprogram';

// --- Definindo User Controller 
const userController = {
    // Registrar 
    async userRegister(request, respond) {
        try {
            const erVer = validationResult(request);
            if (!erVer.isEmpty()) {
                return respond.status(400).json({ errors: erVer.array() });
            }
            
            const { nome, email, senha } = request.body;

            // Primeiro, verificando se não são campos vazios
            if (!nome || !email || !senha) {
                return respond.status(400).json({ message: "Todos os campos são obrigatórios." });
            }

            // Verificando tamanho da senha
            if (senha.length < 6) {
                return respond.status(400).json({ message: "Senha deve ter no mínimo 6 caracteres." });
            }

            // Verificando se o usuário está ou não já registrado
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                console.log("Email já existe.");
                return respond.status(400).json({ message: "Email já registrado." });
            }

            // Registrando usuário novo
            const newUser = await User.create({ nome, email, senha });
            
            // Gerando Token
            const token = jwt.sign(
                { userId: newUser.id, email: newUser.email },
                jwtSecretKey,
                { expiresIn: '24h' }
            );
            
            console.log("Usuário registrado:", newUser.email);
            return respond.status(201).json({ 
                message: "Registro bem sucedido.",
                token,
                user: { 
                    id: newUser.id, 
                    nome: newUser.nome, 
                    email: newUser.email 
                }
            });

        } catch (error) {
            console.error("Erro detalhado:", error);
            respond.status(500).json({ 
                message: "Erro ao registrar usuário.",
                error: error.message 
            }); 
        }
    },

    // Login
    async userLogin(request, respond) {
        try {
            // Adquirindo as coisas do usuário
            const { email, senha } = request.body;

            // Verificando se campos tão cheios
            if (!email || !senha) {
                console.log("Erro: Campos vazios.");
                return respond.status(400).json({ message: "Todos os campos são obrigatórios." });
            }

            // Buscando usuário
            const user = await User.findOne({ where: { email } });

            // Verificando se o usuário existe
            if (!user) {
                return respond.status(401).json({ message: "Email ou senha inválidos." });
            }

            // Verificando senha
            const senhaValida = await user.checkPassword(senha);
            if (!senhaValida) { 
                return respond.status(401).json({ message: "Email ou senha inválidos." }); 
            } 

            // Gerando Token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                jwtSecretKey,
                { expiresIn: '24h' }
            );

            // Resposta
            console.log("Login bem sucedido:", user.email);
            return respond.json({
                message: "Login bem sucedido.",
                token,
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email
                }
            });

        } catch (error) {
            console.error("Erro detalhado:", error);
            respond.status(500).json({ 
                message: "Erro ao conectar usuário.",
                error: error.message 
            }); 
        }
    },

    // Buscar Id (agora usa o token)
    async userFindId(request, respond) {
        try {
            // O email vem do token (do middleware authenticateToken)
            const { email } = request.user;
            
            if (!email) { 
                return respond.status(400).json({ message: "Email não encontrado no token." }); 
            }
        
            const user = await User.findOne({ 
                where: { email },
                attributes: ['id', 'nome', 'email']
            });
        
            if (!user) { 
                return respond.status(404).json({ message: "Usuário não encontrado." }); 
            }
        
            return respond.json({
                message: "Usuário encontrado",
                user: { 
                    id: user.id, 
                    nome: user.nome, 
                    email: user.email 
                }
            });
        } catch (error) {
            console.error("Erro detalhado:", error);
            respond.status(500).json({ 
                message: "Erro ao procurar usuário.",
                error: error.message 
            }); 
        }
    },
};

module.exports = userController;