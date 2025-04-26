const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/tasks', taskRoutes);

// Rota de status para verificação de saúde da API
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API está funcionando! - teste de deploy automatizado' });
});

// Iniciar o servidor apenas se não estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app; // Exportar para testes