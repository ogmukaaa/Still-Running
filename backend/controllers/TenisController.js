import tenis from '../data/tenis.js';
import { unlinkSync } from 'node:fs';

function removerImagemRecebida(req) {
  if (!req.file?.path || !req.file.novaImagem) return;
  try {
    unlinkSync(req.file.path);
  } catch (erro) {
    console.error('Não foi possível remover a imagem após a falha:', erro.message);
  }
}

function ehNumero(dado) {
  if (typeof dado === 'number') return Number.isFinite(dado);
  return typeof dado === 'string' && dado.trim() !== '' && Number.isFinite(Number(dado));
}

function validarDados(dados) {
  const camposObrigatorios = ['nome', 'marca', 'cor'];
  const faltando = camposObrigatorios.filter(
    (campo) => typeof dados[campo] !== 'string' || !dados[campo].trim(),
  );
  if (faltando.length) return `Preencha os campos: ${faltando.join(', ')}.`;
  if (!ehNumero(dados.preco) || Number(dados.preco) < 0) {
    return 'O preço deve ser um número maior ou igual a zero.';
  }
  if (!ehNumero(dados.quantidade) || !Number.isInteger(Number(dados.quantidade)) || Number(dados.quantidade) < 0) {
    return 'A quantidade deve ser um número inteiro maior ou igual a zero.';
  }
  if (dados.imagem !== undefined && typeof dados.imagem !== 'string') {
    return 'A imagem deve ser informada como texto.';
  }
  return null;
}

function obterId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function listar(_req, res) {
  return res.json({ sucesso: true, dados: tenis });
}

export function buscar(req, res) {
  const id = obterId(req.params.id);
  if (!id) return res.status(400).json({ sucesso: false, erro: 'O ID deve ser um número inteiro positivo.' });
  const registro = tenis.find((item) => item.id === id);
  if (!registro) return res.status(404).json({ sucesso: false, erro: 'Tênis não encontrado.' });
  return res.json({ sucesso: true, dados: registro });
}

export function criar(req, res) {
  const erro = validarDados(req.body ?? {});
  if (erro) {
    removerImagemRecebida(req);
    return res.status(400).json({ sucesso: false, erro });
  }

  const novo = {
    id: tenis.length ? Math.max(...tenis.map((item) => item.id)) + 1 : 1,
    nome: req.body.nome.trim(),
    marca: req.body.marca.trim(),
    cor: req.body.cor.trim(),
    preco: Number(req.body.preco),
    quantidade: Number(req.body.quantidade),
    imagem: req.file ? `/images/${req.file.filename}` : req.body.imagem?.trim() ?? '',
  };
  tenis.push(novo);
  return res.status(201).json({ sucesso: true, dados: novo });
}

export function atualizar(req, res) {
  const id = obterId(req.params.id);
  if (!id) {
    removerImagemRecebida(req);
    return res.status(400).json({ sucesso: false, erro: 'O ID deve ser um número inteiro positivo.' });
  }

  const indice = tenis.findIndex((item) => item.id === id);
  if (indice === -1) {
    removerImagemRecebida(req);
    return res.status(404).json({ sucesso: false, erro: 'Tênis não encontrado.' });
  }

  const erro = validarDados(req.body ?? {});
  if (erro) {
    removerImagemRecebida(req);
    return res.status(400).json({ sucesso: false, erro });
  }

  tenis[indice] = {
    id,
    nome: req.body.nome.trim(),
    marca: req.body.marca.trim(),
    cor: req.body.cor.trim(),
    preco: Number(req.body.preco),
    quantidade: Number(req.body.quantidade),
    imagem: req.file
      ? `/images/${req.file.filename}`
      : req.body.imagem?.trim() ?? tenis[indice].imagem ?? '',
  };
  return res.json({ sucesso: true, dados: tenis[indice] });
}

export function remover(req, res) {
  const id = obterId(req.params.id);
  if (!id) return res.status(400).json({ sucesso: false, erro: 'O ID deve ser um número inteiro positivo.' });
  const indice = tenis.findIndex((item) => item.id === id);
  if (indice === -1) return res.status(404).json({ sucesso: false, erro: 'Tênis não encontrado.' });
  const [removido] = tenis.splice(indice, 1);
  return res.json({ sucesso: true, dados: removido, mensagem: 'Tênis removido com sucesso.' });
}
