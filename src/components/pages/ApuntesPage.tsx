import { Apunte, Proyecto } from "../../types";
import { useState } from 'react';
import ConfirmModal from '../ui/ConfirmModal';

interface ApuntesPageProps {
  apuntes: Apunte[];
  proyectos: Proyecto[];
  onDeleteApunte?: (id: number) => void;
  onUpdateApunte?: (id: number, cambios: Partial<Apunte>) => void;
}

export function ApuntesPage({ apuntes, proyectos, onDeleteApunte, onUpdateApunte }: ApuntesPageProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const openConfirm = (id: number) => { setSelectedId(id); setConfirmOpen(true); };
  const handleConfirmDelete = () => { if (selectedId != null) onDeleteApunte?.(selectedId); };
  const findProject = (id?: number) => proyectos.find(p => p.id === id);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Apuntes</h2>
      <div className="grid grid-cols-1 gap-3">
        {apuntes.map((a) => {
          const p = findProject(a.proyectoId as any);
          return (
            <div key={a.id} className="bg-white p-4 rounded border">
              <div className="flex justify-between items-start gap-4">
                <div>
                  {String(a.contenido).startsWith('data:image') ? (
                    <img src={a.contenido} alt="apunte" className="w-48 h-36 object-cover rounded" />
                  ) : (
                    <p className="text-gray-800">{a.contenido}</p>
                  )}
                </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{new Date(a.fecha).toLocaleDateString()}</div>
                    {p && <div className="text-sm text-indigo-600 mt-2">Proyecto: {p.concepto.titulo}</div>}
                    <div className="mt-2 flex flex-col items-end gap-1">
                      <button onClick={() => {
                        const nuevo = prompt('Editar apunte:', String(a.contenido));
                        if (nuevo !== null) onUpdateApunte?.(a.id as number, { contenido: nuevo, fecha: new Date() } as any);
                      }} className="text-sm text-indigo-600 hover:underline">Editar</button>
                      <button onClick={() => openConfirm(a.id as number)} className="text-sm text-red-600 hover:underline">Eliminar</button>
                    </div>
                  </div>
              </div>
            </div>
          );
        })}
      </div>
      <ConfirmModal isOpen={confirmOpen} title="Eliminar apunte" message="¿Eliminar apunte?" variant="error" onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} confirmLabel="Eliminar" cancelLabel="Cancelar" />
    </div>
  );
}
