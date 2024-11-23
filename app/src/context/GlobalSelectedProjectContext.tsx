import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import TestProject from '../models/TestProject';
import TestProjectService from '../services/TestProjectService';

// Define o tipo do contexto
interface GlobalSelectedProjectContext {
  testProjects: TestProject[];
  setTestProjects: (newTestProjects: TestProject[]) => void;
  selectedProject: number;
  setSelectedProject: (newStatus: number) => void;
  shouldUpdateProjectList: boolean;
  setShouldUpdateProjectList: (shouldUpdateProjectList: boolean) => void;
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
  const [testProjects, setTestProjects] = useState<TestProject[]>([]);
  const [shouldUpdateProjectList, setShouldUpdateProjectList] = useState<boolean>(false);


  useEffect(() => {
      TestProjectService.getTestProjects().then((res) => {
          setTestProjects(res);
          if(res.length)
          {
            const storageId = parseInt(window.localStorage.getItem('selectedProject') as string)
            const foundProjectById = res.find((e, i) => e.id === storageId)
            if(foundProjectById === undefined) 
            {
              window.localStorage.setItem('selectedProject', `${res[0].id}`)
              setSelectedProject(res[0].id)
            }
            else
            {
              setSelectedProject(storageId)
            }
          }
          else
          {
            window.localStorage.removeItem('selectedProject')
            setSelectedProject(0)
          }
            
      });
      setShouldUpdateProjectList(false)
  }, [shouldUpdateProjectList, testProjects]);

  return (
    <GlobalStatusContext.Provider value={{ 
        selectedProject,
        setSelectedProject,
        testProjects,
        setTestProjects,
        shouldUpdateProjectList,
        setShouldUpdateProjectList
      }}>
      {children}
    </GlobalStatusContext.Provider>
  );
};
