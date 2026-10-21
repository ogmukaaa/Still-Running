import Link from 'next/link';
import styles from './header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} href="/" aria-label="Still Running, início">
          STILL RUNNING
        </Link>

        <nav className={styles.navigation} aria-label="Navegação principal">
          <Link className={`${styles.link} ${styles.current}`} href="/#catalogo" aria-current="page">
            Catálogo
          </Link>
          <Link className={styles.action} href="/tenis/novo">
            Adicionar tênis
          </Link>
        </nav>
      </div>
    </header>
  );
}
