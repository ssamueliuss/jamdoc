
import { useEffect, useState } from "react";
import { OnboardingJamDoc } from "./OnboardingJamDoc";
import { useUser } from "../../context/UserContext";

export function AjustesPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { nombre, setNombre } = useUser();

  useEffect(() => {
    const visto = localStorage.getItem("jamdoc_onboarding_visto");
    if (!visto) setShowOnboarding(true);
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem("jamdoc_onboarding_visto", "1");
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ajustes</h2>
      <div className="bg-white p-4 rounded border space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre de usuario</label>
          <input
            className="border rounded px-3 py-1 w-full max-w-xs"
            value={nombre}
            onChange={handleNombreChange}
            placeholder="Tu nombre o apodo"
            maxLength={24}
          />
          <p className="text-xs text-gray-500 mt-1">Este nombre se usará para mostrar tu inicial en el Header.</p>
        </div>
        <button
          className="text-indigo-600 hover:underline text-sm"
          onClick={() => setShowOnboarding(true)}
        >Ver guía de JamDoc</button>
      </div>
      {showOnboarding && <OnboardingJamDoc onClose={handleOnboardingClose} />}
    </div>
  );
}
