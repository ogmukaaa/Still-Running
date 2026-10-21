'use client';

import { useEffect, useState } from 'react';
import CardTenis from '@/components/cardTenis';
import './catalogo.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function CatalogoTenis() {
  const [tenis, setTenis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [removendoId, setRemovendoId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarTenis() {
      try {
        const resposta = await fetch(`${API_URL}/api/tenis`, {
          signal: controller.signal,
        });
        const resultado = await resposta.json();

        if (!resposta.ok || !resultado.sucesso) {
          throw new Error(resultado.erro || 'Não foi possível carregar o catálogo.');
        }

        setTenis(Array.isArray(resultado.dados) ? resultado.dados : []);
      } catch (erroDaRequisicao) {
        if (!controller.signal.aborted) {
          setErro(erroDaRequisicao.message || 'Não foi possível conectar à API.');
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregarTenis();
    return () => controller.abort();
  }, []);

  async function excluirTenis(tenisAlvo) {
    const confirmar = window.confirm(`Deseja excluir ${tenisAlvo.nome} do catálogo?`);
    if (!confirmar) return;

    setErro('');
    setMensagem('');
    setRemovendoId(tenisAlvo.id);
    try {
      const resposta = await fetch(`${API_URL}/api/tenis/${tenisAlvo.id}`, { method: 'DELETE' });
      const resultado = await resposta.json();
      if (!resposta.ok || !resultado.sucesso) {
        throw new Error(resultado.erro || 'Não foi possível excluir o tênis.');
      }
      setTenis((atual) => atual.filter((item) => item.id !== tenisAlvo.id));
      setMensagem(`${tenisAlvo.nome} foi removido do catálogo.`);
    } catch (erroDaRequisicao) {
      setErro(erroDaRequisicao.message || 'Não foi possível conectar à API.');
    } finally {
      setRemovendoId(null);
    }
  }

  return (
    <main className="container-fluid px-3 px-md-4 py-5 flex-grow-1" id="catalogo">
      <div className="catalogoConteudo mx-auto">
        <div className="catalogoCabecalho">
          <div>
            <p className="catalogoMarca">Still Running</p>
            <h1 className="catalogoTitulo">Catálogo de tênis</h1>
          </div>
          {!carregando && (
            <p className="catalogoContagem">
              {tenis.length} {tenis.length === 1 ? 'tênis cadastrado' : 'tênis cadastrados'}
            </p>
          )}
        </div>

        {carregando && (
          <p className="catalogoEstado" role="status">Carregando tênis...</p>
        )}

        {erro && (
          <div className="alert alert-warning catalogoErro" role="alert">
            {erro} Confira se a API está rodando em {API_URL}.
          </div>
        )}

        {mensagem && <div className="alert alert-success catalogoAviso" role="status">{mensagem}</div>}

        {!carregando && !erro && tenis.length === 0 && (
          <p className="catalogoEstado" role="status">Nenhum tênis cadastrado.</p>
        )}

        {!carregando && tenis.length > 0 && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {tenis.map((item) => (
              <div className="col" key={item.id}>
                <CardTenis
                  tenis={item}
                  aoExcluir={excluirTenis}
                  removendo={removendoId === item.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
