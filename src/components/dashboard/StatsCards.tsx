import { Card } from "../ui/Card";
import { Estadisticas } from "../../types";

interface StatsCardsProps {
  stats: Estadisticas;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="text-center">
          <p className="text-4xl font-bold">{stats.proyectosActivos}</p>
          <p className="text-sm opacity-90">Proyectos Activos</p>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <div className="text-center">
          <p className="text-4xl font-bold">{stats.jamsActivas}</p>
          <p className="text-sm opacity-90">Jams activas</p>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="text-center">
          <p className="text-4xl font-bold">{stats.tareasPendientes}</p>
          <p className="text-sm opacity-90">Tareas Pendientes</p>
        </div>
      </Card>
    </div>
  );
}