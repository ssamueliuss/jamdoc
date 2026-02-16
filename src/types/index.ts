export interface Tarea {
  id: number;
  texto: string;
  completada: boolean;
  proyectoId?: number;
}

export interface Apunte {
  id: number;
  contenido: string;
  fecha: Date;
  etiqueta?: string;
  proyectoId?: number | null;
}

export interface Estadisticas {
  proyectosActivos: number;
  jamsActivas: number;
  tareasPendientes: number;
}

// Sección 1: Concepto General
export interface SeccionConcepto {
  titulo: string;
  premisa: string;
  factorDiferenciador: string;
  generos: string[];
  inspiracion: string;
  publicoObjetivo: string;
  plataformas: string[];
}

// Sección 2: Narrativa
export interface SeccionNarrativa {
  ambientacion: string;
  historiaPrincipal: string;
  historiasSecundarias: string;
  protagonista: string;
  personajesClave: string;
  tonoHistoria: string;
  comoSeCuenta: string;
}

// Sección 3: Jugabilidad
export interface SeccionJugabilidad {
  objetivoPrincipal: string;
  mecanicasCentrales: string;
  controles: string;
  camara: string;
  progresion: string;
  mundoYNiveles: string;
  ia: string;
  economia: string;
}
// Proyecto completo con GDD
export interface Proyecto {
  id: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  concepto: SeccionConcepto;
  narrativa: SeccionNarrativa;
  jugabilidad: SeccionJugabilidad;
  estado: 'borrador' | 'en_progreso' | 'completado';
  tipo?: 'personal' | 'jam';
  jamDeadline?: Date | null;
}

// Para el dashboard (vista resumida)
export interface ProyectoResumen {
  id: number;
  titulo: string;
  premisa: string;
  generoPrincipal: string;
  fechaModificacion: Date;
  progreso: number; // % de secciones completadas
}
// Añadimos `proyectoId` opcional a los tipos que lo usan
// (ya están definidas arriba; si necesitas más campos añádelos allí)