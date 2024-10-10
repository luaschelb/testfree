import { useEffect, useState } from "react";
import TestPlanService from "../../services/TestPlanService"; // Supondo que você tenha esse serviço
import { Link, useNavigate } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import Checkbox from '@mui/material/Checkbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React from "react";
import TestScenarioService from "../../services/TestScenarioService";
import TestScenario from "../../models/TestScenario";
import "./CreateTestPlanScreen.css"

const CreateTestPlanScreen = () => {
    const { selectedProject } = useGlobalSelectedProject(); // Obtendo o projeto selecionado
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [expandedScenarios, setExpandedScenarios] = useState<number[]>([]);
    const [selectedTestCases, setSelectedTestCases] = useState<number[]>([]);
    const [testScenarios, setTestScenarios] = useState<TestScenario[]>([]); // Estado para cenários de teste

    useEffect(() => {
        // Pega os cenários de teste de um projeto (substitua pelo seu serviço de API)
        TestScenarioService.getTestScenariosEagerLoading(selectedProject).then((data) => {
            setTestScenarios(data);
        });
    }, [selectedProject]);

    const toggleScenario = (scenarioId: number) => {
        if (expandedScenarios.includes(scenarioId)) {
            setExpandedScenarios(expandedScenarios.filter(id => id !== scenarioId));
        } else {
            setExpandedScenarios([...expandedScenarios, scenarioId]);
        }
    };

    const toggleTestCaseSelection = (testCaseId: number) => {
        if (selectedTestCases.includes(testCaseId)) {
            setSelectedTestCases(selectedTestCases.filter(id => id !== testCaseId));
        } else {
            setSelectedTestCases([...selectedTestCases, testCaseId]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            name,
            description,
            testCases: selectedTestCases,
            active: true,
            project_id: selectedProject
        };

        try {
            await TestPlanService.createTestPlan(payload);
            alert("Plano de teste criado com sucesso!");
            navigate("/TestPlans"); // Redireciona para a página de planos de teste
        } catch (error) {
            alert(`Erro: ${(error as Error).message}`);
        }
    };

    return (
        <div className="BasicScreenContainer">
            <Link to="/TestPlans">&lt; Voltar</Link>
            <h1>Criação de Plano de Teste</h1>
            <form onSubmit={handleSubmit} style={{ flexDirection: 'column', columnGap: "16px" }}>
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
                        {testScenarios.map(scenario => (
                            <React.Fragment key={scenario.id}>
                                <tr>
                                    <td>{scenario.id}</td>
                                    <td>{scenario.name}</td>
                                    <td>{scenario.testCases.length}</td>
                                    <td>{scenario.testCases.filter(tc => selectedTestCases.includes(tc.id)).length}</td>
                                    <td>
                                        <button type="button" onClick={() => toggleScenario(scenario.id)}>
                                            {expandedScenarios.includes(scenario.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </button>
                                    </td>
                                </tr>
                                {expandedScenarios.includes(scenario.id) &&
                                    scenario.testCases.map(testCase => (
                                        <tr key={testCase.id} style={{ backgroundColor: "#f0f0f0" }}>
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
                <div style={{ marginTop: "1em", textAlign: "right" }}>
                    <button className="ClickableOpacityButton" type="submit">
                        Finalizar Cadastro
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTestPlanScreen;