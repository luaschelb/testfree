import * as React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import "../../shared_styles/BasicScreenContainer.css"
import { useGlobalSelectedProject } from '../../context/GlobalSelectedProjectContext';
import CountAndLinkCard from '../../components/CountAndLinkCard';
import TestProjectService from '../../services/TestProjectService';

export default function HomeScreen() {
  const { testProjects, selectedProject } = useGlobalSelectedProject();
  const [counts, setCounts] = React.useState({
    test_scenarios_count: 0,
    builds_count: 0,
    test_executions_count: 0,
    test_plans_count: 0
  });

  React.useEffect(() => {
    if (selectedProject !== 0) {
      TestProjectService.getTestProjectCounts(selectedProject)
        .then((data) => {
          setCounts(data);
        })
        .catch((error) => {
          console.error('Erro ao buscar os counts:', error);
        });
    }
  }, [selectedProject]); // Chama o useEffect quando o selectedProject mudar

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
              <span><b>Projeto Selecionado:</b> {testProjects.find((e) => (e.id === selectedProject))?.name}</span>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"}}>
                <CountAndLinkCard 
                  title="Cenários"
                  count={counts.test_scenarios_count}
                  route="/scenarios"
                />
                <CountAndLinkCard 
                  title="Builds"
                  count={counts.builds_count}
                  route="/builds"
                />
                <CountAndLinkCard 
                  title="Execuções"
                  count={counts.test_executions_count}
                  route="/execucoes"
                />
                <CountAndLinkCard 
                  title="Planos de Teste"
                  count={counts.test_plans_count}
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