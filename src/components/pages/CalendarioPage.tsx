import { Proyecto } from "../../types";

interface CalendarioPageProps {
  proyectos: Proyecto[];
}

export function CalendarioPage({ proyectos }: CalendarioPageProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Calendario</h2>
      <p className="text-sm text-gray-500">Vista simple de calendario — por ahora mostramos proyectos y su fecha de modificación.</p>

      <div className="space-y-2">
        {proyectos.map((p) => (
          <div key={p.id} className="bg-white p-3 rounded border flex justify-between">
            <div>
              <div className="font-medium">{p.concepto.titulo || 'Sin título'}</div>
              <div className="text-xs text-gray-500">Modificado: {p.fechaModificacion.toLocaleDateString()}</div>
            </div>
            <div className="text-sm text-gray-600">{p.estado}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
