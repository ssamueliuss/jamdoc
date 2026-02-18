import { useEffect, useRef, useState } from "react";

interface WhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string | null, note?: string) => void;
}

export function WhiteboardModal({ isOpen, onClose, onSave }: WhiteboardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current!;
    const ratio = window.devicePixelRatio || 1;
    // Make the canvas half the previous size so the modal fits better on screen
    canvas.width = 460 * ratio; // half of 794
    canvas.height = 256 * ratio; // half of 1122
    canvas.style.width = '460px';
    canvas.style.height = '256px';
    const ctx = canvas.getContext('2d')!;
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctxRef.current = ctx;
    // clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width / ratio, canvas.height / ratio);
  }, [isOpen]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
    }
  }, [color]);

  useEffect(() => {
    if (ctxRef.current) ctxRef.current.lineWidth = size;
  }, [size]);

  if (!isOpen) return null;

  const getPos = (e: PointerEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = (e as any).clientX ?? ((e as TouchEvent).touches?.[0]?.clientX);
    const clientY = (e as any).clientY ?? ((e as TouchEvent).touches?.[0]?.clientY);
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const start = (e: any) => {
    drawing.current = true;
    const pos = getPos(e);
    const ctx = ctxRef.current!;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
  };

  const move = (e: any) => {
    if (!drawing.current) return;
    const pos = getPos(e);
    const ctx = ctxRef.current!;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    e.preventDefault();
  };

  const end = (e: any) => {
    if (!drawing.current) return;
    const ctx = ctxRef.current!;
    ctx.closePath();
    drawing.current = false;
    e.preventDefault();
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
  };

  const handleSave = () => {
    const canvas = canvasRef.current!;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl, note.trim() || undefined);
    setNote('');
  };

  const handleSaveNoteOnly = () => {
    onSave(null, note.trim() || undefined);
    setNote('');
  };

  const handleExportImage = () => {
    const canvas = canvasRef.current!;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `apunte-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 py-10">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-[90vw] max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Pizarra virtual</h3>
          <div className="flex gap-2">
            <button onClick={clear} className="px-3 py-1 border rounded">Limpiar</button>
            <button onClick={onClose} className="px-3 py-1 border rounded">Cerrar</button>
          </div>
        </div>

        <div className="flex gap-3 mb-2 items-center">
          <label className="text-sm">Color:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <label className="text-sm">Tamaño:</label>
          <input type="range" min={1} max={20} value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </div>

        <div className="border">
          <canvas
            ref={canvasRef}
            onMouseDown={(e) => start(e.nativeEvent)}
            onMouseMove={(e) => move(e.nativeEvent)}
            onMouseUp={(e) => end(e.nativeEvent)}
            onMouseLeave={(e) => end(e.nativeEvent)}
            onTouchStart={(e) => start(e.nativeEvent)}
            onTouchMove={(e) => move(e.nativeEvent)}
            onTouchEnd={(e) => end(e.nativeEvent)}
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm">Nota (opcional)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full p-2 border rounded mt-1" placeholder="Resumen o título para este apunte" />
        </div>

        <div className="mt-3 flex justify-between items-center">
          <div className="flex gap-2">
            <button onClick={handleExportImage} className="px-3 py-1 border rounded">Exportar imagen</button>
            <button onClick={handleSaveNoteOnly} className="px-3 py-1 border rounded">Guardar nota (texto)</button>
          </div>
          <div>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded">Guardar apunte</button>
          </div>
        </div>
      </div>
    </div>
  );
}
