import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define o tipo do contexto
interface GlobalSelectedProjectContext {
  selectedProject: number;
  setSelectedProject: (newStatus: number) => void;
}

// Cria o contexto com um valor padrão
const GlobalStatusContext = createContext<GlobalSelectedProjectContext | undefined>(undefined);

// Hook para acessar o contexto
export const useGlobalSelectedProject = () => {
  const context = useContext(GlobalStatusContext);
  if (!context) {
    throw new Error("useGlobalStatus deve ser usado dentro de um GlobalStatusProvider");
  }
  return context;
};

// Provedor do contexto que envolve a aplicação
export const GlobalSelectedProjectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProject, setSelectedProject] = useState<number>(window.localStorage.getItem('selectedProject') === null ? 0 : parseInt(window.localStorage.getItem('selectedProject') as string));

  return (
    <GlobalStatusContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </GlobalStatusContext.Provider>
  );
};
