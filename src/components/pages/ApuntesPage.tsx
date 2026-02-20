import { Apunte, Proyecto } from "../../types";
import { useState } from 'react';
import ConfirmModal from '../ui/ConfirmModal';
import { Pencil, Trash2, BookOpen, Folder, Save, X } from 'lucide-react';

interface ApuntesPageProps {
  apuntes: Apunte[];
  proyectos: Proyecto[];
  onDeleteApunte?: (id: number) => void;
  onUpdateApunte?: (id: number, cambios: Partial<Apunte>) => void;
}

export function ApuntesPage({ apuntes, proyectos, onDeleteApunte, onUpdateApunte }: ApuntesPageProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editingApunte, setEditingApunte] = useState<Apunte | null>(null);
  const [editValue, setEditValue] = useState("");

  const openConfirm = (id: number) => { setSelectedId(id); setConfirmOpen(true); };
  
  const openEdit = (apunte: Apunte) => {
    setEditingApunte(apunte);
    const isImage = String(apunte.contenido).startsWith('data:image');
    setEditValue(isImage ? (apunte.etiqueta || '') : String(apunte.contenido));
    setEditOpen(true);
  };

  const handleConfirmDelete = () => { 
    if (selectedId != null) {
      onDeleteApunte?.(selectedId);
      setConfirmOpen(false);
    }
  };

  const handleSaveEdit = () => {
    if (editingApunte) {
      const isImage = String(editingApunte.contenido).startsWith('data:image');
      const cambios = isImage ? { etiqueta: editValue } : { contenido: editValue };
      onUpdateApunte?.(editingApunte.id as number, { ...cambios, fecha: new Date() });
      setEditOpen(false);
      setEditingApunte(null);
    }
  };
  
  const findProject = (id?: number) => proyectos.find(p => p.id === id);

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
        <div className="flex items-center gap-3">
          <BookOpen className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Libreta de Apuntes</h2>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
          {apuntes.length} notas guardadas
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {apuntes.length === 0 ? (
          /* --- SECCIÓN EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="bg-indigo-50 p-6 rounded-full mb-4">
              <BookOpen size={48} className="text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Tu libreta está vacía</h3>
            <p className="text-gray-400 max-w-xs text-center mt-2">
              Aún no has guardado apuntes. Captura tus ideas o añade capturas de tus proyectos para verlas aquí.
            </p>
          </div>
        ) : (
          apuntes.slice().reverse().map((a) => {
            const p = findProject(a.proyectoId ?? undefined);
            const isImage = String(a.contenido).startsWith('data:image');

            return (
              <div key={a.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-6">
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

                  <div className="flex flex-col justify-between items-end min-w-[180px] border-l border-gray-50 pl-6">
                    <div className="text-right space-y-2">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {new Date(a.fecha).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      {p && (
                        <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tight">
                          <Folder size={10} />
                          {p.concepto.titulo}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex gap-4">
                      <button 
                        onClick={() => openEdit(a)} 
                        className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
                      >
                        <Pencil size={16} className="group-hover:scale-110 transition-transform" />
                        Editar
                      </button>
                      <button 
                        onClick={() => openConfirm(a.id as number)} 
                        className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-700 transition-colors group"
                      >
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL DE EDICIÓN */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Pencil size={20} className="text-indigo-600" />
                Editar Apunte
              </h3>
              <button onClick={() => setEditOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <textarea
                className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-slate-700 transition-all"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Escribe aquí tu nota..."
                autoFocus
              />
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-indigo-100 active:scale-95"
              >
                <Save size={16} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ELIMINACIÓN */}
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