import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";

import ExecutionService from "../../services/ExecutionService";
import Execution from "../../models/Execution";
import TestCase from "../../models/TestCase";
import RunTestModal from "./RunTestModal";
import TestExecutionStatusEnum from "../../enums/TestExecutionStatusEnum";

const RunExecutionScreen = () => {
  const { selectedProject } = useGlobalSelectedProject();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [execution, setExecution] = useState<Execution>();
  const [description, setDescription] = useState<string>("");
  const [expandedScenarios, setExpandedScenarios] = useState<number[]>([]);
  const [shouldUpdateScreen, setShouldUpdateScreen] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState<{ open: boolean; testCase?: TestCase }>({
    open: false,
    testCase: undefined
  });

  const handleCloseModal = () => setOpenModal({ open: false, testCase: undefined });

  // Carrega execução
  useEffect(() => {
    async function queryData() {
      try {
        const executionData = await ExecutionService.getExecutionById(Number(id));
        setExecution(executionData);
        console.log(execution)
        setDescription(executionData.comments || "");
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar execução.");
      }
    }
    queryData();
  }, [selectedProject, shouldUpdateScreen, id]);

  const toggleScenario = (scenarioId: number) => {
    setExpandedScenarios(prev =>
      prev.includes(scenarioId) ? prev.filter(id => id !== scenarioId) : [...prev, scenarioId]
    );
  };

  // Função para finalizar execução
  const finaliza = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!execution) return;

    try {
      const dataHoraFormatada = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '');

      await ExecutionService.updateExecution({ ...execution, status: 2, end_date: dataHoraFormatada });
      alert("Execução de teste finalizada com sucesso!");
      setShouldUpdateScreen(true);
    } catch (error) {
      alert(`Erro: ${(error as Error).message}`);
    }
  };

  // Reativar execução
  const reativar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!execution) return;

    try {
      await ExecutionService.updateExecution({ ...execution, status: 1 });
      alert("Execução de teste reativada com sucesso!");
      setShouldUpdateScreen(true);
    } catch (error) {
      alert(`Erro: ${(error as Error).message}`);
    }
  };

  // Atualizar comentários
  const comments = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!execution) return;

    try {
      await ExecutionService.updateExecution({ ...execution, comments: description });
      alert("Comentários atualizados com sucesso!");
      setShouldUpdateScreen(true);
    } catch (error) {
      alert(`Erro: ${(error as Error).message}`);
    }
  };

  if (!execution) return <div>Carregando execução...</div>;

  // Função auxiliar para obter status de cada testCase
  const getTestCaseStatus = (testCaseId: number) : string => {
    const exec = execution.test_executions_test_cases?.find(e => e.test_case_id === testCaseId);
    if (!exec) return "Não executado";
    if (exec.passed) return "Sucesso";
    if (exec.failed) return "Com erros";
    if (exec.skipped) return "Pulado";
    return "Não executado";
  };

  // Função auxiliar para obter comentário do testCase
  const getTestCaseComment = (testCaseId: number) : string  => {
    const exec = execution.test_executions_test_cases?.find(e => e.test_case_id === testCaseId);
    return exec?.comment || "-";
  };

  return (
    <div className="BasicScreenContainer" style={{ backgroundColor: "#eee", padding: "16px", borderRadius: "8px", border: "solid 1px #222" }}>
      <div>
        <Link to="/execucoes">&lt; Voltar</Link>
        <h2 style={{ margin: "-33px 0 0 0", textAlign: "center" }}>Execução de Teste</h2>
      </div>

      <RunTestModal
        open={openModal.open}
        handleClose={handleCloseModal}
        testCase={openModal.testCase}
        execution={execution}
        setShouldUpdateScreen={setShouldUpdateScreen}
        originalStatus={openModal.testCase ? Number(getTestCaseStatus(openModal.testCase.id)) : 1}
        originalComment={openModal.testCase ? getTestCaseComment(openModal.testCase.id) : ''}
      />

      <div style={{ flexDirection: 'column', columnGap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <label><b>Plano de Teste:</b> {execution.test_plan?.name}</label>
            <label><b>Build:</b> {execution.build?.title}</label>
            <label><b>Status:</b> {TestExecutionStatusEnum[execution.status]}</label>
            {execution.status === 2 && <span style={{ marginRight: "12px" }}>Finalizada em: {execution.end_date}</span>}
          </div>
          <div>
            <Button variant="contained" color="primary" style={{ fontSize: "12px", marginRight: "8px" }} onClick={() => navigate(`/relatorios/${execution.id}`)}>
              Ver Relatório
            </Button>
            <Button
              variant="contained"
              color={execution.status === 2 ? "success" : "error"}
              disabled={execution.status === undefined}
              onClick={e => execution.status === 2 ? reativar(e) : finaliza(e)}
              style={{ fontSize: "12px" }}
            >
              {execution.status === 2 ? "Reativar Execução" : "Finalizar Execução"}
            </Button>
          </div>
        </div>

        <div>
          <label><b>Comentários:</b></label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: "100%", padding: "0.5em", height: "4em" }}
          />
        </div>

        <div>
          <Button variant="contained" color="info" style={{ fontSize: "14px" }} onClick={comments}>
            Salvar comentário
          </Button>
        </div>
      </div>

      <table className="styledTableAux">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cenário de Teste</th>
            <th>Não executados</th>
            <th>Sucesso</th>
            <th>Pulados</th>
            <th>Com erros</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {execution.scenarios.map(scenario => (
            <React.Fragment key={scenario.id}>
              <tr>
                <td>{scenario.id}</td>
                <td>{scenario.name}</td>
                <td>{scenario.testCases.filter(tc => getTestCaseStatus(tc.id) === "Não executado").length}</td>
                <td>{scenario.testCases.filter(tc => getTestCaseStatus(tc.id) === "Sucesso").length}</td>
                <td>{scenario.testCases.filter(tc => getTestCaseStatus(tc.id) === "Pulado").length}</td>
                <td>{scenario.testCases.filter(tc => getTestCaseStatus(tc.id) === "Com erros").length}</td>
                <td>
                  <button type="button" onClick={() => toggleScenario(scenario.id)}>
                    {expandedScenarios.includes(scenario.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </button>
                </td>
              </tr>

              {expandedScenarios.includes(scenario.id) && (
                <>
                  <tr className="styledTableAuxCollapsedHeader">
                    <td><b>ID</b></td>
                    <td><b>Nome</b></td>
                    <td><b>Descrição</b></td>
                    <td colSpan={2}><b>Comentários</b></td>
                    <td><b>Status</b></td>
                    <td><b>Ações</b></td>
                  </tr>
                  {scenario.testCases.map(tc => (
                    <tr key={tc.id} className="styledTableAuxCollapsedTR">
                      <td>{tc.id}</td>
                      <td>{tc.name}</td>
                      <td>{tc.description}</td>
                      <td colSpan={2}>{getTestCaseComment(tc.id)}</td>
                      <td>{getTestCaseStatus(tc.id)}</td>
                      <td>
                        <Tooltip title="Executar">
                          <IconButton aria-label="PlayArrow" color="success" onClick={() => setOpenModal({ open: true, testCase: tc })}>
                            <PlayArrow />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RunExecutionScreen;