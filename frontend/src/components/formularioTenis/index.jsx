'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import './formularioTenis.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const FORMATOS_IMAGEM = /\.(jpe?g|png|webp|gif|avif)$/i;
const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

const formularioInicial = {
  nome: '',
  marca: '',
  cor: '',
  preco: '',
  quantidade: '',
};

export default function FormularioTenis() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [imagem, setImagem] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const campoImagem = useRef(null);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function atualizarImagem(evento) {
    setImagem(evento.target.files?.[0] ?? null);
  }

  async function cadastrarTenis(evento) {
    evento.preventDefault();
    setErro('');
    setSucesso(false);

    if (imagem && !FORMATOS_IMAGEM.test(imagem.name)) {
      setErro('Use uma imagem JPG, PNG, WEBP, GIF ou AVIF.');
      return;
    }

    if (imagem && imagem.size > TAMANHO_MAXIMO_IMAGEM) {
      setErro('A imagem deve ter no máximo 5 MB.');
      return;
    }

    const dadosTenis = new FormData();
    dadosTenis.append('nome', formulario.nome.trim());
    dadosTenis.append('marca', formulario.marca.trim());
    dadosTenis.append('cor', formulario.cor.trim());
    dadosTenis.append('preco', formulario.preco);
    dadosTenis.append('quantidade', formulario.quantidade);
    if (imagem) dadosTenis.append('imagem', imagem);

    setSalvando(true);

    try {
      const resposta = await fetch(`${API_URL}/api/tenis`, {
        method: 'POST',
        body: dadosTenis,
      });
      const resultado = await resposta.json();

      if (!resposta.ok || !resultado.sucesso) {
        throw new Error(resultado.erro || 'Não foi possível cadastrar o tênis.');
      }

      setSucesso(true);
      setFormulario(formularioInicial);
      setImagem(null);
      if (campoImagem.current) campoImagem.current.value = '';
    } catch (erroDaRequisicao) {
      setErro(erroDaRequisicao.message || 'Não foi possível conectar à API.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="container-fluid px-3 px-md-4 py-5 flex-grow-1">
      <div className="formularioConteudo mx-auto">
        <p className="formularioMarca">Still Running</p>
        <h1 className="formularioTitulo">Cadastrar tênis</h1>
        <p className="formularioDescricao">Preencha as informações do modelo para adicioná-lo ao catálogo.</p>

        <form className="formularioCartao" onSubmit={cadastrarTenis}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="nome">Modelo</label>
              <input
                className="form-control"
                id="nome"
                name="nome"
                type="text"
                maxLength={80}
                value={formulario.nome}
                onChange={atualizarCampo}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="marca">Marca</label>
              <input
                className="form-control"
                id="marca"
                name="marca"
                type="text"
                maxLength={50}
                value={formulario.marca}
                onChange={atualizarCampo}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="cor">Cor</label>
              <input
                className="form-control"
                id="cor"
                name="cor"
                type="text"
                maxLength={80}
                value={formulario.cor}
                onChange={atualizarCampo}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="preco">Preço (R$)</label>
              <input
                className="form-control"
                id="preco"
                name="preco"
                type="number"
                min="0"
                step="0.01"
                value={formulario.preco}
                onChange={atualizarCampo}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="quantidade">Quantidade em estoque</label>
              <input
                className="form-control"
                id="quantidade"
                name="quantidade"
                type="number"
                min="0"
                step="1"
                value={formulario.quantidade}
                onChange={atualizarCampo}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="imagem">Imagem (opcional)</label>
              <input
                className="form-control"
                id="imagem"
                name="imagem"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={atualizarImagem}
                ref={campoImagem}
                aria-describedby="ajudaImagem"
              />
              <div className="form-text" id="ajudaImagem">
                Escolha um arquivo JPG, PNG, WEBP, GIF ou AVIF de até 5 MB.
              </div>
            </div>
          </div>

          {erro && <div className="formularioErro" role="alert">{erro}</div>}

          {sucesso && (
            <div className="formularioSucesso" role="status">
              Tênis cadastrado com sucesso. <Link href="/">Ver catálogo</Link>
            </div>
          )}

          <div className="formularioBotoes">
            <button className="btn formularioEnviar" type="submit" disabled={salvando}>
              {salvando ? 'Cadastrando...' : 'Cadastrar tênis'}
            </button>
            <Link className="btn btn-outline-dark formularioCancelar" href="/">
              Voltar ao catálogo
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
