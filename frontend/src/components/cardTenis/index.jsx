import Image from 'next/image';
import Link from 'next/link';
import './cardTenis.css';

const formatarPreco = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function CardTenis({ tenis, aoExcluir, removendo = false }) {
  const textoAlternativo = `Tênis ${tenis.nome}, cor ${tenis.cor}`;

  return (
    <article className="card h-100 cartaoTenis">
      <div className="cartaoTenisImagem">
        {tenis.imagem ? (
          <Image
            src={tenis.imagem}
            alt={textoAlternativo}
            fill
            sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 33vw"
            className="cartaoTenisFoto"
          />
        ) : (
          <span className="cartaoTenisSemImagem">Imagem não cadastrada</span>
        )}
      </div>

      <div className="card-body cartaoTenisConteudo">
        <p className="cartaoTenisMarca">{tenis.marca}</p>
        <h2 className="cartaoTenisNome">{tenis.nome}</h2>
        <p className="cartaoTenisCor">Cor: {tenis.cor}</p>

        <div className="cartaoTenisRodape">
          <p className="cartaoTenisPreco">{formatarPreco.format(tenis.preco)}</p>
          <p className="cartaoTenisQuantidade">
            {tenis.quantidade} {tenis.quantidade === 1 ? 'unidade' : 'unidades'}
          </p>
        </div>
        <div className="cartaoTenisAcoes">
          <Link
            className="btn cartaoTenisEditar"
            href={`/tenis/${tenis.id}/editar`}
            aria-label={`Editar ${tenis.nome}`}
          >
            Editar
          </Link>
          <button
            className="btn cartaoTenisExcluir"
            type="button"
            onClick={() => aoExcluir(tenis)}
            disabled={removendo}
            aria-label={`Excluir ${tenis.nome}`}
          >
            {removendo ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </article>
  );
}
