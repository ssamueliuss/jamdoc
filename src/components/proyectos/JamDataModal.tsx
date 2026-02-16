import React from 'react';
import { Proyecto } from '../../types';

interface JamDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  proyecto: Proyecto | null;
}

export const JamDataModal: React.FC<JamDataModalProps> = ({ isOpen, onClose, proyecto }) => {
  if (!isOpen || !proyecto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-auto p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Datos de Jam — {proyecto.concepto.titulo}</h3>
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Cerrar</button>
        </div>

        <div className="mt-4 space-y-3">
          <div><strong>Fecha límite:</strong> {proyecto.jamDeadline ? new Date(proyecto.jamDeadline).toLocaleString() : '—'}</div>
          <div><strong>Progreso GDD:</strong> (ver en el proyecto)</div>
          <div><strong>Tareas vinculadas:</strong> TBD (filtrar por proyecto en la vista principal)</div>
          <div className="text-sm text-gray-600">Aquí se podrían mostrar métricas de participación, número de tareas completadas, notas relevantes y demás datos asociados a la Jam.</div>
        </div>
      </div>
    </div>
  );
};

export default JamDataModal;
