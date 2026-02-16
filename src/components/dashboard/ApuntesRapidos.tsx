import { Card } from "../ui/Card";
import { Apunte, Proyecto } from "../../types";
import { useState } from "react";
import { WhiteboardModal } from "../ui/WhiteboardModal";

interface ApuntesRapidosProps {
  apuntes: Apunte[];
  proyectos: Proyecto[];
  addApunte: (a: Partial<Apunte>) => Promise<number>;
}

export function ApuntesRapidos({ apuntes, proyectos, addApunte }: ApuntesRapidosProps) {
  const [whiteOpen, setWhiteOpen] = useState(false);
  const [projectForNote, setProjectForNote] = useState<number | null>(null);

  const openForProject = (id: number) => {
    setProjectForNote(id);
    setWhiteOpen(true);
  };

  const handleSave = async (dataUrl: string | null, note?: string) => {
    if (dataUrl && String(dataUrl).startsWith('data:image')) {
      await addApunte({ contenido: dataUrl, fecha: new Date(), etiqueta: note || undefined, proyectoId: projectForNote ?? undefined });
    } else if (note) {
      await addApunte({ contenido: note, fecha: new Date(), etiqueta: undefined, proyectoId: projectForNote ?? undefined });
    }
    setWhiteOpen(false);
    setProjectForNote(null);
  };

  return (
    <Card titulo="📌 Apuntes por Proyecto">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proyectos.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{p.concepto.titulo || 'Sin título'}</p>
                  <p className="text-sm text-gray-500">{p.concepto.generos.join(', ')}</p>
                </div>
                <div className="text-sm text-gray-600">{p.estado === 'en_progreso' ? 'En progreso' : 'Borrador'}</div>
              </div>

              <div className="mt-4">
                <button onClick={() => openForProject(p.id)} className="w-full px-3 py-2 bg-indigo-600 text-white rounded">Anotar apuntes</button>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-medium">Últimos apuntes</h4>
                <div className="mt-2 space-y-2">
                  {apuntes.filter(a => a.proyectoId === p.id).slice().reverse().slice(0,3).map(a => (
                    <div key={a.id} className="border rounded p-2 flex items-center gap-2">
                      {String(a.contenido).startsWith('data:image') ? (
                        <img src={a.contenido} alt="apunte" className="w-16 h-12 object-cover rounded" />
                      ) : (
                        <div className="text-sm text-gray-700">{String(a.contenido).slice(0,60)}</div>
                      )}
                      <div className="text-xs text-gray-400">{new Date(a.fecha).toLocaleDateString()}</div>
                    </div>
                  ))}
                  {apuntes.filter(a => a.proyectoId === p.id).length === 0 && (
                    <p className="text-sm text-gray-400">Sin apuntes aún.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <WhiteboardModal isOpen={whiteOpen} onClose={() => setWhiteOpen(false)} onSave={handleSave} />
      </div>
    </Card>
  );
}