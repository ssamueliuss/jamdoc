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
  const handleConfirmDelete = () => { 
    if (selectedId != null) {
      onDeleteApunte?.(selectedId);
      setConfirmOpen(false);
    }
  };
  
  const findProject = (id?: number) => proyectos.find(p => p.id === id);

  // Función para ver imagen en grande (igual que en el Dashboard)
  const verImagenMasiva = (base64: string) => {
    const win = window.open();
    if (win) {
      win.document.write(`
        <body style="margin:0; background:#1a1a1a; display:flex; align-items:center; justify-content:center; height:100vh;">
          <img src="${base64}" style="max-width:95%; max-height:95%; border-radius:8px; box-shadow: 0 0 30px rgba(0,0,0,0.7);">
        </body>`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Libreta de Apuntes</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {apuntes.length} notas guardadas
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {apuntes.slice().reverse().map((a) => {
          const p = findProject(a.proyectoId ?? undefined);
          const isImage = String(a.contenido).startsWith('data:image');

          return (
            <div key={a.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* LADO IZQUIERDO: CONTENIDO */}
                <div className="flex-1 space-y-3">
                  {isImage ? (
                    <div className="space-y-3">
                      <div className="relative group w-fit">
                        <img 
                          src={a.contenido} 
                          alt="apunte visual" 
                          className="w-full max-w-md h-auto max-h-64 object-contain rounded-lg border border-gray-100 cursor-zoom-in group-hover:opacity-90 transition-opacity" 
                          onClick={() => verImagenMasiva(a.contenido)}
                        />
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          Click derecho para ampliar
                        </div>
                      </div>
                      {a.etiqueta && (
                        <div className="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-400">
                          <p className="text-gray-700 text-sm italic">"{a.etiqueta}"</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="prose prose-sm">
                      <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">{a.contenido}</p>
                    </div>
                  )}
                </div>

                {/* LADO DERECHO: INFO Y ACCIONES */}
                <div className="flex flex-col justify-between items-end min-w-[150px] border-l border-gray-50 pl-6">
                  <div className="text-right space-y-2">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-tighter">
                      {new Date(a.fecha).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    {p && (
                      <div className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded">
                        PROYECTO: {p.concepto.titulo.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => {
                        const actual = isImage ? (a.etiqueta || '') : String(a.contenido);
                        const nuevo = prompt('Editar contenido del apunte:', actual);
                        if (nuevo !== null) {
                          const cambios = isImage ? { etiqueta: nuevo } : { contenido: nuevo };
                          onUpdateApunte?.(a.id as number, { ...cambios, fecha: new Date() });
                        }
                      }} 
                      className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span className="text-lg">✎</span> Editar
                    </button>
                    <button 
                      onClick={() => openConfirm(a.id as number)} 
                      className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
                    >
                      <span className="text-lg">×</span> Eliminar
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {apuntes.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">No hay apuntes en tu libreta todavía.</p>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={confirmOpen} 
        title="¿Eliminar este apunte?" 
        message="Esta acción no se puede deshacer y perderás la información de este apunte." 
        variant="error" 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={handleConfirmDelete} 
        confirmLabel="Sí, eliminar" 
        cancelLabel="Cancelar" 
      />
    </div>
  );
}