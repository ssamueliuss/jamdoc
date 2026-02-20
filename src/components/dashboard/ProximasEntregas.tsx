import { Card } from "../ui/Card";
import { Proyecto } from "../../types";
import { Calendar } from "lucide-react";

interface ProximasEntregasProps {
  proyectos: Proyecto[];
}

export function ProximasEntregas({ proyectos }: ProximasEntregasProps) {
  // Título con el icono de Lucide en color índigo/morado
  const tituloConIcono = (
    <div className="flex items-center gap-2">
      <Calendar size={18} className="text-indigo-600" />
      <span>Proyectos Recientes</span>
    </div>
  );

  return (
    <Card titulo={tituloConIcono}>
      <div className="space-y-3">
        {proyectos.map((proyecto) => {
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