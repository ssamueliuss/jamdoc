import { useEffect, useState, useCallback } from 'react';
import { db, seedIfEmpty } from '../db';
import { proyectosMock, tareasMock, apuntesMock } from '../data/mockData';
import { Proyecto, Tarea, Apunte, Estadisticas } from '../types';

export default function useDatabase() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [apuntes, setApuntes] = useState<Apunte[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({ proyectosActivos: 0, jamsActivas: 0, tareasPendientes: 0 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Only seed mock data in development to keep production builds clean
      if (import.meta.env.DEV) {
        await seedIfEmpty({ proyectos: proyectosMock, tareas: tareasMock, apuntes: apuntesMock });
      }

      const pro = await db.proyectos.toArray();
      const tar = await db.tareas.toArray();
      const ap = await db.apuntes.toArray();

      if (!mounted) return;
      setProyectos(pro);
      setTareas(tar);
      setApuntes(ap);
      const jamsActivas = pro.filter(p => (p as any).tipo === 'jam' && (p as any).jamDeadline && new Date((p as any).jamDeadline) > new Date()).length;
      setEstadisticas({
        proyectosActivos: pro.length,
        jamsActivas,
        tareasPendientes: tar.filter(t => !t.completada).length,
      });
    })();

    return () => { mounted = false; };
  }, []);

  const addProyecto = useCallback(async (proyecto: Partial<Proyecto>) => {
    const id = await db.proyectos.add(proyecto as Proyecto);
    const saved = await db.proyectos.get(id as number);
    const newList = await db.proyectos.toArray();
    setProyectos(newList);
    const jamsActivas = newList.filter(p => (p as any).tipo === 'jam' && (p as any).jamDeadline && new Date((p as any).jamDeadline) > new Date()).length;
    setEstadisticas(s => ({ ...s, proyectosActivos: newList.length, jamsActivas }));
    return saved;
  }, []);

  const toggleTarea = useCallback(async (id: number) => {
    const t = await db.tareas.get(id);
    if (!t) return;
    await db.tareas.update(id, { completada: !t.completada });
    const newT = await db.tareas.toArray();
    setTareas(newT);
    setEstadisticas(s => ({ ...s, tareasPendientes: newT.filter(tt => !tt.completada).length }));
  }, []);

  const addTarea = useCallback(async (tarea: Partial<Tarea>) => {
    const id = await db.tareas.add(tarea as Tarea);
    const newT = await db.tareas.toArray();
    setTareas(newT);
    setEstadisticas(s => ({ ...s, tareasPendientes: newT.filter(tt => !tt.completada).length }));
    return id;
  }, []);

  const updateTarea = useCallback(async (id: number, cambios: Partial<Tarea>) => {
    await db.tareas.update(id, cambios as any);
    const newT = await db.tareas.toArray();
    setTareas(newT);
    setEstadisticas(s => ({ ...s, tareasPendientes: newT.filter(tt => !tt.completada).length }));
    return await db.tareas.get(id as number);
  }, []);

  const addApunte = useCallback(async (apunte: Partial<Apunte>) => {
    const id = await db.apuntes.add(apunte as Apunte);
    const newA = await db.apuntes.toArray();
    setApuntes(newA);
    return id;
  }, []);

  const updateApunte = useCallback(async (id: number, cambios: Partial<Apunte>) => {
    await db.apuntes.update(id, cambios as any);
    const newA = await db.apuntes.toArray();
    setApuntes(newA);
    return await db.apuntes.get(id as number);
  }, []);

  const deleteProyecto = useCallback(async (id: number) => {
    await db.transaction('rw', db.proyectos, db.tareas, db.apuntes, async () => {
      await db.tareas.where({ proyectoId: id }).modify({ proyectoId: null as any });
      await db.apuntes.where({ proyectoId: id }).modify({ proyectoId: null as any });
      await db.proyectos.delete(id);
    });
    const newP = await db.proyectos.toArray();
    const newT = await db.tareas.toArray();
    const newA = await db.apuntes.toArray();
    const jamsActivas = newP.filter(p => (p as any).tipo === 'jam' && (p as any).jamDeadline && new Date((p as any).jamDeadline) > new Date()).length;
    setProyectos(newP);
    setTareas(newT);
    setApuntes(newA);
    setEstadisticas(s => ({ ...s, proyectosActivos: newP.length, tareasPendientes: newT.filter(tt => !tt.completada).length, jamsActivas }));
  }, []);

  const deleteTarea = useCallback(async (id: number) => {
    await db.tareas.delete(id);
    const newT = await db.tareas.toArray();
    setTareas(newT);
    setEstadisticas(s => ({ ...s, tareasPendientes: newT.filter(tt => !tt.completada).length }));
  }, []);

  const deleteApunte = useCallback(async (id: number) => {
    await db.apuntes.delete(id);
    const newA = await db.apuntes.toArray();
    setApuntes(newA);
  }, []);

  const updateProyecto = useCallback(async (id: number, cambios: Partial<Proyecto>) => {
    await db.proyectos.update(id, cambios as any);
    const newList = await db.proyectos.toArray();
    const jamsActivas = newList.filter(p => (p as any).tipo === 'jam' && (p as any).jamDeadline && new Date((p as any).jamDeadline) > new Date()).length;
    setProyectos(newList);
    setEstadisticas(s => ({ ...s, proyectosActivos: newList.length, jamsActivas }));
    return await db.proyectos.get(id as number);
  }, []);

  return {
    proyectos,
    tareas,
    apuntes,
    estadisticas,
    addProyecto,
    updateProyecto,
    addTarea,
    updateTarea,
    toggleTarea,
    addApunte,
    updateApunte,
    deleteProyecto,
    deleteTarea,
    deleteApunte,
  };
}
