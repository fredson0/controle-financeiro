const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'sophia2907'; // Use variável de ambiente para maior segurança

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Verifica se o cabeçalho Authorization está presente e no formato correto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('⚠️ Token não fornecido ou formato inválido!');
        return res.status(401).json({ error: 'Token não fornecido ou formato inválido!' });
    }

    const token = authHeader.split(' ')[1]; // Extrai o token do cabeçalho

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('❌ Erro ao verificar token:', err.message); // Log para depuração
            return res.status(403).json({ error: 'Token inválido!' });
        }

        // Verifica se o token contém o ID do usuário
        if (!user.id) {
            console.warn('⚠️ Token válido, mas sem ID do usuário!');
            return res.status(403).json({ error: 'Token inválido: ID do usuário ausente!' });
        }

        // Adiciona os dados do usuário decodificados à requisição
        req.user = user;
        console.log('✅ Token verificado com sucesso! Usuário ID:', user.id); // Log para depuração

        next(); // Continua para a próxima função middleware ou rota
    });
};

module.exports = authenticateToken;