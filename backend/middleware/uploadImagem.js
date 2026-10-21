import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const pastaMiddleware = path.dirname(fileURLToPath(import.meta.url));
const pastaImagens = path.resolve(pastaMiddleware, '../../frontend/public/images');

mkdirSync(pastaImagens, { recursive: true });

const extensoesPorTipo = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'image/avif': ['.avif'],
};

const armazenamento = multer.diskStorage({
  destination(_req, _file, concluir) {
    concluir(null, pastaImagens);
  },
  filename(_req, arquivo, concluir) {
    const extensao = path.extname(arquivo.originalname).toLowerCase();
    concluir(null, `${randomUUID()}${extensao}`);
  },
});

function validarTipoImagem(_req, arquivo, concluir) {
  const extensao = path.extname(arquivo.originalname).toLowerCase();
  const extensoesValidas = extensoesPorTipo[arquivo.mimetype];

  if (!extensoesValidas?.includes(extensao)) {
    const erro = new Error('Envie uma imagem JPG, PNG, WEBP, GIF ou AVIF.');
    erro.status = 400;
    return concluir(erro);
  }

  return concluir(null, true);
}

const uploadImagem = multer({
  storage: armazenamento,
  fileFilter: validarTipoImagem,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 10,
  },
});

export default uploadImagem;
