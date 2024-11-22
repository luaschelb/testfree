import { useEffect, useState } from "react";
import TestPlanService from "../../services/TestPlanService";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import Checkbox from "@mui/material/Checkbox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React from "react";
import TestScenarioService from "../../services/TestScenarioService";
import TestScenario from "../../models/TestScenario";
import "./CreateTestPlanScreen.css";
import { Button } from "@mui/material";

const CreateTestPlanScreen = () => {
  const { selectedProject } = useGlobalSelectedProject();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedTestCases, setSelectedTestCases] = useState<number[]>([]);
  const [testScenarios, setTestScenarios] = useState<TestScenario[]>([]);
  const [expandedScenarios, setExpandedScenarios] = useState<number[]>([]);
  const [allExpanded, setAllExpanded] = useState<boolean>(true);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  useEffect(() => {
    TestScenarioService.getTestScenariosEagerLoading(selectedProject).then(
      (data) => {
        setTestScenarios(data);
        const allScenarioIds = data.map((scenario) => scenario.id);
        setExpandedScenarios(allScenarioIds);
      }
    );
  }, [selectedProject]);

  const toggleScenario = (scenarioId: number) => {
    if (expandedScenarios.includes(scenarioId)) {
      setExpandedScenarios(expandedScenarios.filter((id) => id !== scenarioId));
    } else {
      setExpandedScenarios([...expandedScenarios, scenarioId]);
    }
  };

  const toggleAllScenarios = () => {
    if (allExpanded) {
      setExpandedScenarios([]);
    } else {
      const allScenarioIds = testScenarios.map((scenario) => scenario.id);
      setExpandedScenarios(allScenarioIds);
    }
    setAllExpanded(!allExpanded);
  };

  const toggleTestCaseSelection = (testCaseId: number) => {
    if (selectedTestCases.includes(testCaseId)) {
      setSelectedTestCases(selectedTestCases.filter((id) => id !== testCaseId));
    } else {
      setSelectedTestCases([...selectedTestCases, testCaseId]);
    }
  };

  const toggleAllTestCases = () => {
    if (allSelected) {
      setSelectedTestCases([]);
    } else {
      const allTestCaseIds = testScenarios.flatMap((scenario) =>
        scenario.testCases.map((testCase) => testCase.id)
      );
      setSelectedTestCases(allTestCaseIds);
    }
    setAllSelected(!allSelected);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      name,
      description,
      testCases: selectedTestCases,
      active: true,
      project_id: selectedProject,
    };

    try {
      await TestPlanService.createTestPlan(payload);
      alert("Plano de teste criado com sucesso!");
      navigate("/TestPlans");
    } catch (error) {
      alert(`Erro: ${(error as Error).message}`);
    }
  };

  return (
    <div
      className="BasicScreenContainer"
      style={{
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "2.5%",
        border: "solid 1px #222",
      }}
    >
      <Link to="/TestPlans">&lt; Voltar</Link>
      <h2 style={{ margin: 0 }}>Criação de Plano de Teste</h2>
      <div style={{ flexDirection: "column", columnGap: "16px" }}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "0.5em", marginBottom: "1em" }}
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "0.5em", height: "4em" }}
          />
        </div>
      </div>
      <div style={{ marginBottom: "1em", display: "flex", gap: "1em", width: '100%' }}>
            <Button variant="outlined" onClick={toggleAllScenarios}>
            {allExpanded ? "Colapsar Todos" : "Expandir Todos"}
            </Button>
            <Button variant="outlined" onClick={toggleAllTestCases} >
            {allSelected ? "Desmarcar Todos" : "Selecionar Todos"}
            </Button>
            <Button variant="contained" onClick={submit}>
            Finalizar Cadastro
            </Button>
      </div>
      <table className="styledTableAux">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cenário de Teste</th>
            <th>Nº Testes</th>
            <th>Selecionados</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {testScenarios.map((scenario) => (
            <React.Fragment key={scenario.id}>
              <tr>
                <td>{scenario.id}</td>
                <td>{scenario.name}</td>
                <td>{scenario.testCases.length}</td>
                <td>
                  {
                    scenario.testCases.filter((tc) =>
                      selectedTestCases.includes(tc.id)
                    ).length
                  }
                </td>
                <td>
                  <button type="button" onClick={() => toggleScenario(scenario.id)}>
                    {expandedScenarios.includes(scenario.id) ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </button>
                </td>
              </tr>
              {expandedScenarios.includes(scenario.id) &&
                scenario.testCases.map((testCase) => (
                  <tr key={testCase.id} className="styledTableAuxCollapsedTR">
                    <td>{testCase.id}</td>
                    <td>{testCase.name}</td>
                    <td colSpan={2}>{testCase.description}</td>
                    <td>
                      <Checkbox
                        checked={selectedTestCases.includes(testCase.id)}
                        onChange={() => toggleTestCaseSelection(testCase.id)}
                      />
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateTestPlanScreen;