import { useEffect, useState } from "react";
import { SeccionConcepto, SeccionNarrativa, SeccionJugabilidad, Proyecto } from "../../types";

interface NuevoProyectoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (proyecto: any) => void;
  initialData?: Proyecto | null;
}

type SeccionActual = 'concepto' | 'narrativa' | 'jugabilidad';

export function NuevoProyectoModal({ isOpen, onClose, onSave, initialData }: NuevoProyectoModalProps) {
  const [seccionActual, setSeccionActual] = useState<SeccionActual>('concepto');
  const [progreso, setProgreso] = useState({ concepto: 0, narrativa: 0, jugabilidad: 0 });

  // Estado para cada sección (inicialmente vacío)
  const [concepto, setConcepto] = useState<SeccionConcepto>({
    titulo: "",
    premisa: "",
    factorDiferenciador: "",
    generos: [],
    inspiracion: "",
    publicoObjetivo: "",
    plataformas: [],
  });

  const [narrativa, setNarrativa] = useState<SeccionNarrativa>({
    ambientacion: "",
    historiaPrincipal: "",
    historiasSecundarias: "",
    protagonista: "",
    personajesClave: "",
    tonoHistoria: "",
    comoSeCuenta: "",
  });

  const [jugabilidad, setJugabilidad] = useState<SeccionJugabilidad>({
    objetivoPrincipal: "",
    mecanicasCentrales: "",
    controles: "",
    camara: "",
    progresion: "",
    mundoYNiveles: "",
    ia: "",
    economia: "",
  });

  const [tipo, setTipo] = useState<'personal'|'jam'>('personal');
  const [jamDeadline, setJamDeadline] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setConcepto({ ...(initialData.concepto as SeccionConcepto) });
      setNarrativa({ ...(initialData.narrativa as SeccionNarrativa) });
      setJugabilidad({ ...(initialData.jugabilidad as SeccionJugabilidad) });
      setProgreso({
        concepto: calcularProgreso(initialData.concepto),
        narrativa: calcularProgreso(initialData.narrativa),
        jugabilidad: calcularProgreso(initialData.jugabilidad),
      });
      // establecer tipo y jamDeadline si existen
      if ((initialData as any).tipo) setTipo((initialData as any).tipo);
      if ((initialData as any).jamDeadline) setJamDeadline(new Date((initialData as any).jamDeadline).toISOString().slice(0,16));
    } else {
      setConcepto({
        titulo: "",
        premisa: "",
        factorDiferenciador: "",
        generos: [],
        inspiracion: "",
        publicoObjetivo: "",
        plataformas: [],
      });
      setNarrativa({
        ambientacion: "",
        historiaPrincipal: "",
        historiasSecundarias: "",
        protagonista: "",
        personajesClave: "",
        tonoHistoria: "",
        comoSeCuenta: "",
      });
      setJugabilidad({
        objetivoPrincipal: "",
        mecanicasCentrales: "",
        controles: "",
        camara: "",
        progresion: "",
        mundoYNiveles: "",
        ia: "",
        economia: "",
      });
      setProgreso({ concepto: 0, narrativa: 0, jugabilidad: 0 });
    }
  }, [isOpen, initialData]);

  // Calcular progreso de cada sección
  const calcularProgreso = (obj: any) => {
    const campos = Object.values(obj);
    const completados = campos.filter(c => 
      typeof c === 'string' ? c.trim() !== '' : 
      Array.isArray(c) ? c.length > 0 : false
    ).length;
    return Math.round((completados / campos.length) * 100);
  };

  const actualizarProgreso = (seccion: SeccionActual, datos: any) => {
    const nuevoProgreso = calcularProgreso(datos);
    setProgreso(prev => ({ ...prev, [seccion]: nuevoProgreso }));
  };

  const handleChangeConcepto = (campo: keyof SeccionConcepto, valor: any) => {
    const nuevos = { ...concepto, [campo]: valor };
    setConcepto(nuevos);
    actualizarProgreso('concepto', nuevos);
  };

  const handleChangeNarrativa = (campo: keyof SeccionNarrativa, valor: string) => {
    const nuevos = { ...narrativa, [campo]: valor };
    setNarrativa(nuevos);
    actualizarProgreso('narrativa', nuevos);
  };

  const handleChangeJugabilidad = (campo: keyof SeccionJugabilidad, valor: string) => {
    const nuevos = { ...jugabilidad, [campo]: valor };
    setJugabilidad(nuevos);
    actualizarProgreso('jugabilidad', nuevos);
  };

  const handleGuardar = () => {
    const payload: any = {
      concepto,
      narrativa,
      jugabilidad,
      tipo,
      jamDeadline: tipo === 'jam' && jamDeadline ? new Date(jamDeadline) : null,
      fechaModificacion: new Date(),
      estado: 'borrador'
    };
    if (initialData && (initialData as any).id) {
      payload.id = (initialData as any).id;
      payload.fechaCreacion = initialData.fechaCreacion;
    } else {
      payload.fechaCreacion = new Date();
    }
    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  const secciones = [
    { id: 'concepto', nombre: 'Concepto General', progreso: progreso.concepto },
    { id: 'narrativa', nombre: 'Narrativa', progreso: progreso.narrativa },
    { id: 'jugabilidad', nombre: 'Jugabilidad', progreso: progreso.jugabilidad },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">{initialData ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
          <p className="text-gray-600 text-sm mt-1">
            Completa las secciones del GDD. Puedes dejar campos vacíos y modificarlos después.
          </p>
        </div>

        {/* Barra de progreso de secciones */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {secciones.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSeccionActual(sec.id as SeccionActual)}
                className={`flex-1 p-2 rounded-lg border transition ${
                  seccionActual === sec.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium">{sec.nombre}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-gray-200 rounded">
                    <div 
                      className="h-1 bg-indigo-600 rounded" 
                      style={{ width: `${sec.progreso}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{sec.progreso}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido (formulario) */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Sección 1: Concepto */}
          {seccionActual === 'concepto' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Cuál es el título del juego?
                </label>
                <input
                  type="text"
                  value={concepto.titulo}
                  onChange={(e) => handleChangeConcepto('titulo', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: Pixel Hero"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de proyecto</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="tipo" value="personal" checked={tipo==='personal'} onChange={() => setTipo('personal')} />
                    <span className="text-sm">Personal</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="tipo" value="jam" checked={tipo==='jam'} onChange={() => setTipo('jam')} />
                    <span className="text-sm">Jam</span>
                  </label>
                </div>
              </div>

              {tipo === 'jam' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite (fecha y hora)</label>
                  <input type="datetime-local" value={jamDeadline} onChange={(e) => setJamDeadline(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Premisa (una frase)
                </label>
                <input
                  type="text"
                  value={concepto.premisa}
                  onChange={(e) => handleChangeConcepto('premisa', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: Es como 'Los Increíbles' pero en un juego de gestión de oficina de héroes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Factor Diferenciador
                </label>
                <textarea
                  value={concepto.factorDiferenciador}
                  onChange={(e) => handleChangeConcepto('factorDiferenciador', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="¿Qué hace único a tu juego?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género/s
                </label>
                <input
                  type="text"
                  value={concepto.generos.join(', ')}
                  onChange={(e) => handleChangeConcepto('generos', e.target.value.split(',').map(g => g.trim()))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: RPG, Aventura, Plataformas (separado por comas)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inspiración principal
                </label>
                <input
                  type="text"
                  value={concepto.inspiracion}
                  onChange={(e) => handleChangeConcepto('inspiracion', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: Hollow Knight, Studio Ghibli, Dune"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Público objetivo
                </label>
                <input
                  type="text"
                  value={concepto.publicoObjetivo}
                  onChange={(e) => handleChangeConcepto('publicoObjetivo', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: Jugadores casuales de 15-25 años"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plataformas
                </label>
                <input
                  type="text"
                  value={concepto.plataformas.join(', ')}
                  onChange={(e) => handleChangeConcepto('plataformas', e.target.value.split(',').map(p => p.trim()))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: PC, Switch, Móvil (separado por comas)"
                />
              </div>
            </div>
          )}

          {/* Sección 2: Narrativa */}
          {seccionActual === 'narrativa' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ambientación (dónde y cuándo)
                </label>
                <textarea
                  value={narrativa.ambientacion}
                  onChange={(e) => handleChangeNarrativa('ambientacion', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Ej: En un futuro cyberpunk, en la ciudad de Neo-Tokio..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Historia principal
                </label>
                <textarea
                  value={narrativa.historiaPrincipal}
                  onChange={(e) => handleChangeNarrativa('historiaPrincipal', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Sinopsis de la historia principal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Historias secundarias
                </label>
                <textarea
                  value={narrativa.historiasSecundarias}
                  onChange={(e) => handleChangeNarrativa('historiasSecundarias', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Misiones secundarias, tramas paralelas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Protagonista
                </label>
                <textarea
                  value={narrativa.protagonista}
                  onChange={(e) => handleChangeNarrativa('protagonista', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Historia, personalidad, motivaciones, apariencia..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personajes clave
                </label>
                <textarea
                  value={narrativa.personajesClave}
                  onChange={(e) => handleChangeNarrativa('personajesClave', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Aliados, antagonistas, mentores..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tono de la historia
                </label>
                <input
                  type="text"
                  value={narrativa.tonoHistoria}
                  onChange={(e) => handleChangeNarrativa('tonoHistoria', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: Serio, humorístico, épico, oscuro..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Cómo se cuenta la historia?
                </label>
                <textarea
                  value={narrativa.comoSeCuenta}
                  onChange={(e) => handleChangeNarrativa('comoSeCuenta', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Cinemáticas, diálogos, textos, entorno, notas..."
                />
              </div>
            </div>
          )}

          {/* Sección 3: Jugabilidad */}
          {seccionActual === 'jugabilidad' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objetivo Principal
                </label>
                <textarea
                  value={jugabilidad.objetivoPrincipal}
                  onChange={(e) => handleChangeJugabilidad('objetivoPrincipal', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                  placeholder="¿Cuál es el objetivo final del juego?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mecánicas Centrales (Core Loop)
                </label>
                <textarea
                  value={jugabilidad.mecanicasCentrales}
                  onChange={(e) => handleChangeJugabilidad('mecanicasCentrales', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Ej: Explora > Enfrenta enemigos > Obtén recompensas > Mejora personaje..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Controles
                </label>
                <textarea
                  value={jugabilidad.controles}
                  onChange={(e) => handleChangeJugabilidad('controles', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Teclado/ratón, gamepad, táctil. Mapa de controles..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cámara
                </label>
                <input
                  type="text"
                  value={jugabilidad.camara}
                  onChange={(e) => handleChangeJugabilidad('camara', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: Primera persona, tercera persona, 2D lateral..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progresión
                </label>
                <textarea
                  value={jugabilidad.progresion}
                  onChange={(e) => handleChangeJugabilidad('progresion', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="¿Cómo mejora o avanza el jugador?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mundo y Niveles
                </label>
                <textarea
                  value={jugabilidad.mundoYNiveles}
                  onChange={(e) => handleChangeJugabilidad('mundoYNiveles', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Estructura del mundo, estética, feeling de cada área..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IA (Inteligencia Artificial)
                </label>
                <textarea
                  value={jugabilidad.ia}
                  onChange={(e) => handleChangeJugabilidad('ia', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Comportamiento de enemigos y aliados..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Economía del Juego
                </label>
                <textarea
                  value={jugabilidad.economia}
                  onChange={(e) => handleChangeJugabilidad('economia', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Monedas, recursos, cómo se obtienen y gastan..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <div className="flex gap-2">
            {seccionActual !== 'concepto' && (
              <button
                onClick={() => {
                  const index = secciones.findIndex(s => s.id === seccionActual);
                  setSeccionActual(secciones[index - 1].id as SeccionActual);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                ← Anterior
              </button>
            )}
            {seccionActual !== 'jugabilidad' ? (
              <button
                onClick={() => {
                  const index = secciones.findIndex(s => s.id === seccionActual);
                  setSeccionActual(secciones[index + 1].id as SeccionActual);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleGuardar}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Guardar Proyecto
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}