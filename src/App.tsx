import { useState, useEffect } from "react";
import { UserProvider } from "./context/UserContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { StatsCards } from "./components/dashboard/StatsCards";
import { ProximasEntregas } from "./components/dashboard/ProximasEntregas";
import { TareasPendientes } from "./components/dashboard/TareasPendientes";
import { ApuntesRapidos } from "./components/dashboard/ApuntesRapidos";
import { NuevoProyectoModal } from "./components/proyectos/NuevoProyectoModal";
import { ExportMetadataModal } from "./components/proyectos/ExportMetadataModal";
import useDatabase from "./hooks/useDatabase";
import useToast from "./hooks/useToast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ConfirmModal from "./components/ui/ConfirmModal";
import { ProyectosPage } from "./components/pages/ProyectosPage";
import { CalendarioPage } from "./components/pages/CalendarioPage";
import { TareasPage } from "./components/pages/TareasPage";
import { ApuntesPage } from "./components/pages/ApuntesPage";
import { AjustesPage } from "./components/pages/AjustesPage";
import { ProjectDetailModal } from "./components/pages/ProjectDetailModal";
import { Toaster } from 'react-hot-toast';

function App() {
  // --- ESTADOS DE CARGA Y SPLASH ---
  const [isLoading, setIsLoading] = useState(true);

  // --- ESTADOS ORIGINALES ---
  const [modalAbierto, setModalAbierto] = useState(false);
  const [activo, setActivo] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { 
    proyectos, tareas, apuntes, estadisticas, 
    addProyecto, updateProyecto, addTarea, 
    updateTarea, addApunte, toggleTarea, 
    updateApunte, deleteProyecto, deleteTarea, deleteApunte 
  } = useDatabase();
  
  const { addToast } = useToast();
  const [proyectoEnEdicion, setProyectoEnEdicion] = useState<any | null>(null);

  // --- EFECTO DE SIMULACIÓN DE CARGA (5 SEGUNDOS) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // --- LÓGICA DE PROYECTOS Y TAREAS ---
  const handleGuardarProyecto = async (nuevoProyecto: any) => {
    if (nuevoProyecto.id) {
      await updateProyecto(nuevoProyecto.id, nuevoProyecto);
      setProyectoEnEdicion(null);
    } else {
      await addProyecto(nuevoProyecto);
    }
    setModalAbierto(false);
  };

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [projectToExport, setProjectToExport] = useState<any | null>(null);
  const [projectDetailOpen, setProjectDetailOpen] = useState(false);
  const [projectToView, setProjectToView] = useState<any | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalTitle] = useState<string>('');
  const [confirmModalMessage] = useState<string>('');
  const [confirmModalVariant] = useState<'error'|'info'|'success'>('info');

  const openExportModal = (p: any) => {
    setProjectToExport(p);
    setExportModalOpen(true);
  };

  const handleDeleteProject = async (p: any) => {
    try {
      await deleteProyecto(p.id);
      addToast('Proyecto eliminado', 'success');
      if (projectToView?.id === p.id) { setProjectDetailOpen(false); setProjectToView(null); }
    } catch (err) {
      console.error(err);
      addToast('Error eliminando proyecto', 'error');
    }
  };

  const handleDeleteTarea = async (id: number) => {
    try {
      await deleteTarea(id);
      addToast('Tarea eliminada', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error eliminando tarea', 'error');
    }
  };

  const handleDeleteApunte = async (id: number) => {
    try {
      await deleteApunte(id);
      addToast('Apunte eliminado', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error eliminando apunte', 'error');
    }
  };

  const handleToggleTarea = async (id: number) => {
    try {
      await toggleTarea(id);
      addToast('Tarea actualizada', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error actualizando tarea', 'error');
    }
  };

  const handleUpdateTarea = async (id: number, cambios: any) => {
    try {
      await updateTarea(id, cambios);
      addToast('Tarea guardada', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error guardando tarea', 'error');
    }
  };

  const handleAddTarea = async (t: any) => {
    try {
      const id = await addTarea(t);
      addToast('Tarea creada', 'success');
      return id;
    } catch (err) {
      console.error(err);
      addToast('Error creando tarea', 'error');
      throw err;
    }
  };

  const handleUpdateApunte = async (id: number, cambios: any) => {
    try {
      await updateApunte(id, cambios);
      addToast('Apunte actualizado', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error actualizando apunte', 'error');
    }
  };

  // --- GENERACIÓN DE PDF ---
  const generateProfessionalPDF = async (
    p: any,
    meta: { empresa: string; responsables: string; version: string; logoGame?: string | null; logoCompany?: string | null }
  ) => {
    const fecha = new Date().toLocaleDateString();
    const logoLeft = meta.logoGame ? `<img src="${meta.logoGame}" style="width:120px;height:120px;object-fit:contain;border-radius:8px;"/>` : `<div style="width:120px;height:120px;background:#eef2ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#4f46e5;">LOGO</div>`;
    const logoRight = meta.logoCompany ? `<img src="${meta.logoCompany}" style="width:100px;height:100px;object-fit:contain;border-radius:8px;"/>` : '';

    const content = `

      <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; color:#222; padding:40px; background:#fff; width:794px; box-sizing:border-box">

        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">

          <div>${logoLeft}</div>

          <div style="text-align:center;flex:1;margin:0 20px">

            <h1 style="font-size:28px;margin:4px 0">${p.concepto.titulo || 'Sin título'}</h1>

            <div style="color:#555;margin-top:6px;font-size:14px">Empresa: ${meta.empresa || '—'}</div>

            <div style="color:#555;font-size:14px">Responsable(s): ${meta.responsables || '—'}</div>

            <div style="color:#555;font-size:14px">Versión: ${meta.version || '1.0.0'} — Fecha: ${fecha}</div>

          </div>

          <div>${logoRight}</div>

        </div>



        <section style="margin-bottom:20px; page-break-inside:avoid">

          <h2 style="font-size:18px;border-bottom:1px solid #e6e6e6;padding-bottom:6px">Resumen ejecutivo</h2>

          <p style="color:#444;font-size:13px">${p.concepto.premisa || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Factor diferenciador:</strong> ${p.concepto.factorDiferenciador || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Géneros:</strong> ${(p.concepto.generos || []).join(', ')}</p>

        </section>



        <section style="margin-bottom:20px; page-break-inside:avoid">

          <h2 style="font-size:18px;border-bottom:1px solid #e6e6e6;padding-bottom:6px">1. Concepto</h2>

          <p style="color:#444;font-size:13px"><strong>Título:</strong> ${p.concepto.titulo || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Premisa:</strong> ${p.concepto.premisa || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Factor diferenciador:</strong> ${p.concepto.factorDiferenciador || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Géneros:</strong> ${(p.concepto.generos || []).join(', ')}</p>

          <p style="color:#444;font-size:13px"><strong>Inspiración:</strong> ${p.concepto.inspiracion || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Público objetivo:</strong> ${p.concepto.publicoObjetivo || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Plataformas:</strong> ${(p.concepto.plataformas || []).join(', ')}</p>

        </section>



        <section style="margin-bottom:20px; page-break-inside:avoid">

          <h2 style="font-size:18px;border-bottom:1px solid #e6e6e6;padding-bottom:6px">2. Narrativa</h2>

          <p style="color:#444;font-size:13px"><strong>Ambientación:</strong> ${p.narrativa?.ambientacion || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Historia principal:</strong> ${p.narrativa?.historiaPrincipal || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Historias secundarias:</strong> ${p.narrativa?.historiasSecundarias || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Protagonista:</strong> ${p.narrativa?.protagonista || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Personajes clave:</strong> ${p.narrativa?.personajesClave || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Tono:</strong> ${p.narrativa?.tonoHistoria || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Cómo se cuenta:</strong> ${p.narrativa?.comoSeCuenta || ''}</p>

        </section>



        <section style="margin-bottom:20px; page-break-inside:avoid">

          <h2 style="font-size:18px;border-bottom:1px solid #e6e6e6;padding-bottom:6px">3. Jugabilidad</h2>

          <p style="color:#444;font-size:13px"><strong>Objetivo principal:</strong> ${p.jugabilidad?.objetivoPrincipal || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Mecánicas centrales:</strong> ${p.jugabilidad?.mecanicasCentrales || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Controles:</strong> ${p.jugabilidad?.controles || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Cámara:</strong> ${p.jugabilidad?.camara || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Progresión:</strong> ${p.jugabilidad?.progresion || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Mundo y niveles:</strong> ${p.jugabilidad?.mundoYNiveles || ''}</p>

          <p style="color:#444;font-size:13px"><strong>IA:</strong> ${p.jugabilidad?.ia || ''}</p>

          <p style="color:#444;font-size:13px"><strong>Economía:</strong> ${p.jugabilidad?.economia || ''}</p>

        </section>



        <footer style="margin-top:40px;color:#999;font-size:12px;text-align:center">Documento generado por Jamdoc — versión ${meta.version}</footer>

      </div>

    `;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.innerHTML = content;
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`${(p.concepto.titulo || 'proyecto').replace(/[^a-z0-9\-]/gi, '_')}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      container.remove();
      setExportModalOpen(false);
    }
  };

  // --- VISTA SPLASH (RETORNO TEMPORAL) ---
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
      {/* El contenedor principal ya tiene items-center, lo cual centra todo el contenido hijo */}
      <div className="flex flex-col items-center animate-in fade-in duration-700">
        
        {/* Contenedor del Logo */}
        <div className="w-64 h-auto flex items-center justify-center mb-8">
           <img 
              src="/banner.png" 
              alt="Logo" 
              className="w-full h-auto object-contain" 
              onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=LOGO")} 
           />
        </div>

        {/* Sección de texto y barra */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-xl font-bold text-gray-800">Cargando Jamdoc</h2>
          
          {/* Barra de carga centrada */}
          <div className="mt-4 w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full animate-[loading_5s_ease-in-out]" />
          </div>
          
          <p className="mt-4 text-sm text-gray-500 font-medium tracking-wide">
            Preparando tu espacio de trabajo...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <UserProvider>
      <div className="flex h-screen bg-gray-50" style={{ minWidth: 970, minHeight: 650 }}>
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar activo={activo} onChange={setActivo} />
        </div>
        
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200">
              <Sidebar activo={activo} onChange={setActivo} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          <main className="flex-1 overflow-y-auto p-6">
            {activo === 'dashboard' && (
              <div className="space-y-6">
                <StatsCards stats={estadisticas} />
                <div className="grid grid-cols-2 gap-6">
                  <ProximasEntregas proyectos={proyectos} />
                  <TareasPendientes tareas={tareas} onToggleTarea={handleToggleTarea} />
                </div>
                <ApuntesRapidos apuntes={apuntes} proyectos={proyectos} addApunte={addApunte} />
              </div>
            )}

            {activo === 'proyectos' && (
              <ProyectosPage
                proyectos={proyectos}
                onOpenNuevo={() => { setProyectoEnEdicion(null); setModalAbierto(true); }}
                onEdit={(p) => { setProyectoEnEdicion(p); setModalAbierto(true); }}
                onExport={(p) => openExportModal(p)}
                onView={(p) => { setProjectToView(p); setProjectDetailOpen(true); }}
                onDelete={(p) => handleDeleteProject(p)}
              />
            )}

            {activo === 'calendario' && <CalendarioPage proyectos={proyectos} />}

            {activo === 'tareas' && (
              <TareasPage
                tareas={tareas}
                proyectos={proyectos}
                onToggleTarea={handleToggleTarea}
                onShowProject={(id) => {
                  const p = proyectos.find(pr => pr.id === id);
                  if (p) { setProjectToView(p); setProjectDetailOpen(true); }
                }}
                onDeleteTarea={(id) => handleDeleteTarea(id)}
              />
            )}

            {activo === 'apuntes' && (
              <ApuntesPage 
                apuntes={apuntes} 
                proyectos={proyectos} 
                onDeleteApunte={(id) => handleDeleteApunte(id)} 
                onUpdateApunte={(id, cambios) => handleUpdateApunte(id, cambios)} 
              />
            )}

            {activo === 'ajustes' && <AjustesPage />}
          </main>
        </div>

        {/* MODALES */}
        <NuevoProyectoModal
          isOpen={modalAbierto}
          onClose={() => { setModalAbierto(false); setProyectoEnEdicion(null); }}
          onSave={handleGuardarProyecto}
          initialData={proyectoEnEdicion}
        />

        <ExportMetadataModal
          isOpen={exportModalOpen}
          onClose={() => { setExportModalOpen(false); setProjectToExport(null); }}
          onConfirm={(meta) => { if (projectToExport) generateProfessionalPDF(projectToExport, meta); }}
        />

        <ConfirmModal
          isOpen={confirmModalOpen}
          title={confirmModalTitle}
          message={confirmModalMessage}
          variant={confirmModalVariant}
          onClose={() => setConfirmModalOpen(false)}
        />

        {projectToView && (
          <ProjectDetailModal
            isOpen={projectDetailOpen}
            onClose={() => { setProjectDetailOpen(false); setProjectToView(null); }}
            proyecto={projectToView}
            tareas={tareas}
            addTarea={handleAddTarea}
            updateTarea={handleUpdateTarea}
            deleteTarea={handleDeleteTarea}
          />
        )}

        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }} 
        />
        
      </div>
    </UserProvider>
  );
}

export default App;