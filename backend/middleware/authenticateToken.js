const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido!' });
        }
        req.user = user; // Adiciona o usuário autenticado ao objeto da requisição
        next();
    });
}

module.exports = authenticateToken;
