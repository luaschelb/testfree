import { useEffect, useState } from "react";
import TestPlanService from "../../services/TestPlanService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React from "react";
import TestScenarioService from "../../services/TestScenarioService";
import TestScenario from "../../models/TestScenario";
import "./CreateTestPlanScreen.css"
import { Button, IconButton, responsiveFontSizes, Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import ExecutionService from "../../services/ExecutionService";
import Execution from "../../models/Execution";
import BuildService from "../../services/BuildService";
import TestCase from "../../models/TestCase";
import RunTestModal from "./RunTestModal";

const RunExecutionScreen = () => {
    const { selectedProject } = useGlobalSelectedProject();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [selectedTestCases, setSelectedTestCases] = useState<number[]>([]);
    const [testScenarios, setTestScenarios] = useState<TestScenario[]>([]);
    const [execution, setExecution] = useState<Execution>();
    const [expandedScenarios, setExpandedScenarios] = useState<number[]>([]);
    const [openModal, setOpenModal] = useState<{
        open: boolean,
        testCase?: TestCase
    }>({open: false, testCase: undefined});

    const handleCloseModal = () => {
        setOpenModal({ open: false, testCase: undefined });
    };
    
    useEffect(() => {
        TestScenarioService.getTestScenariosEagerLoading(selectedProject).then((testscenariosData) => {
            const allScenarioIds = testscenariosData.map(scenario => scenario.id);
            setExpandedScenarios(allScenarioIds);
            ExecutionService.getExecutionById(Number(id)).then((res1) => {
                BuildService.getBuildById(Number(res1.build_id)).then((res2) => {
                    TestPlanService.getTestPlanByIdEager(Number(res1.test_plan_id)).then((res3) => {
                        res1.build = res2;
                        res1.testPlan = res3;
                        for(let i = 0; i < testscenariosData.length; i++) // foreach scenario
                        {   
                            for(let j = 0; j < testscenariosData[i].testCases.length; j++) // foreach testcase in scenario
                            {
                                let found = res1.testCases?.find((tc) => tc.id === testscenariosData[i].testCases[j].id)
                                if(found)
                                {
                                    testscenariosData[i].testCases[j].status = found.status
                                    testscenariosData[i].testCases[j].comment = found.comment
                                }
                            }
                        }
                        console.log()
                        setExecution(res1);
                        setTestScenarios(testscenariosData);
                    });
                });
            });
        });
    }, [selectedProject]);

    const toggleScenario = (scenarioId: number) => {
        if (expandedScenarios.includes(scenarioId)) {
            setExpandedScenarios(expandedScenarios.filter(id => id !== scenarioId));
        } else {
            setExpandedScenarios([...expandedScenarios, scenarioId]);
        }
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            id: Number(id),
            name,
            description,
            testCases: selectedTestCases,
            active: true,
            project_id: selectedProject
        };

        try {
            await TestPlanService.updateTestPlan(payload);
            alert("Execução de teste editado com sucesso!");
            navigate("/execucoes");
        } catch (error) {
            alert(`Erro: ${(error as Error).message}`);
        }
    };

    return (
        <div 
            className="BasicScreenContainer"
            style={{
                backgroundColor: "#eee",
                padding: "16px",
                margin: "16px 10% 0px 10%",
                borderRadius: "2.5%",
                border: "solid 1px #222"
            }}
            >
            <Link to="/execucoes">&lt; Voltar</Link>
            <h2 style={{ margin: 0 }}>Execução de Teste</h2>
            <RunTestModal 
                open={openModal?.open} 
                handleClose={handleCloseModal}
                testCase={openModal?.testCase} 
            />
            <div style = {{ flexDirection: 'column', columnGap: "16px" }}>
                <div>
                    <label><b>Plano de Teste:</b> {execution?.testPlan?.name}</label>
                </div>
                <div>
                    <label><b>Build:</b> {execution?.build?.title}</label>
                </div>
                <div>
                    <label><b>Comentários:</b></label>
                    <textarea
                        value={execution?.comments}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: "100%", padding: "0.5em", height: "4em" }}
                    />
                </div>
                <div>
                    <Button variant="contained" style={{width: "160px", fontSize: "10px"}} onClick={submit}>Salvar comentário</Button>
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
                    {testScenarios.map(scenario => (
                        <React.Fragment key={scenario.id}>
                            <tr>
                                <td>{scenario.id}</td>
                                <td>{scenario.name}</td>
                                <td>{scenario.testCases.filter(tc => tc.status === 0).length}</td>
                                <td>{scenario.testCases.filter(tc => tc.status === 1).length}</td>
                                <td>{scenario.testCases.filter(tc => tc.status === 2).length}</td>
                                <td>{scenario.testCases.filter(tc => tc.status === 3).length}</td>
                                <td>
                                    <button type="button" onClick={() => toggleScenario(scenario.id)}>
                                        {expandedScenarios.includes(scenario.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </button>
                                </td>
                            </tr>
                            {expandedScenarios.includes(scenario.id) &&
                                <>
                                    <tr className="styledTableAuxCollapsedHeader">
                                        <td><b>ID</b></td>
                                        <td><b>Nome</b></td>
                                        <td><b>Descrição</b></td>
                                        <td colSpan={2}><b>Comentários</b></td>
                                        <td><b>Status</b></td>
                                        <td><b>Ações</b></td>
                                    </tr>
                                    {scenario.testCases.map(testCase => (
                                        <tr key={testCase.id} className="styledTableAuxCollapsedTR">
                                            <td>{testCase.id}</td>
                                            <td>{testCase.name}</td>
                                            <td>{testCase.description}</td>
                                            <td colSpan={2}>{testCase.comment}</td>
                                            <td>{testCase.mapStatusToString()}</td>
                                            <td>
                                                <Tooltip title="Executar">
                                                    <IconButton aria-label="PlayArrow" color="success" onClick={() => { setOpenModal({
                                                        open: true, 
                                                        testCase: testCase
                                                        }) 
                                                    }}>
                                                        <PlayArrow />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            }
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <div>
                <Button variant="contained" onClick={submit}>Finalizar Execução</Button>
            </div>
        </div>
    );
};

export default RunExecutionScreen;