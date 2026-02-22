import { useEffect, useRef, useState } from "react";
import { Save, X, Trash2, Download, Type, Pencil } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // 1. Importar toast

interface WhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string | null, note?: string) => void;
}

export function WhiteboardModal({ isOpen, onClose, onSave }: WhiteboardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState('#4f46e5');
  const [size, setSize] = useState(3);
  const [note, setNote] = useState('');
  const [hasDrawing, setHasDrawing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current!;
    const ratio = window.devicePixelRatio || 1;
    
    canvas.width = 460 * ratio; 
    canvas.height = 200 * ratio; 
    canvas.style.width = '100%';
    canvas.style.height = '200px';
    
    const ctx = canvas.getContext('2d')!;
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctxRef.current = ctx;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width / ratio, canvas.height / ratio);
    setHasDrawing(false);
  }, [isOpen]);

  useEffect(() => {
    if (ctxRef.current) ctxRef.current.strokeStyle = color;
  }, [color]);

  useEffect(() => {
    if (ctxRef.current) ctxRef.current.lineWidth = size;
  }, [size]);

  if (!isOpen) return null;

  const getPos = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const start = (e: any) => {
    drawing.current = true;
    setHasDrawing(true);
    const pos = getPos(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(pos.x, pos.y);
  };

  const move = (e: any) => {
    if (!drawing.current) return;
    const pos = getPos(e);
    ctxRef.current?.lineTo(pos.x, pos.y);
    ctxRef.current?.stroke();
  };

  const end = () => {
    ctxRef.current?.closePath();
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    toast('Pizarra limpia', { icon: '🧹' }); // Toast informativo
  };

  const handleExport = () => {
    try {
      const link = document.createElement('a');
      link.href = canvasRef.current!.toDataURL();
      link.download = `boceto-${Date.now()}.png`;
      link.click();
      
      // 2. Toast de exportación exitosa
      toast.success('Imagen exportada correctamente', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    } catch (error) {
      toast.error('Error al exportar la imagen');
    }
  };

  const handleSaveAll = () => {
    const canvas = canvasRef.current!;
    const dataUrl = hasDrawing ? canvas.toDataURL('image/png') : null;
    
    onSave(dataUrl, note.trim() || undefined);
    
    // 3. Toast de guardado exitoso
    toast.success('Apunte guardado en el proyecto', {
      icon: '📝',
      duration: 3000
    });

    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
      {/* El Toaster puede ir aquí o en App.tsx */}
      <Toaster position="top-right" /> 
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
        
        {/* Cabecera */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <Type size={16} className="text-indigo-600" /> Nuevo Apunte
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Contenido del apunte</label>
            <textarea 
              autoFocus
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              className="w-full p-4 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none resize-none transition-all text-sm min-h-[100px]" 
              placeholder="Escribe tu idea aquí..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Pencil size={10} /> Boceto opcional
              </label>
              <div className="flex gap-3 items-center bg-slate-100 px-3 py-1 rounded-full">
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  className="w-4 h-4 rounded-full cursor-pointer bg-transparent border-none"
                />
                <input 
                  type="range" 
                  min={1} max={10} 
                  value={size} 
                  onChange={(e) => setSize(Number(e.target.value))} 
                  className="w-16 h-1 accent-indigo-600"
                />
                <button onClick={clear} title="Borrar dibujo" className="text-slate-500 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 touch-none">
              <canvas
                ref={canvasRef}
                onMouseDown={start}
                onMouseMove={move}
                onMouseUp={end}
                onMouseLeave={end}
                onTouchStart={start}
                onTouchMove={move}
                onTouchEnd={end}
                className="cursor-crosshair"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
          <button 
            onClick={handleExport}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-colors"
          >
            <Download size={14} /> Exportar dibujo
          </button>

          <button 
            onClick={handleSaveAll} 
            disabled={!note.trim() && !hasDrawing}
            className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center transition-all active:scale-95"
          >
            <Save size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}