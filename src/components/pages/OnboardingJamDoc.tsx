import { useState } from "react";

interface OnboardingJamDocProps {
  onClose: () => void;
}

export function OnboardingJamDoc({ onClose }: OnboardingJamDocProps) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "¡Bienvenido a JamDoc!",
      desc: "JamDoc es tu espacio para organizar proyectos, tareas, apuntes y más."
    },
    {
      title: "Proyectos",
      desc: "Crea y gestiona proyectos, exporta documentos y lleva el control de entregas."
    },
    {
      title: "Tareas y Apuntes",
      desc: "Organiza tus tareas pendientes y toma apuntes rápidos vinculados a tus proyectos."
    },
    {
      title: "Personalización",
      desc: "Desde Ajustes puedes cambiar tu nombre de usuario y ver este onboarding cuando quieras."
    }
  ];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">{steps[step].title}</h3>
        <p className="mb-4 text-gray-700">{steps[step].desc}</p>
        <div className="flex justify-between items-center">
          <button
            className="text-sm text-gray-500 hover:underline"
            onClick={onClose}
          >Saltar</button>
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-indigo-500' : 'bg-gray-300'}`}></span>
            ))}
          </div>
          {step < steps.length - 1 ? (
            <button
              className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
              onClick={() => setStep(s => s + 1)}
            >Siguiente</button>
          ) : (
            <button
              className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
              onClick={onClose}
            >¡Listo!</button>
          )}
        </div>
      </div>
    </div>
  );
}
