import express from 'express';
import tenisRoutes from './routes/tenisRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get('/api/check', (_req, res) => {
  res.status(200).json({ status: 'ok', mensagem: 'API do catálogo de tênis funcionando.' });
});

app.use('/api/tenis', tenisRoutes);

app.use((_req, res) => {
  res.status(404).json({ sucesso: false, erro: 'Rota não encontrada.' });
});

app.use((erro, _req, res, _next) => {
  if (erro.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ sucesso: false, erro: 'A imagem deve ter no máximo 5 MB.' });
  }

  if (erro.status === 400) {
    return res.status(400).json({ sucesso: false, erro: erro.message });
  }

  console.error(erro);
  res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`API disponível em http://localhost:${PORT}`);
});
