import { Card } from "../ui/Card";
import { Apunte, Proyecto } from "../../types";
import { useState } from "react";
import { WhiteboardModal } from "../ui/WhiteboardModal";

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
  onDeleteApunte 
}: ApuntesRapidosProps) {
  const [whiteOpen, setWhiteOpen] = useState(false);
  const [projectForNote, setProjectForNote] = useState<number | null>(null);

  const openForProject = (id: number) => {
    setProjectForNote(id);
    setWhiteOpen(true);
  };

  const handleSave = async (dataUrl: string | null, note?: string) => {
    if (dataUrl && String(dataUrl).startsWith('data:image')) {
      // Caso: Imagen (con o sin texto en etiqueta)
      await addApunte({ 
        contenido: dataUrl, 
        fecha: new Date(), 
        etiqueta: note || undefined, 
        proyectoId: projectForNote ?? undefined 
      });
    } else if (note) {
      // Caso: Solo Texto
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

  const verImagenMasiva = (base64: string) => {
    const win = window.open();
    if (win) {
      win.document.write(`<body style="margin:0; background:#1a1a1a; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:sans-serif;">
        <img src="${base64}" style="max-width:90%; max-height:80vh; box-shadow: 0 0 20px rgba(0,0,0,0.5); border-radius:8px;">
        <p style="margin-top:20px; font-size:18px;">Vista de Apunte - JamDoc</p>
      </body>`);
    }
  };

  return (
    <Card titulo="📌 Apuntes por Proyecto">
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
                              {/* Visualización de Imagen si existe */}
                              {isImage && (
                                <img 
                                  src={a.contenido} 
                                  alt="preview" 
                                  className="w-10 h-8 object-cover rounded shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                  onClick={() => verImagenMasiva(a.contenido)}
                                />
                              )}
                              
                              {/* Visualización de Texto (contenido o etiqueta) */}
                              <div className="text-[11px] text-gray-700 truncate max-w-[130px]">
                                {isImage ? (a.etiqueta || <span className="text-gray-300 italic">Sin nota</span>) : String(a.contenido)}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Botón Editar: Siempre edita texto */}
                              <button 
                                onClick={() => {
                                  const actual = isImage ? (a.etiqueta || '') : String(a.contenido);
                                  const n = prompt('Editar apunte:', actual);
                                  if (n !== null) {
                                    const cambios = isImage ? { etiqueta: n } : { contenido: n };
                                    onUpdateApunte?.(a.id as number, { ...cambios, fecha: new Date() });
                                  }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                                title="Editar texto"
                              >
                                ✎
                              </button>
                              <button 
                                onClick={() => { if(confirm('¿Borrar apunte?')) onDeleteApunte?.(a.id as number) }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-50 rounded"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <div className="text-[8px] text-gray-400 self-end">
                            {new Date(a.fecha).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                    {apuntes.filter(a => a.proyectoId === p.id).length === 0 && (
                      <div className="text-center py-4 border-2 border-dashed border-gray-100 rounded">
                         <p className="text-[10px] text-gray-400 uppercase">Sin apuntes</p>
                      </div>
                    )}
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

        <WhiteboardModal isOpen={whiteOpen} onClose={() => setWhiteOpen(false)} onSave={handleSave} />
      </div>
    </Card>
  );
}