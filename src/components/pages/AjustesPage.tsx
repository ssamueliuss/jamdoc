import { useEffect, useState, useRef } from "react";
import { OnboardingJamDoc } from "./OnboardingJamDoc";
import { useUser } from "../../context/UserContext";
import useDatabase from "../../hooks/useDatabase";
import { Database, Download, Upload, Trash2, AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";

// --- COMPONENTE DE MODAL DE SEGURIDAD ---
function SafetyModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "CONFIRMAR", 
  variant = "danger" 
}: any) {
  const [inputValue, setInputValue] = useState("");
  if (!isOpen) return null;

  const isVerified = inputValue === confirmText;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            <AlertTriangle size={24} />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
            Escribe "{confirmText}" para continuar
          </label>
          <input 
            type="text" 
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all font-mono"
            placeholder={confirmText}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
            Cancelar
          </button>
          <button 
            disabled={!isVerified}
            onClick={() => { onConfirm(); onClose(); setInputValue(""); }}
            className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
              isVerified 
                ? (variant === 'danger' ? 'bg-red-500 shadow-lg shadow-red-200' : 'bg-amber-500 shadow-lg shadow-amber-200') 
                : 'bg-gray-200 cursor-not-allowed'
            }`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export function AjustesPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { nombre, setNombre } = useUser();
  const { exportarDatos, importarDatos, resetBaseDeDatos } = useDatabase();

  // Estados para Modales
  const [modalImport, setModalImport] = useState({ open: false, file: null as File | null });
  const [modalReset, setModalReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const visto = localStorage.getItem("jamdoc_onboarding_visto");
    if (!visto) setShowOnboarding(true);
  }, []);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value);

  // --- ACCIONES ---

  const handleExport = async () => {
    try {
      await exportarDatos();
      toast.success("Datos guardados en /Descargas");
    } catch (error) {
      toast.error("Error al exportar");
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setModalImport({ open: true, file: e.target.files[0] });
    }
  };

  const handleConfirmImport = async () => {
    if (modalImport.file) {
      try {
        await importarDatos(modalImport.file);
        toast.success("Datos importados correctamente");
      } catch (error) {
        toast.error("Archivo inválido");
      }
    }
  };

  const handleConfirmReset = async () => {
    await resetBaseDeDatos();
    toast("JamDoc ha borrado todos los archivos", { icon: '🗑️', style: { background: '#EF4444', color: '#fff' } });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ajustes</h2>
      
      {/* SECCIÓN PERFIL */}
      <div className="bg-white p-4 rounded border space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre de usuario</label>
          <input
            className="border rounded px-3 py-1 w-full max-w-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            value={nombre}
            onChange={handleNombreChange}
            maxLength={24}
          />
        </div>
        <button className="text-indigo-600 hover:underline text-sm" onClick={() => setShowOnboarding(true)}>
          Ver guía de JamDoc
        </button>
      </div>

      {/* GESTIÓN DE DATOS */}
      <div className="bg-white p-4 rounded border space-y-6">
        <div className="flex items-center gap-2 border-b pb-2">
          <Database size={18} className="text-indigo-600" />
          <h3 className="font-bold text-gray-800">Gestión de Datos</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={handleExport} className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 transition-all text-left">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Download size={20} /></div>
            <div>
              <p className="text-sm font-bold text-gray-800">Crear Backup</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Descargar JSON</p>
            </div>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 transition-all text-left"
          >
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={onFileSelect} />
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Upload size={20} /></div>
            <div>
              <p className="text-sm font-bold text-gray-800">Restaurar Datos</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Subir archivo</p>
            </div>
          </button>
        </div>

        <div className="pt-2">
          <button 
            onClick={() => setModalReset(true)}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-xs font-bold opacity-80"
          >
            <Trash2 size={14} /> Borrar todos los datos (Reset de fábrica)
          </button>
        </div>
      </div>

      {/* MODALES DE SEGURIDAD */}
      <SafetyModal 
        isOpen={modalImport.open}
        title="¿Importar nuevos datos?"
        message="Esta acción reemplazará todos tus proyectos actuales por los del archivo de backup. No podrás deshacerlo."
        onClose={() => setModalImport({ open: false, file: null })}
        onConfirm={handleConfirmImport}
        variant="warning"
      />

      <SafetyModal 
        isOpen={modalReset}
        title="¿Borrar TODO permanentemente?"
        message="Estás a punto de eliminar absolutamente todos tus datos de JamDoc. Esto incluye proyectos, tareas y apuntes."
        onClose={() => setModalReset(false)}
        onConfirm={handleConfirmReset}
        variant="danger"
      />

      {showOnboarding && <OnboardingJamDoc onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}