import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Link className={styles.logo} href="/" aria-label="Still Running, início">
            STILL RUNNING
          </Link>
        </div>

        <Link className={styles.catalogLink} href="/#catalogo">
          Voltar ao catálogo
        </Link>
      </div>
    </footer>
  );
}
