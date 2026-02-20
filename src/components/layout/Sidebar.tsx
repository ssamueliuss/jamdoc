import React, { useState } from "react";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Calendar, 
  CheckSquare, 
  StickyNote, 
  Settings 
} from 'lucide-react';

type MenuItem = {
  id: string;
  icon: React.ElementType;
  label: string;
};

type SidebarProps = {
  activo?: string;
  onChange?: (id: string) => void;
  mobile?: boolean;
  onClose?: () => void;
};

export function Sidebar({ activo: activoProp, onChange, onClose }: SidebarProps) {
  const [activoInterno, setActivoInterno] = useState("dashboard");
  const activo = activoProp ?? activoInterno;

  const menuItems: MenuItem[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "proyectos", icon: ClipboardList, label: "Proyectos" },
    { id: "calendario", icon: Calendar, label: "Calendario" },
    { id: "tareas", icon: CheckSquare, label: "Tareas" },
    { id: "apuntes", icon: StickyNote, label: "Apuntes" },
    { id: "ajustes", icon: Settings, label: "Ajustes" },
  ];

  return (
    <aside className="bg-white border-r border-gray-200 h-screen w-64">
      <div className="p-4">
        {/* Título del Sidebar */}
        <div className="mb-8 px-3">
          <h1 className="text-xl font-bold text-indigo-600 tracking-tight">JamDoc</h1>
        </div>

        <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menú principal
        </h2>

        <nav className="mt-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon; // Extraemos el componente para renderizarlo
            const isSelected = activo === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onChange) onChange(item.id);
                  else setActivoInterno(item.id);
                  
                  // Si se recibe una función de cierre (para móviles), ejecutarla
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${isSelected 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {/* Renderizado del icono SVG */}
                <Icon 
                  size={18} 
                  strokeWidth={isSelected ? 2.5 : 2} 
                  className={isSelected ? 'text-indigo-600' : 'text-gray-400'} 
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}