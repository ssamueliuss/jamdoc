import { Proyecto } from "../../types";
import { useState } from 'react';
import ConfirmModal from '../ui/ConfirmModal';
import Countdown from '../ui/Countdown';
import JamDataModal from '../proyectos/JamDataModal';

interface ProyectosPageProps {
  proyectos: Proyecto[];
  onOpenNuevo?: () => void;
  onEdit?: (p: Proyecto) => void;
  onExport?: (p: Proyecto) => void;
  onView?: (p: Proyecto) => void;
  onDelete?: (p: Proyecto) => void;
}

export function ProyectosPage({ proyectos, onOpenNuevo, onEdit, onExport, onView, onDelete }: ProyectosPageProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);

  const openConfirm = (p: Proyecto) => { setSelectedProject(p); setConfirmOpen(true); };
  const handleConfirmDelete = () => { if (selectedProject) onDelete?.(selectedProject); };
  const [jamModalOpen, setJamModalOpen] = useState(false);
  const [jamToView, setJamToView] = useState<Proyecto | null>(null);

  const openJamModal = (p: Proyecto) => { setJamToView(p); setJamModalOpen(true); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Proyectos</h2>
        <div className="flex items-center gap-3">
          <button onClick={onOpenNuevo} className="text-indigo-600 hover:underline">+ Nuevo</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {proyectos.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0">
                <p className="font-medium text-lg break-words">{p.concepto.titulo || 'Sin título'}</p>
                <p className="text-sm text-gray-500 break-words">{p.concepto.generos.join(', ')}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className="text-sm text-gray-600 whitespace-nowrap">{p.estado === 'en_progreso' ? 'En progreso' : 'Borrador'}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-start">
              <button onClick={() => onView?.(p)} className="text-sm text-gray-600 hover:underline">Ver</button>
              <button onClick={() => onEdit?.(p)} className="text-sm text-indigo-600 hover:underline">Editar</button>
              <button onClick={() => onExport?.(p)} className="text-sm text-gray-600 hover:underline">Exportar GDD</button>
              {p.tipo === 'jam' && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">Jam</span>
                  <Countdown deadline={p.jamDeadline as any} />
                  <button onClick={() => openJamModal(p)} className="text-sm text-gray-600 hover:underline">Datos</button>
                </div>
              )}
              <button onClick={() => openConfirm(p)} className="text-sm text-red-600 hover:underline">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmModal isOpen={confirmOpen} title="Eliminar proyecto" message="¿Eliminar proyecto? Esta acción desvinculará tareas y apuntes." variant="error" onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} confirmLabel="Eliminar" cancelLabel="Cancelar" />
      <JamDataModal isOpen={jamModalOpen} onClose={() => setJamModalOpen(false)} proyecto={jamToView} />
    </div>
  );
}
