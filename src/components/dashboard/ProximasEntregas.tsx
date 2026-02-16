import { Card } from "../ui/Card";
import { Proyecto } from "../../types";

interface ProximasEntregasProps {
  proyectos: Proyecto[];
}

export function ProximasEntregas({ proyectos }: ProximasEntregasProps) {
  // Por ahora, como no tenemos fechas de entrega en la nueva estructura,
  // usamos fechaModificacion como ejemplo (sin cálculo de días todavía)

  return (
    <Card titulo="📅 Proyectos Recientes">
      <div className="space-y-3">
        {proyectos.map((proyecto) => {
          // Usamos fechaModificacion como ejemplo, idealmente tendríamos fechaEntrega
          return (
            <div key={proyecto.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{proyecto.concepto.titulo}</p>
                <p className="text-sm text-gray-500">
                  {proyecto.concepto.generos.join(', ')}
                </p>
              </div>
              <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                proyecto.estado === 'en_progreso' 
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {proyecto.estado === 'en_progreso' ? 'En progreso' : 'Borrador'}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}