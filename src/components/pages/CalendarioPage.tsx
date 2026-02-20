import { useState } from "react";
import { Proyecto } from "../../types";
import { 
  Calendar as CalendarIcon, 
  Trophy, 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

interface CalendarioPageProps {
  proyectos: Proyecto[];
}

export function CalendarioPage({ proyectos }: CalendarioPageProps) {
  // Estado para controlar la fecha que se visualiza
  const [fechaVisualizacion, setFechaVisualizacion] = useState(new Date());
  
  const hoy = new Date();
  const mesActual = fechaVisualizacion.getMonth();
  const añoActual = fechaVisualizacion.getFullYear();

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // --- NAVEGACIÓN ---
  const irMesAnterior = () => {
    setFechaVisualizacion(new Date(añoActual, mesActual - 1, 1));
  };

  const irMesSiguiente = () => {
    setFechaVisualizacion(new Date(añoActual, mesActual + 1, 1));
  };

  const irHoy = () => {
    setFechaVisualizacion(new Date());
  };

  // --- LÓGICA DE FILTRADO ---
  const jamsDelMes = proyectos.filter(p => {
    const data = p as any;
    if (data.tipo !== 'jam' || !data.jamDeadline) return false;
    
    const fechaJam = new Date(data.jamDeadline);
    return fechaJam.getMonth() === mesActual && fechaJam.getFullYear() === añoActual;
  });

  const getJamsDia = (dia: number) => {
    return jamsDelMes.filter(p => new Date((p as any).jamDeadline).getDate() === dia);
  };

  // --- GENERACIÓN DE CUADRÍCULA ---
  const primerDiaMes = new Date(añoActual, mesActual, 1).getDay();
  const diasEnMes = new Date(añoActual, mesActual + 1, 0).getDate();
  const diasVacios = Array(primerDiaMes).fill(null);
  const diasMes = Array.from({ length: diasEnMes }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* HEADER CON NAVEGACIÓN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
            <CalendarIcon className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Agenda de Game Jams</h2>
            <p className="text-sm text-gray-500">Visualizando {meses[mesActual]} {añoActual}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 border rounded-xl shadow-sm">
          <button 
            onClick={irMesAnterior}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="Mes anterior"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={irHoy}
            className="px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
          >
            Hoy
          </button>

          <button 
            onClick={irMesSiguiente}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="Mes siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* CALENDARIO */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-7 mb-6 border-b border-gray-50 pb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
              <div key={d} className="text-center text-xs font-black text-gray-400 uppercase tracking-tighter">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
            {diasVacios.map((_, i) => (
              <div key={`empty-${i}`} className="bg-gray-50/40 min-h-[100px]" />
            ))}
            
            {diasMes.map(dia => {
              const jamsHoy = getJamsDia(dia);
              const esHoy = dia === hoy.getDate() && 
                            mesActual === hoy.getMonth() && 
                            añoActual === hoy.getFullYear();

              return (
                <div key={dia} className="bg-white min-h-[110px] p-2 transition-colors hover:bg-gray-50 group relative">
                  <span className={`text-xs font-bold ${
                    esHoy 
                    ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full' 
                    : 'text-gray-400'
                  }`}>
                    {dia}
                  </span>
                  
                  <div className="mt-2 space-y-1">
                    {jamsHoy.map(p => (
                      <div 
                        key={p.id} 
                        className="flex flex-col bg-amber-50 border-l-4 border-amber-500 p-1.5 rounded-r shadow-sm cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        <span className="text-[10px] font-black text-amber-700 truncate uppercase leading-none">
                          {p.concepto.titulo || 'Sin título'}
                        </span>
                        <div className="flex items-center gap-1 text-[9px] text-amber-600 mt-1">
                          <Clock size={10} />
                          {new Date((p as any).jamDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            Jams de {meses[mesActual]}
          </h3>
          
          <div className="space-y-3">
            {jamsDelMes.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <AlertCircle size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-medium">No hay entregas para este mes.</p>
              </div>
            ) : (
              jamsDelMes
                .sort((a, b) => new Date((a as any).jamDeadline).getTime() - new Date((b as any).jamDeadline).getTime())
                .map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-all border-l-4 border-l-indigo-500">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                        {new Date((p as any).jamDeadline).getDate()} {meses[mesActual].slice(0,3)}
                      </span>
                      <Trophy size={14} className="text-amber-400" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{p.concepto.titulo}</h4>
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      Finaliza {new Date((p as any).jamDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}