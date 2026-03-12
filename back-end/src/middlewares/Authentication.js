const jwt = require('jsonwebtoken');
const jwtSecretKey = 'taskprogram';

// --- Definindo módulos
module.exports = {
    // Verificação de Token
    authenticateToken(request, respond, next) {
        const authHeader = request.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return respond.status(401).json({ message: 'Token não fornecido' });
        }

        jwt.verify(token, jwtSecretKey, (err, user) => {
            if (err) {
                return respond.status(403).json({ message: 'Token inválido ou expirado' });
            }
            request.user = user; // Guarda dados do usuário no request
            next();
        });
    },

    // Verificação se userId (Rota) = Token
    checkOwnership(request, respond, next) {
        const userId = request.params.userId || request.body.userId;
        
        if (!userId) {
            return respond.status(400).json({ message: 'userId não fornecido' });
        }
        // Verifica se o usuário do token é o mesmo da requisição
        if (request.user.userId !== parseInt(userId)) { 
            return respond.status(403).json({ message: 'Acesso negado a este recurso' }); 
        }
        next();
    }
};
