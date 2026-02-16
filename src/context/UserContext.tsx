import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  nombre: string;
  setNombre: (n: string) => void;
}

const UserContext = createContext<UserContextType>({ nombre: "", setNombre: () => {} });

export function UserProvider({ children }: { children: ReactNode }) {
  const [nombre, setNombreState] = useState("");
  useEffect(() => {
    const guardado = localStorage.getItem("jamdoc_nombre_usuario");
    if (guardado) setNombreState(guardado);
  }, []);
  const setNombre = (n: string) => {
    setNombreState(n);
    localStorage.setItem("jamdoc_nombre_usuario", n);
  };
  return (
    <UserContext.Provider value={{ nombre, setNombre }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
