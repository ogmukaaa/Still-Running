import Link from 'next/link';
import './header.css';

export default function Header() {
  return (
    <header className="cabecalho">
      <div className="cabecalhoInterno">
        <Link className="cabecalhoLogo" href="/" aria-label="Still Running, início">
          STILL RUNNING
        </Link>

        <nav className="cabecalhoNavegacao" aria-label="Navegação principal">
          <Link className="cabecalhoLink cabecalhoLinkAtual" href="/#catalogo" aria-current="page">
            Catálogo
          </Link>
          <Link className="cabecalhoAcao" href="/tenis/novo">
            Adicionar tênis
          </Link>
        </nav>
      </div>
    </header>
  );
}
