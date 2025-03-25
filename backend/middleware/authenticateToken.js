const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Verifica se o cabeçalho Authorization está presente e no formato correto
    if (!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.split(' ')[1]) {
        console.warn('⚠️ Cabeçalho Authorization ausente ou mal formatado!');
        return res.status(401).json({ error: 'Cabeçalho Authorization ausente ou mal formatado!' });
    }

    const token = authHeader.split(' ')[1]; // Extrai o token após "Bearer"
    console.debug('🔑 Token recebido no middleware:', token);

    // Verifica se o token possui as três partes separadas por "."
    if (token.split('.').length !== 3) {
        console.error('❌ Token mal formatado! Um token JWT deve ter três partes separadas por "."');
        return res.status(403).json({ error: 'Token inválido!' });
    }

    // Log para verificar se a chave secreta está sendo carregada corretamente
    if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET não está definido no ambiente!');
        return res.status(500).json({ error: 'Erro interno no servidor: chave secreta não configurada.' });
    }
    console.debug('🔑 JWT_SECRET carregado no middleware:', process.env.JWT_SECRET);

    // Valida o token usando a chave secreta
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.error('❌ Erro ao verificar token: Token expirado');
                return res.status(403).json({ error: 'Token expirado!' });
            }
            console.error('❌ Erro ao verificar token:', err.message);
            return res.status(403).json({ error: 'Token inválido!' });
        }

        console.debug('✅ Token válido:', user);
        req.user = user; // Adiciona o usuário autenticado ao objeto da requisição
        next();
    });
}

module.exports = authenticateToken;
