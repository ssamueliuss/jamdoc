import { useState } from "react";

type MenuItem = {
  id: string;
  icon: string;
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
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "proyectos", icon: "📋", label: "Proyectos" },
    { id: "calendario", icon: "🗓️", label: "Calendario" },
    { id: "tareas", icon: "✅", label: "Tareas" },
    { id: "apuntes", icon: "📌", label: "Apuntes" },
    { id: "ajustes", icon: "⚙️", label: "Ajustes" },
  ];

  return (
    <aside className={`bg-white border-r border-gray-200 ${/* desktop width */ ''} ${"h-screen"} ${"w-64"}`}>
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menú
        </h2>
        <nav className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (onChange) onChange(item.id);
                else setActivoInterno(item.id);
                if ((typeof (onChange) === 'function') && item.id) {
                  // noop
                }
                if ((typeof (onClose) === 'function')) {
                  onClose?.();
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition
                ${activo === item.id 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}