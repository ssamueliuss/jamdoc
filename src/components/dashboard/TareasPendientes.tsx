import { Card } from "../ui/Card";
import { Tarea } from "../../types";

interface TareasPendientesProps {
  tareas: Tarea[];
  onToggleTarea?: (id: number) => void;
}

export function TareasPendientes({ tareas, onToggleTarea }: TareasPendientesProps) {
  return (
    <Card titulo="✅ Tareas Pendientes">
      <div className="space-y-2">
        {tareas.map((tarea) => (
          <div key={tarea.id}
               className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
               onClick={() => onToggleTarea?.(tarea.id)}>
            <input
              type="checkbox"
              checked={tarea.completada}
              readOnly
              className="w-4 h-4 text-indigo-600"
            />
            <span className={`${tarea.completada ? 'line-through text-gray-400' : ''}`}>
              {tarea.texto}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}