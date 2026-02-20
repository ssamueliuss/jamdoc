import { Tarea, Proyecto } from "../../types";
import { useState } from 'react';
import ConfirmModal from '../ui/ConfirmModal';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  ExternalLink, 
  ClipboardList,
  FolderOpen
} from 'lucide-react';

interface TareasPageProps {
  tareas: Tarea[];
  proyectos?: Proyecto[];
  onToggleTarea?: (id: number) => void;
  onShowProject?: (id: number) => void;
  onDeleteTarea?: (id: number) => void;
}

export function TareasPage({ tareas = [], onToggleTarea, onShowProject, onDeleteTarea }: TareasPageProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const openConfirm = (id: number) => { setSelectedId(id); setConfirmOpen(true); };
  
  const handleConfirmDelete = () => { 
    if (selectedId != null) {
      onDeleteTarea?.(selectedId);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Tareas del Sistema</h2>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {tareas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <CheckCircle2 size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No hay tareas registradas</p>
              <p className="text-sm text-gray-400">¡Agrega una tarea en un proyecto existente!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tareas.map((t) => (
                <div 
                  key={t.id} 
                  className={`flex items-center justify-between p-4 transition-all duration-200 hover:bg-indigo-50/30 group ${
                    t.completada ? 'bg-gray-50/50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => onToggleTarea?.(t.id)}
                      className={`transition-colors duration-200 ${
                        t.completada ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'
                      }`}
                    >
                      {t.completada ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                    
                    <span className={`text-base transition-all ${
                      t.completada 
                        ? 'line-through text-gray-400 opacity-70' 
                        : 'text-gray-700 font-medium'
                    }`}>
                      {t.texto}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {t.proyectoId ? (
                      <button 
                        onClick={() => onShowProject?.(t.proyectoId!)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors"
                      >
                        <FolderOpen size={14} />
                        PROYECTO
                        <ExternalLink size={12} className="opacity-50" />
                      </button>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest px-2">
                        General
                      </span>
                    )}

                    <button 
                      onClick={() => openConfirm(t.id)} 
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Eliminar tarea"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmOpen} 
        title="Eliminar tarea" 
        message="¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer." 
        variant="error" 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={handleConfirmDelete} 
        confirmLabel="Eliminar Tarea" 
        cancelLabel="Cancelar" 
      />
    </>
  );
}