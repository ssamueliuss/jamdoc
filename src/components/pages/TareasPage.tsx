import { Tarea, Proyecto } from "../../types";
import { useState } from 'react';
import ConfirmModal from '../ui/ConfirmModal';

interface TareasPageProps {
  tareas: Tarea[];
  proyectos?: Proyecto[];
  onToggleTarea?: (id: number) => void;
  onShowProject?: (id: number) => void;
  onDeleteTarea?: (id: number) => void;
}

export function TareasPage({ tareas, proyectos: _proyectos = [], onToggleTarea, onShowProject, onDeleteTarea }: TareasPageProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const openConfirm = (id: number) => { setSelectedId(id); setConfirmOpen(true); };
  const handleConfirmDelete = () => { if (selectedId != null) onDeleteTarea?.(selectedId); };
  return (
    <>
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tareas</h2>
      <div className="bg-white p-4 rounded-lg border">
        {tareas.length === 0 ? (
          <p className="text-sm text-gray-500">No hay tareas</p>
        ) : (
          <div className="space-y-2">
            {tareas.map((t) => (
              <div key={t.id} className="flex items-center gap-3 justify-between border rounded p-2">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={t.completada} readOnly onClick={() => onToggleTarea?.(t.id)} />
                  <span className={`${t.completada ? 'line-through text-gray-400' : ''}`}>{t.texto}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {t.proyectoId ? (
                    <button onClick={() => onShowProject?.(t.proyectoId!)} className="hover:underline text-indigo-600">Ver proyecto</button>
                  ) : (
                    <span className="italic">Sin proyecto</span>
                  )}
                    <div className="mt-1">
                    <button onClick={() => openConfirm(t.id)} className="text-sm text-red-600 hover:underline">Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <ConfirmModal isOpen={confirmOpen} title="Eliminar tarea" message="¿Eliminar tarea?" variant="error" onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} confirmLabel="Eliminar" cancelLabel="Cancelar" />
    </>
  );
}
