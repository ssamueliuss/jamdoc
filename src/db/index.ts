import Dexie, { Table } from 'dexie';
import { Proyecto, Tarea, Apunte } from '../types';

export class JamDB extends Dexie {
  proyectos!: Table<Proyecto, number>;
  tareas!: Table<Tarea, number>;
  apuntes!: Table<Apunte, number>;

  constructor() {
    super('JamDB');
    this.version(1).stores({
      proyectos: '++id, fechaCreacion, fechaModificacion, estado',
      tareas: '++id, proyectoId, completada',
      apuntes: '++id, proyectoId, fecha'
    });
  }
}

export const db = new JamDB();

export async function seedIfEmpty({ proyectos, tareas, apuntes }: {
  proyectos: Proyecto[];
  tareas: Tarea[];
  apuntes: Apunte[];
}) {
  const count = await db.proyectos.count();
  if (count === 0) {
    await db.transaction('rw', db.proyectos, db.tareas, db.apuntes, async () => {
      await db.proyectos.bulkAdd(proyectos);
      await db.tareas.bulkAdd(tareas);
      await db.apuntes.bulkAdd(apuntes);
    });
  }
}
