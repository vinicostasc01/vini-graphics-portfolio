import type { Metadata, Viewport } from 'next';
import { Sora, Archivo } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
});

// Archivo tem eixo de largura variável — dá para esticar de verdade até 125%
// em vez de simular condensação/expansão. Só no display; corpo e interface
// continuam em Sora.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const SITE = 'https://vini-graphics-portfolio.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Vini Graphics — Vinícius Santos, designer gráfico',
  description:
    'Logotipo, identidade visual e social media para negócios que já vendem mas ainda parecem pequenos. Portfólio de Vinícius Santos.',
  authors: [{ name: 'Vinícius Santos' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Vini Graphics',
    title: 'Vini Graphics — Vinícius Santos, designer gráfico',
    description:
      'Logotipo, identidade visual e social media para negócios que já vendem mas ainda parecem pequenos.',
    url: SITE,
    images: [{ url: '/vini-cutout.png', alt: 'Vinícius Santos — Vini Graphics' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vini Graphics — Vinícius Santos, designer gráfico',
    description:
      'Logotipo, identidade visual e social media para negócios que já vendem mas ainda parecem pequenos.',
    images: ['/vini-cutout.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${archivo.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
