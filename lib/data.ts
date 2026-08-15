export const WHATSAPP = '5579996768698';

export function wa(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export const LINKS = {
  behance: 'https://www.behance.net/vini_graphics',
  instagram: 'https://www.instagram.com/vini_dsg/',
  linkedin: 'https://www.linkedin.com/in/vini-graphics/',
};

export type Category = 'identidade' | 'social' | 'logotipo' | 'motion';

export const CATEGORY_LABEL: Record<Category, string> = {
  identidade: 'Identidade',
  social: 'Social media',
  logotipo: 'Logotipo',
  motion: 'Motion & VFX',
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: Category;
  href: string;
  image: string;
  imageLarge: string;
};

/**
 * Capas baixadas do Behance para public/work — sem hotlink do CDN da Adobe.
 * `image` é a versão 404px (src), `imageLarge` a 808px (srcset 2x).
 */
export const PROJECTS: Project[] = [
  {
    slug: 'nxz-vendas',
    title: 'NXZ Vendas',
    client: 'Loja de contas e skins',
    category: 'identidade',
    href: 'https://www.behance.net/gallery/247028613/Projeto-NXZ-Vendas',
    image: '/work/sm-nxz-vendas.png',
    imageLarge: '/work/nxz-vendas.png',
  },
  {
    slug: 'atena',
    title: 'Atena Proteção Veicular',
    client: 'Kit de social media',
    category: 'social',
    href: 'https://www.behance.net/gallery/246933925/Atena-Protecao-Veicular-Social-Media-Kit-Ramon-Junior',
    image: '/work/sm-atena-protecao-veicular.png',
    imageLarge: '/work/atena-protecao-veicular.png',
  },
  {
    slug: 'litoral-norte',
    title: 'Litoral Norte Santos FC',
    client: 'Embaixada de torcida',
    category: 'identidade',
    href: 'https://www.behance.net/gallery/245685887/Projeto-ID-Visual-Litoral-Norte-Santos-Fc',
    image: '/work/sm-litoral-norte-santos.png',
    imageLarge: '/work/litoral-norte-santos.png',
  },
  {
    slug: 'pacgens',
    title: 'Pacgens',
    client: 'Marca de embalagem',
    category: 'logotipo',
    href: 'https://www.behance.net/gallery/241836823/Projeto-Logotipo-Pacgens',
    image: '/work/sm-pacgens.png',
    imageLarge: '/work/pacgens.png',
  },
  {
    slug: 'residencial-palace',
    title: 'Residencial Palace',
    client: 'Empreendimento imobiliário',
    category: 'identidade',
    href: 'https://www.behance.net/gallery/241836671/Projeto-Residencial-Palace',
    image: '/work/sm-residencial-palace.png',
    imageLarge: '/work/residencial-palace.png',
  },
  {
    slug: 'felina-closet',
    title: 'Felina Closet',
    client: 'Moda feminina',
    category: 'identidade',
    href: 'https://www.behance.net/gallery/241833461/Felina-Closet',
    image: '/work/sm-felina-closet.png',
    imageLarge: '/work/felina-closet.png',
  },
  {
    slug: 'bem-estar-fit',
    title: 'Bem Estar Fit',
    client: 'Academia',
    category: 'identidade',
    href: 'https://www.behance.net/gallery/240790423/PROJETO-BEM-ESTAR-FIT',
    image: '/work/sm-bem-estar-fit.png',
    imageLarge: '/work/bem-estar-fit.png',
  },
  {
    slug: 'vfx-peixao',
    title: 'VFX — temática do Peixão',
    client: 'Conteúdo de torcida',
    category: 'motion',
    href: 'https://www.behance.net/gallery/195299041/VFX-COM-A-TEMATICA-DO-PEIXAO',
    image: '/work/sm-vfx-peixao.png',
    imageLarge: '/work/vfx-peixao.png',
  },
  {
    slug: 'motion-vendas',
    title: 'Motion para vendas',
    client: 'Campanha Free Fire',
    category: 'motion',
    href: 'https://www.behance.net/gallery/162183103/MOTION-PARA-VENDAS-(FREE-FIRE)',
    image: '/work/sm-motion-free-fire.png',
    imageLarge: '/work/motion-free-fire.png',
  },
  {
    slug: 'material-esportivo',
    title: 'Loja de material esportivo',
    client: 'Flyer promocional',
    category: 'social',
    href: 'https://www.behance.net/gallery/177162347/FLYER-PARA-LOJA-DE-MATERIAL-ESPORTIVO',
    image: '/work/sm-flyer-esportivo.png',
    imageLarge: '/work/flyer-esportivo.png',
  },
  {
    slug: 'mundial-camisas',
    title: 'Loja de camisas — Mundial',
    client: 'Campanha sazonal',
    category: 'social',
    href: 'https://www.behance.net/gallery/163441053/ARTE-PARA-LOJA-DE-CAMISA-DE-TIME-TEMA-FINAL-DO-MUNDIAL',
    image: '/work/sm-mundial-camisas.png',
    imageLarge: '/work/mundial-camisas.png',
  },
  {
    slug: 'hamburgueria',
    title: 'Hamburgueria',
    client: 'Flyer de cardápio',
    category: 'social',
    href: 'https://www.behance.net/gallery/162560867/FLYER-PARA-HAMBURGUERIA',
    image: '/work/sm-hamburgueria.png',
    imageLarge: '/work/hamburgueria.png',
  },
];

export const SERVICES = [
  {
    id: '01',
    name: 'Identidade visual',
    body: 'Logo, variações, paleta, tipografia e os elementos de apoio que fazem tudo parecer da mesma marca.',
    items: ['Logotipo e variações', 'Paleta e tipografia', 'Elementos de apoio', 'Manual de uso'],
  },
  {
    id: '02',
    name: 'Social media',
    body: 'Feed, stories, carrossel e campanha. Templates que você edita sozinho, para a rotina não travar.',
    items: ['Feed e stories', 'Carrosséis', 'Templates editáveis', 'Campanhas sazonais'],
  },
  {
    id: '03',
    name: 'Motion & VFX',
    body: 'Vinheta, animação de logo e efeito para vídeo, para quando a peça parada já não segura a atenção.',
    items: ['Animação de logo', 'Vinhetas', 'Efeitos para vídeo', 'Reels e shorts'],
  },
  {
    id: '04',
    name: 'Direção de arte',
    body: 'A camada que mantém tudo coerente: referência, tom e critério antes de qualquer peça ser desenhada.',
    items: ['Pesquisa de referência', 'Definição de tom', 'Critérios visuais', 'Acompanhamento'],
  },
];

export const PROCESS = [
  {
    step: 'Etapa 01',
    name: 'Conversa',
    body: 'Você me conta o que vende, para quem e o que está incomodando. Pergunto bastante.',
  },
  {
    step: 'Etapa 02',
    name: 'Direção',
    body: 'Monto referências e escolho o caminho visual antes de desenhar. Você aprova a direção, não o desenho pronto.',
  },
  {
    step: 'Etapa 03',
    name: 'Criação',
    body: 'Desenho o sistema inteiro e aplico nas peças reais que você vai usar. Ajustes fazem parte.',
  },
  {
    step: 'Etapa 04',
    name: 'Entrega',
    body: 'Pastas organizadas, formatos certos e orientação de uso. Você sai sabendo aplicar sem me chamar.',
  },
];

export const PLANS = [
  {
    tag: 'Essencial',
    name: 'Marca base',
    body: 'Para sair do improviso e ter uma base visual que aguenta o dia a dia.',
    items: [
      'Logotipo principal e variações',
      'Paleta de cores e tipografia',
      'Elementos visuais de apoio',
      'Arquivos finais organizados',
    ],
    featured: false,
  },
  {
    tag: 'Mais pedido',
    name: 'Marca completa',
    body: 'Para quem já vende e precisa que a marca acompanhe o tamanho do negócio.',
    items: [
      'Identidade visual com direção de arte',
      'Aplicações para redes e apresentações',
      'Peças-chave de lançamento',
      'Guia de uso para manter o padrão',
    ],
    featured: true,
  },
  {
    tag: 'Conteúdo',
    name: 'Presença digital',
    body: 'Para marcas que já existem e só precisam publicar melhor, com mais frequência.',
    items: [
      'Posts, stories e carrosséis',
      'Templates editáveis por você',
      'Campanhas, flyers e promocionais',
      'Motion e VFX para lançamentos',
    ],
    featured: false,
  },
];

export const FAQ = [
  {
    q: 'Preciso chegar com a ideia pronta?',
    a: 'Não. Na maioria das vezes o cliente chega sem saber explicar o que quer, e tudo bem. A primeira etapa existe justamente para transformar "quero algo mais profissional" em uma direção concreta.',
  },
  {
    q: 'Quanto tempo leva?',
    a: 'Depende do escopo. Um logotipo isolado costuma ser questão de dias; uma identidade completa leva algumas semanas porque tem etapa de direção, criação e ajuste. Eu passo o prazo junto com o orçamento, antes de começar.',
  },
  {
    q: 'Recebo os arquivos editáveis?',
    a: 'Sim, quando o pacote inclui templates. Vêm organizados em pastas por tipo de peça, no formato que você usa — não adianta entregar um arquivo que você não consegue abrir.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Por isso a direção é aprovada antes do desenho. Quando você já validou referência, tom e caminho visual, a chance de o resultado te surpreender negativamente cai muito. Ajustes dentro da direção aprovada fazem parte do projeto.',
  },
  {
    q: 'Como eu começo?',
    a: 'Me chama no WhatsApp com três coisas: o que você vende, o prazo que tem em mente e onde a marca vai aparecer. Eu volto com o caminho e o orçamento.',
  },
];
