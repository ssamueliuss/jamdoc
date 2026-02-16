import { Proyecto, Tarea, Apunte, Estadisticas } from "../types";

// No test data: exports empty arrays and zeroed stats so build is clean
export const proyectosMock: Proyecto[] = [];
export const tareasMock: Tarea[] = [];
export const apuntesMock: Apunte[] = [];
export const estadisticasMock: Estadisticas = { proyectosActivos: 0, jamsActivas: 0, tareasPendientes: 0 };

export const getProyectosResumen = () => [];