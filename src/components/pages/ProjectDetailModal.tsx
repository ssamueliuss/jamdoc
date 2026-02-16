import { useState } from "react";
import { Proyecto, Tarea } from "../../types";
import ConfirmModal from '../ui/ConfirmModal';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  proyecto: Proyecto;
  tareas: Tarea[];
  addTarea: (t: Partial<Tarea>) => Promise<number>;
  updateTarea: (id: number, cambios: Partial<Tarea>) => Promise<any>;
  deleteTarea?: (id: number) => Promise<void> | ((id: number) => void);
}

export function ProjectDetailModal({ isOpen, onClose, proyecto, tareas, addTarea, updateTarea, deleteTarea }: ProjectDetailModalProps) {
  const [nuevaTareaTexto, setNuevaTareaTexto] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const openConfirm = (id: number) => { setSelectedId(id); setConfirmOpen(true); };
  const handleConfirmDelete = () => { if (selectedId != null) deleteTarea?.(selectedId); };

  if (!isOpen) return null;

  const tareasDelProyecto = tareas.filter(t => t.proyectoId === proyecto.id);
  const tareasNoAsignadas = tareas.filter(t => !t.proyectoId);

  const handleVincular = async (id: number) => {
    await updateTarea(id, { proyectoId: proyecto.id });
  };

  const handleDesvincular = async (id: number) => {
    await updateTarea(id, { proyectoId: null as any });
  };

  const handleCrearTarea = async () => {
    if (!nuevaTareaTexto.trim()) return;
    await addTarea({ texto: nuevaTareaTexto.trim(), completada: false, proyectoId: proyecto.id });
    setNuevaTareaTexto("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">{proyecto.concepto.titulo || 'Sin título'}</h2>
            <p className="text-sm text-gray-500">Última modificación: {new Date(proyecto.fechaModificacion).toLocaleString()}</p>
          </div>
          <div>
            <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Cerrar</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium">Concepto</h3>
            <p className="text-sm text-gray-700">{proyecto.concepto.premisa}</p>
            <p className="text-sm text-gray-700 mt-2"><strong>Géneros:</strong> {proyecto.concepto.generos.join(', ')}</p>
            <p className="text-sm text-gray-700 mt-2"><strong>Inspiración:</strong> {proyecto.concepto.inspiracion}</p>
          </div>

          <div>
            <h3 className="font-medium">Narrativa</h3>
            <p className="text-sm text-gray-700">{proyecto.narrativa.historiaPrincipal}</p>
            <p className="text-sm text-gray-700 mt-2"><strong>Protagonista:</strong> {proyecto.narrativa.protagonista}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium">Jugabilidad</h3>
          <p className="text-sm text-gray-700">{proyecto.jugabilidad.mecanicasCentrales}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold">Tareas vinculadas</h4>
            <div className="space-y-2 mt-2">
              {tareasDelProyecto.length === 0 && <p className="text-sm text-gray-500">No hay tareas vinculadas.</p>}
                {tareasDelProyecto.map(t => (
                  <div key={t.id} className="flex justify-between items-center p-2 border rounded">
                    <div className={`${t.completada ? 'line-through text-gray-400' : ''}`}>{t.texto}</div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDesvincular(t.id)} className="text-sm text-gray-600 hover:underline">Desvincular</button>
                      <button onClick={() => openConfirm(t.id)} className="text-sm text-red-600 hover:underline">Eliminar</button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm">Nueva tarea para este proyecto</label>
              <div className="flex gap-2 mt-2">
                <input value={nuevaTareaTexto} onChange={(e) => setNuevaTareaTexto(e.target.value)} className="flex-1 p-2 border rounded" />
                <button onClick={handleCrearTarea} className="px-3 py-2 bg-indigo-600 text-white rounded">Agregar</button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Tareas sin asignar</h4>
            <div className="space-y-2 mt-2">
              {tareasNoAsignadas.length === 0 && <p className="text-sm text-gray-500">No hay tareas sin asignar.</p>}
              {tareasNoAsignadas.map(t => (
                <div key={t.id} className="flex justify-between items-center p-2 border rounded">
                  <div className={`${t.completada ? 'line-through text-gray-400' : ''}`}>{t.texto}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleVincular(t.id)} className="text-sm text-indigo-600 hover:underline">Vincular</button>
                  </div>
                </div>
              ))}
            </div>
            <ConfirmModal isOpen={confirmOpen} title="Eliminar tarea" message="¿Eliminar tarea?" variant="error" onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} confirmLabel="Eliminar" cancelLabel="Cancelar" />
          </div>
        </div>
      </div>
    </div>
  );
}
