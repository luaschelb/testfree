import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define o tipo do contexto
interface GlobalStatusContextType {
  status: number;
  setStatus: (newStatus: number) => void;
}

// Cria o contexto com um valor padrão
const GlobalStatusContext = createContext<GlobalStatusContextType | undefined>(undefined);

// Hook para acessar o contexto
export const useGlobalStatus = () => {
  const context = useContext(GlobalStatusContext);
  if (!context) {
    throw new Error("useGlobalStatus deve ser usado dentro de um GlobalStatusProvider");
  }
  return context;
};

// Provedor do contexto que envolve a aplicação
export const GlobalStatusProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<number>(0);

  return (
    <GlobalStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </GlobalStatusContext.Provider>
  );
};
