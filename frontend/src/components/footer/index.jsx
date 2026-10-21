import Link from 'next/link';
import './footer.css';

export default function Footer() {
  return (
    <footer className="rodape">
      <div className="rodapeInterno">
        <div className="rodapeMarca">
          <Link className="rodapeLogo" href="/" aria-label="Still Running, início">
            STILL RUNNING
          </Link>
        </div>

        <Link className="rodapeLinkCatalogo" href="/#catalogo">
          Voltar ao catálogo
        </Link>
      </div>
    </footer>
  );
}
