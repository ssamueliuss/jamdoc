import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  titulo?: string;
}

export function Card({ children, className = "", titulo }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      {titulo && <h3 className="text-lg font-semibold mb-4">{titulo}</h3>}
      {children}
    </div>
  );
}