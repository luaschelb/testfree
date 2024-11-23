import * as React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import "../../shared_styles/BasicScreenContainer.css"
import { useGlobalSelectedProject } from '../../context/GlobalSelectedProjectContext';
import CountAndLinkCard from '../../components/CountAndLinkCard';

export default function HomeScreen() {
  const { testProjects, selectedProject } = useGlobalSelectedProject();
  return (
    <div>
      <div className="BasicScreenContainer">
        <div style={{fontSize: '2em'}}>Página Inicial</div>
        {
          selectedProject === 0 ?
            <p>Não foi encontrado nenhum projeto. Crie um para iniciar o uso da aplicação</p> : null
        }
        <CountAndLinkCard 
          title="Projetos"
          count={testProjects.length}
          route="/projetos"
        />
        {
          selectedProject === 0 ? null : (
            <>
              <span><b>Projeto Selecionado:</b> {testProjects.find((e, i) => (e.id === selectedProject))?.name}</span>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"}}>
                <CountAndLinkCard 
                  title="Cenários"
                  count={4}
                  route="/scenarios"
                />
                <CountAndLinkCard 
                  title="Builds"
                  count={4}
                  route="/builds"
                />
                <CountAndLinkCard 
                  title="Execuções"
                  count={4}
                  route="/execucoes"
                />
                <CountAndLinkCard 
                  title="Planos de Teste"
                  count={4}
                  route="/testplans"
                />
              </div>
            </>
          )
        }
      </div>
    </div>
  );
}
