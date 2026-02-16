import { useState } from "react";

interface ExportMetadata {
  empresa: string;
  responsables: string;
  version: string;
  logoGame?: string | null;
  logoCompany?: string | null;
}

interface ExportMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ExportMetadata) => void;
}

export function ExportMetadataModal({ isOpen, onClose, onConfirm }: ExportMetadataModalProps) {
  const [empresa, setEmpresa] = useState("");
  const [responsables, setResponsables] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [logoGameDataUrl, setLogoGameDataUrl] = useState<string | null>(null);
  const [logoCompanyDataUrl, setLogoCompanyDataUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg w-[520px] p-6">
        <h3 className="text-lg font-semibold mb-2">Datos profesionales para exportación</h3>
        <p className="text-sm text-gray-500 mb-4">Rellena los datos que aparecerán en la portada del GDD.</p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Empresa desarrolladora</label>
            <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} className="w-full p-2 border rounded mt-1" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Responsable(s)</label>
            <input value={responsables} onChange={(e) => setResponsables(e.target.value)} className="w-full p-2 border rounded mt-1" placeholder="Nombre(s) y cargo(s)" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Versión del proyecto</label>
            <input value={version} onChange={(e) => setVersion(e.target.value)} className="w-full p-2 border rounded mt-1" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Logo del juego (imagen)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setLogoGameDataUrl(reader.result as string);
                reader.readAsDataURL(file);
              }}
              className="w-full p-1 mt-1"
            />
            {logoGameDataUrl && <img src={logoGameDataUrl} alt="logo juego" className="w-20 mt-2" />}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Logo de la empresa (imagen)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setLogoCompanyDataUrl(reader.result as string);
                reader.readAsDataURL(file);
              }}
              className="w-full p-1 mt-1"
            />
            {logoCompanyDataUrl && <img src={logoCompanyDataUrl} alt="logo empresa" className="w-20 mt-2" />}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancelar</button>
          <button
            onClick={() => onConfirm({ empresa, responsables, version, logoGame: logoGameDataUrl, logoCompany: logoCompanyDataUrl })}
            className="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}
