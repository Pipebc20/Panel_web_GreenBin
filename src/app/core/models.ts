// ── Categorías de residuos ────────────────────────────────────────────────────
export type CategoriaResiduo = 'organico' | 'aprovechable' | 'no_aprovechable';

export interface CategoriaInfo {
  id: CategoriaResiduo;
  label: string;
  caneca: string;
  color: string;        // color hex para indicadores visuales
  bgClass: string;      // clase CSS para fondo
  textClass: string;    // clase CSS para texto
}

export const CATEGORIAS: CategoriaInfo[] = [
  {
    id: 'organico',
    label: 'Orgánico',
    caneca: 'Caneca verde',
    color: '#1D9E75',
    bgClass: 'cat-organico',
    textClass: 'cat-organico-text'
  },
  {
    id: 'aprovechable',
    label: 'Aprovechable',
    caneca: 'Caneca blanca',
    color: '#d0cfc9',
    bgClass: 'cat-aprovechable',
    textClass: 'cat-aprovechable-text'
  },
  {
    id: 'no_aprovechable',
    label: 'No aprovechable',
    caneca: 'Caneca negra',
    color: '#3d3d3a',
    bgClass: 'cat-no-aprovechable',
    textClass: 'cat-no-aprovechable-text'
  }
];

// ── Dispositivo ───────────────────────────────────────────────────────────────
export type EstadoDispositivo = 'online' | 'offline' | 'warning';

export interface Dispositivo {
  id: string;
  nombre: string;
  ubicacion: string;
  estado: EstadoDispositivo;
  clasificacionesHoy: number;
  confianzaPromedio: number;     // 0-1
  ip?: string;
  modelo: 'resnet18' | 'fewshot';
  umbral: number;                // 0-1
}

// ── Clasificación ─────────────────────────────────────────────────────────────
export type EstadoPrediccion = 'seguro' | 'dudoso';

export interface Clasificacion {
  id: string;
  timestamp: Date;
  dispositivoId: string;
  dispositivoNombre: string;
  categoria: CategoriaResiduo;
  confianza: number;             // 0-1
  estado: EstadoPrediccion;
}

// ── Métricas del dashboard ────────────────────────────────────────────────────
export interface MetricasDia {
  fecha: string;
  total: number;
  organico: number;
  aprovechable: number;
  noAprovechable: number;
}

export interface MetricasGenerales {
  clasificacionesHoy: number;
  variacionVsAyer: number;       // porcentaje
  confianzaPromedio: number;     // 0-1
  dispositivosActivos: number;
  dispositivosTotal: number;
  prediccionesDudosas: number;
  pctDudosas: number;
}

// ── Frame del clasificador en tiempo real ─────────────────────────────────────
export interface FrameClasificacion {
  categoria: CategoriaResiduo;
  confianza: number;
  estado: EstadoPrediccion;
  timestamp: Date;
}
