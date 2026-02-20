import { Card } from "../ui/Card";
import { Tarea } from "../../types";
import { CheckSquare } from "lucide-react";

interface TareasPendientesProps {
  tareas: Tarea[];
  onToggleTarea?: (id: number) => void;
}

export function TareasPendientes({ tareas, onToggleTarea }: TareasPendientesProps) {
  // Título con icono de Lucide
  const tituloConIcono = (
    <div className="flex items-center gap-2">
      <CheckSquare size={20} className="text-indigo-600" />
      <span>Tareas Pendientes</span>
    </div>
  );

  return (
    <Card titulo={tituloConIcono}>
      <div className="space-y-1">
        {tareas.map((tarea) => (
          <div 
            key={tarea.id}
            className="flex items-center gap-3 p-2 hover:bg-indigo-50/50 rounded-lg cursor-pointer transition-colors group"
            onClick={() => onToggleTarea?.(tarea.id)}
          >
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={tarea.completada}
                readOnly
                className="peer w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <span className={`text-sm transition-all duration-200 ${
              tarea.completada 
                ? 'line-through text-gray-400' 
                : 'text-gray-700 font-medium group-hover:text-indigo-900'
            }`}>
              {tarea.texto}
            </span>
          </div>
        ))}

        {tareas.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-gray-400 italic">No tienes tareas para hoy.</p>
          </div>
        )}
      </div>
    </Card>
  );
}