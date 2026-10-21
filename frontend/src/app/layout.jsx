import Header from '@/components/header';
import Footer from '@/components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

export const metadata = {
  title: 'Still Running | Catálogo de tênis',
  description: 'Catálogo e gerenciamento de tênis da Still Running.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
