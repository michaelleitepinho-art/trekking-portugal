export type Sport = 'trekking' | 'hiking' | 'alpinismo' | 'escalada' | 'trail';
export type Difficulty = 'easy' | 'moderate' | 'hard' | 'veryhard';

export interface Trail {
  id: number;
  name: string;
  description: string;
  sport: Sport[];
  difficulty: Difficulty;
  km: number;
  elevationGain: number;
  elevationMax: number;
  durationMin: number;
  durationMax: number;
  routeType: 'circular' | 'linear' | 'outback';
  region: string;
  park?: string;
  rating: number;
  reviewCount: number;
  photoCount: number;
  features: string[];
  tags: string[];
  icon: string;
  alltrailsId?: number;
  alltrailsUrl?: string;
  favorite: boolean;
  latitude: number;
  longitude: number;
  pois: POI[];
}

export interface POI {
  km: number;
  name: string;
  type: 'water' | 'food' | 'shelter' | 'viewpoint' | 'alert' | 'historic';
  note: string;
  open?: string;
}

export const TRAILS: Trail[] = [
  {
    id: 11434843,
    name: 'Gerês–Ermida',
    description: 'Trilho linear pela linha romana. Subida por caminhos ancestrais com floresta de carvalhos e paisagem selvagem do Parque Nacional de Peneda-Gerês.',
    sport: ['trekking', 'hiking'],
    difficulty: 'hard',
    km: 9.7,
    elevationGain: 651,
    elevationMax: 934,
    durationMin: 4,
    durationMax: 4.5,
    routeType: 'linear',
    region: 'Gerês, Braga',
    park: 'Peneda-Gerês National Park',
    rating: 4.6,
    reviewCount: 4,
    photoCount: 305,
    features: ['Floresta', 'Rios', 'Vistas', 'Sítios históricos'],
    tags: ['1 dia', 'Linear', 'Via Romana'],
    icon: '⛪',
    alltrailsId: 11434843,
    alltrailsUrl: 'https://www.alltrails.com/trail/portugal/braga/gr-50-grande-rota-peneda-geres-geres-ermida',
    favorite: true,
    latitude: 41.7288,
    longitude: -8.162,
    pois: [
      { km: 2.1, name: 'Fonte do Leão', type: 'water', note: 'Água potável · caudal normal', open: '24h' },
      { km: 4.5, name: 'Marcos da Via Romana', type: 'historic', note: 'Milha romana histórica' },
      { km: 8.2, name: 'Pedras soltas', type: 'alert', note: 'Atenção — material rochoso solto' },
      { km: 9.7, name: 'Restaurante Ermida', type: 'food', note: 'Refeições e café', open: '12h00–22h00' },
    ],
  },
  {
    id: 11051796,
    name: 'Manteigas–Torre',
    description: 'Subida ao ponto mais alto de Portugal continental (1 993m). Pelo Covão d\'Ametade e picos do Cântaro Gordo com vistas sobre o vale glaciar do Zêzere.',
    sport: ['trekking', 'alpinismo'],
    difficulty: 'hard',
    km: 18.8,
    elevationGain: 1027,
    elevationMax: 2008,
    durationMin: 7,
    durationMax: 8,
    routeType: 'outback',
    region: 'Manteigas, Guarda',
    park: 'Serra da Estrela Nature Park',
    rating: 4.5,
    reviewCount: 10,
    photoCount: 179,
    features: ['Lagos', 'Rios', 'Vistas', 'Sítios históricos'],
    tags: ['1 dia', 'Difícil', 'Cume', 'Alta montanha'],
    icon: '🏔️',
    alltrailsId: 11051796,
    alltrailsUrl: 'https://www.alltrails.com/trail/portugal/guarda/manteigas-cantaro-gordo-torre',
    favorite: false,
    latitude: 40.3219,
    longitude: -7.6129,
    pois: [
      { km: 4.0, name: 'Covão d\'Ametade', type: 'viewpoint', note: 'Lagoa glaciar · paragem obrigatória' },
      { km: 8.0, name: 'Fonte da Mesquita', type: 'water', note: 'Água potável · última antes do cume', open: '24h' },
      { km: 13.0, name: 'Planalto exposto', type: 'alert', note: 'Vento forte · zona crítica km 13–16' },
      { km: 18.8, name: 'Torre · 1993m', type: 'viewpoint', note: 'Ponto mais alto de Portugal' },
    ],
  },
  {
    id: 3,
    name: 'Trilho do Arado',
    description: 'Trilho circular com passagem pela famosa Cascata do Arado. Paisagem granítica e ribeiras cristalinas no coração do Gerês.',
    sport: ['hiking'],
    difficulty: 'moderate',
    km: 7.2,
    elevationGain: 310,
    elevationMax: 720,
    durationMin: 2.5,
    durationMax: 3,
    routeType: 'circular',
    region: 'Gerês, Braga',
    park: 'Peneda-Gerês National Park',
    rating: 4.7,
    reviewCount: 120,
    photoCount: 890,
    features: ['Cascata', 'Rios', 'Floresta'],
    tags: ['1 dia', 'Circular', 'Com cascata', 'Familiar'],
    icon: '🌊',
    favorite: false,
    latitude: 41.739,
    longitude: -8.178,
    pois: [
      { km: 3.5, name: 'Cascata do Arado', type: 'viewpoint', note: 'Ponto alto do trilho · paragem para banho' },
      { km: 5.0, name: 'Fonte natural', type: 'water', note: 'Água fresca · caudal abundante' },
    ],
  },
  {
    id: 4,
    name: 'Pedra Bela',
    description: 'Caminhada curta até ao miradouro da Pedra Bela com vistas panorâmicas sobre o vale e as serras do Gerês.',
    sport: ['hiking'],
    difficulty: 'easy',
    km: 5.1,
    elevationGain: 180,
    elevationMax: 850,
    durationMin: 1.5,
    durationMax: 2,
    routeType: 'circular',
    region: 'Gerês, Braga',
    rating: 4.5,
    reviewCount: 67,
    photoCount: 320,
    features: ['Vistas', 'Floresta'],
    tags: ['1 dia', 'Fácil', 'Familiar', 'Miradouro'],
    icon: '🪨',
    favorite: true,
    latitude: 41.74,
    longitude: -8.17,
    pois: [
      { km: 2.5, name: 'Miradouro Pedra Bela', type: 'viewpoint', note: 'Vistas 360° · ideal ao pôr do sol' },
    ],
  },
  {
    id: 5,
    name: 'Penha Garcia',
    description: 'Setor de escalada em xisto com mais de 40 vias. Paisagem de canhão fluvial única em Portugal.',
    sport: ['escalada'],
    difficulty: 'moderate',
    km: 2.0,
    elevationGain: 120,
    elevationMax: 480,
    durationMin: 3,
    durationMax: 8,
    routeType: 'linear',
    region: 'Penha Garcia, Castelo Branco',
    rating: 4.8,
    reviewCount: 45,
    photoCount: 210,
    features: ['Rocha', 'Rio', 'Vistas'],
    tags: ['Rocha', 'Esportiva', '5a–7b', 'Xisto'],
    icon: '🧗',
    favorite: true,
    latitude: 39.925,
    longitude: -7.051,
    pois: [
      { km: 0.5, name: 'Setor Principal', type: 'viewpoint', note: '40 vias · 5a a 7b · xisto compacto' },
      { km: 1.0, name: 'Rio Ponsul', type: 'water', note: 'Banho possível no verão' },
    ],
  },
  {
    id: 6,
    name: 'Gerês Trail Classic',
    description: 'O grande trail do Gerês — 42km pelo coração do Parque Nacional com 2200m de desnível positivo.',
    sport: ['trail'],
    difficulty: 'veryhard',
    km: 42.0,
    elevationGain: 2200,
    elevationMax: 1100,
    durationMin: 5,
    durationMax: 9,
    routeType: 'circular',
    region: 'Gerês, Braga',
    park: 'Peneda-Gerês National Park',
    rating: 4.9,
    reviewCount: 88,
    photoCount: 450,
    features: ['Montanha', 'Técnico', 'Vistas'],
    tags: ['42 km', 'Ultra', 'Técnico', 'Exigente'],
    icon: '🏃',
    favorite: false,
    latitude: 41.72,
    longitude: -8.15,
    pois: [
      { km: 10, name: 'Posto de abastecimento', type: 'food', note: 'Água e gel · voluntários', open: 'Durante prova' },
      { km: 22, name: 'Cascata do Tahiti', type: 'viewpoint', note: 'Marco icónico do percurso' },
    ],
  },
];
