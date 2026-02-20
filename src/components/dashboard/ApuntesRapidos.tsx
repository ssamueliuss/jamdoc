import { Card } from "../ui/Card";
import { Apunte, Proyecto } from "../../types";
import { useState, useEffect } from "react";
import { WhiteboardModal } from "../ui/WhiteboardModal";
import { StickyNote, Image as ImageIcon, Save } from "lucide-react";

// --- SUBCOMPONENTE: MODAL DE EDICIÓN ---
function EditNoteModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialValue 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (val: string) => void; 
  initialValue: string 
}) {
  const [text, setText] = useState(initialValue);

  // Sincroniza el texto si el initialValue cambia mientras el modal está abierto
  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          
        </div>
        <div className="p-4">
          <textarea 
            className="w-full h-32 p-3 text-sm border-2 border-gray-100 rounded-lg focus:border-indigo-500 outline-none resize-none transition-all"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 mt-4">
            <button 
              onClick={onClose}
              className="flex-1 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => { onSave(text); onClose(); }}
              className="flex-1 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
            >
              <Save size={14} /> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ApuntesRapidosProps {
  apuntes: Apunte[];
  proyectos: Proyecto[];
  addApunte: (a: Partial<Apunte>) => Promise<number>;
  onUpdateApunte?: (id: number, cambios: Partial<Apunte>) => void;
  onDeleteApunte?: (id: number) => void;
}

export function ApuntesRapidos({ 
  apuntes, 
  proyectos, 
  addApunte, 
  onUpdateApunte, 
}: ApuntesRapidosProps) {
  const [whiteOpen, setWhiteOpen] = useState(false);
  const [projectForNote, setProjectForNote] = useState<number | null>(null);
  
  // Estado para controlar qué apunte se está editando
  const [editModal, setEditModal] = useState<{ open: boolean; apunte: Apunte | null }>({
    open: false,
    apunte: null
  });

  const openForProject = (id: number) => {
    setProjectForNote(id);
    setWhiteOpen(true);
  };

  const handleSaveNew = async (dataUrl: string | null, note?: string) => {
    if (dataUrl && String(dataUrl).startsWith('data:image')) {
      await addApunte({ 
        contenido: dataUrl, 
        fecha: new Date(), 
        etiqueta: note || undefined, 
        proyectoId: projectForNote ?? undefined 
      });
    } else if (note) {
      await addApunte({ 
        contenido: note, 
        fecha: new Date(), 
        etiqueta: undefined, 
        proyectoId: projectForNote ?? undefined 
      });
    }
    setWhiteOpen(false);
    setProjectForNote(null);
  };

  const handleConfirmEdit = (newValue: string) => {
    if (!editModal.apunte) return;
    const a = editModal.apunte;
    const isImage = String(a.contenido).startsWith('data:image');
    
    // Si es imagen, editamos la etiqueta. Si es texto, el contenido.
    const cambios = isImage ? { etiqueta: newValue } : { contenido: newValue };
    
    onUpdateApunte?.(a.id as number, { ...cambios, fecha: new Date() });
    setEditModal({ open: false, apunte: null });
  };

  const verImagenMasiva = (base64: string) => {
    const win = window.open();
    if (win) {
      win.document.write(`<body style="margin:0; background:#1a1a1a; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:sans-serif;">
        <img src="${base64}" style="max-width:90%; max-height:80vh; box-shadow: 0 0 20px rgba(0,0,0,0.5); border-radius:8px;">
        <p style="margin-top:20px; font-size:18px;">Vista de Apunte - JamDoc</p>
      </body>`);
    }
  };

  const tituloConIcono = (
    <div className="flex items-center gap-2">
      <StickyNote size={20} className="text-indigo-600" />
      <span>Apuntes por Proyecto</span>
    </div>
  );

  return (
    <Card titulo={tituloConIcono}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proyectos.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-indigo-900 leading-tight">{p.concepto.titulo || 'Sin título'}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{p.concepto.generos[0] || 'GENERAL'}</p>
                  </div>
                  <div className={`text-[9px] px-2 py-0.5 rounded border ${p.estado === 'en_progreso' ? 'border-green-200 text-green-600' : 'border-amber-200 text-amber-600'}`}>
                    {p.estado === 'en_progreso' ? 'ACTIVO' : 'IDEA'}
                  </div>
                </div>

                <div className="mt-2">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Historial Reciente</h4>
                  <div className="space-y-2">
                    {apuntes.filter(a => a.proyectoId === p.id).slice().reverse().slice(0, 3).map(a => {
                      const isImage = String(a.contenido).startsWith('data:image');
                      
                      return (
                        <div key={a.id} className="group border-l-2 border-indigo-100 bg-gray-50/50 rounded-r p-2 flex flex-col gap-1 hover:border-indigo-500 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                              {isImage && (
                                <div className="relative">
                                  <img 
                                    src={a.contenido} 
                                    alt="preview" 
                                    className="w-10 h-8 object-cover rounded shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                    onClick={() => verImagenMasiva(a.contenido)}
                                  />
                                  <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                                    <ImageIcon size={8} className="text-indigo-500" />
                                  </div>
                                </div>
                              )}
                              
                              <div className="text-[11px] text-gray-700 truncate max-w-[130px]">
                                {isImage ? (a.etiqueta || <span className="text-gray-300 italic">Sin nota</span>) : String(a.contenido)}
                              </div>
                            </div>

                            
                          </div>
                          <div className="text-[8px] text-gray-400 self-end">
                            {new Date(a.fecha).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => openForProject(p.id)} 
                className="mt-4 w-full py-2 bg-slate-800 hover:bg-indigo-600 text-white text-[11px] font-bold rounded transition-colors flex items-center justify-center gap-2 uppercase tracking-tighter"
              >
                + Añadir Nota / Dibujo
              </button>
            </div>
          ))}
        </div>

        <WhiteboardModal 
          isOpen={whiteOpen} 
          onClose={() => setWhiteOpen(false)} 
          onSave={handleSaveNew} 
        />
        
        {/* MODAL DE EDICIÓN CON KEY PARA REINICIAR EL ESTADO */}
        {editModal.open && (
          <EditNoteModal 
            key={editModal.apunte?.id} 
            isOpen={editModal.open}
            onClose={() => setEditModal({ open: false, apunte: null })}
            onSave={handleConfirmEdit}
            initialValue={
              editModal.apunte 
                ? (String(editModal.apunte.contenido).startsWith('data:image') 
                    ? (editModal.apunte.etiqueta || '') 
                    : String(editModal.apunte.contenido))
                : ''
            }
          />
        )}
      </div>
    </Card>
  );
}