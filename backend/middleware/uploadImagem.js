import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const pastaMiddleware = path.dirname(fileURLToPath(import.meta.url));
const pastaImagens = path.resolve(pastaMiddleware, '../../frontend/public/images');

const extensoesPorTipo = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'image/avif': ['.avif'],
};

const extensaoPorTipo = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};
const extensoesImagem = new Set(Object.values(extensoesPorTipo).flat());

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

const receberArquivo = multer({
  storage: multer.memoryStorage(),
  fileFilter: validarTipoImagem,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 10,
  },
}).single('imagem');

async function salvarSemDuplicar(req) {
  const arquivo = req.file;
  const hash = createHash('sha256').update(arquivo.buffer).digest('hex');
  const extensao = extensaoPorTipo[arquivo.mimetype];

  await mkdir(pastaImagens, { recursive: true });
  const arquivosExistentes = (await readdir(pastaImagens))
    .filter((nome) => extensoesImagem.has(path.extname(nome).toLowerCase()))
    .sort((a, b) => a.length - b.length || a.localeCompare(b));

  for (const nome of arquivosExistentes) {
    const caminho = path.join(pastaImagens, nome);
    const informacao = await stat(caminho);
    if (!informacao.isFile() || informacao.size !== arquivo.size) continue;
    const conteudo = await readFile(caminho);
    const hashExistente = createHash('sha256').update(conteudo).digest('hex');
    if (hashExistente === hash) {
      arquivo.filename = nome;
      arquivo.path = caminho;
      arquivo.novaImagem = false;
      delete arquivo.buffer;
      return;
    }
  }

  const nome = `${hash}${extensao}`;
  const caminho = path.join(pastaImagens, nome);
  try {
    await writeFile(caminho, arquivo.buffer, { flag: 'wx' });
    arquivo.novaImagem = true;
  } catch (erro) {
    if (erro.code !== 'EEXIST') throw erro;
    arquivo.novaImagem = false;
  }
  arquivo.filename = nome;
  arquivo.path = caminho;
  delete arquivo.buffer;
}

export default function uploadImagem(req, res, next) {
  receberArquivo(req, res, async (erro) => {
    if (erro) return next(erro);
    if (!req.file) return next();

    try {
      await salvarSemDuplicar(req);
      return next();
    } catch (erroAoSalvar) {
      return next(erroAoSalvar);
    }
  });
}
