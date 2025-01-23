import { useEffect, useState } from "react";
import TestPlanService from "../../services/TestPlanService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React from "react";
import TestScenarioService from "../../services/TestScenarioService";
import TestScenario from "../../models/TestScenario";
import "./RunExecutionScreen.css"
import { Button, IconButton, responsiveFontSizes, Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import ExecutionService from "../../services/ExecutionService";
import Execution from "../../models/Execution";
import BuildService from "../../services/BuildService";
import TestCase from "../../models/TestCase";
import RunTestModal from "./RunTestModal";
import TestExecutionStatusEnum from "../../enums/TestExecutionStatusEnum";

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
    const [shouldUpdateScreen, setShouldUpdateScreen] = useState<boolean>(false);
    
    const [openModal, setOpenModal] = useState<{
        open: boolean,
        testCase?: TestCase
    }>({open: false, testCase: undefined});

    const handleCloseModal = () => {
        setOpenModal({ open: false, testCase: undefined });
    };
    
    useEffect(() => {
            ExecutionService.getExecutionById(Number(id)).then((res1) => {
                BuildService.getBuildById(Number(res1.build_id)).then((res2) => {
                    TestPlanService.getTestPlanByIdEager(Number(res1.test_plan_id)).then((res3) => {
                        TestScenarioService.getTestScenariosEagerLoadingByTestPlans(selectedProject, res3.testCases).then((testscenariosData) => {
                            const allScenarioIds = testscenariosData.map(scenario => scenario.id);
                            setExpandedScenarios(allScenarioIds);
                            res1.build = res2;
                            res1.testPlan = res3;
                            for(let i = 0; i < testscenariosData.length; i++) // foreach scenario
                            {   
                                for(let j = 0; j < testscenariosData[i].testCases.length; j++) // foreach testcase in scenario
                                {
                                    let found = res1.testCases?.find((tc) => tc.id === testscenariosData[i].testCases[j].id)
                                    if(found)
                                    {
                                        testscenariosData[i].testCases[j].test_execution_test_case_id = found.test_execution_test_case_id
                                        testscenariosData[i].testCases[j].status = found.status
                                        testscenariosData[i].testCases[j].comment = found.comment
                                    }
                                }
                            }
                            console.log(testscenariosData)
                            setExecution(res1);
                            setDescription(res1.comments === null ? "" : res1.comments)
                            setTestScenarios(testscenariosData);
                            setShouldUpdateScreen(false)
                    });
                });
            });
        });
    }, [selectedProject, shouldUpdateScreen]);

    const toggleScenario = (scenarioId: number) => {
        if (expandedScenarios.includes(scenarioId)) {
            setExpandedScenarios(expandedScenarios.filter(id => id !== scenarioId));
        } else {
            setExpandedScenarios([...expandedScenarios, scenarioId]);
        }
    };

    const finaliza = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const data = new Date();
            const dataHoraFormatada = data.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false // Use false para formato 24 horas
            }).replace(',', ''); // Remove a vírgula
            await ExecutionService.updateExecution({...execution as Execution, status: 2, end_date: dataHoraFormatada});
            alert("Execução de teste editado com sucesso!");
            setShouldUpdateScreen(true)
        } catch (error) {
            alert(`Erro: ${(error as Error).message}`);
        }
    };

    const reativar = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await ExecutionService.updateExecution({...execution as Execution, status: 1});
            alert("Execução de teste editado com sucesso!");
            setShouldUpdateScreen(true)
        } catch (error) {
            alert(`Erro: ${(error as Error).message}`);
        }
    };

    const comments = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await ExecutionService.updateExecution({...execution as Execution, comments: description});
            alert("Execução de teste editado com sucesso!");
            setShouldUpdateScreen(true)
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
                borderRadius: "8px",
                border: "solid 1px #222"
            }}
            >
            <div>
                <Link to="/execucoes">&lt; Voltar</Link>
                <h2 style={{ margin: "-33px 0 0 0", textAlign: "center"}}>Execução de Teste</h2>
            </div>
            <RunTestModal 
                open={openModal?.open} 
                handleClose={handleCloseModal}
                testCase={openModal?.testCase} 
                execution={execution}
                setShouldUpdateScreen={setShouldUpdateScreen}
            />
            <div style = {{ flexDirection: 'column', columnGap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px"}}>
                    <div style={{display: "flex", gap: "16px"}}>
                        <label><b>Plano de Teste:</b> {execution?.testPlan?.name}</label>
                        <label><b>Build:</b> {execution?.build?.title}</label>
                        <label><b>Status:</b> {execution?.status ? TestExecutionStatusEnum[execution?.status] : ""}</label>
                        {execution?.status === TestExecutionStatusEnum.Finalizada ? 
                            (<span style={{marginRight: "12px"}}>Finalizada em: {execution.end_date}</span>) : null
                            }
                    </div>
                    <div>
                        <Button variant="contained" color="primary" style={{
                            //width: "160px",
                            fontSize: "12px",
                            marginRight: "8px"
                            }}
                            onClick={() => { navigate(`/relatorios/${execution?.id}`)}}
                            >Ver Relatório
                        </Button>
                        <Button variant="contained" 
                            color={
                                execution?.status === TestExecutionStatusEnum.Finalizada ? "success" : "error"
                            }
                            disabled={execution?.status === undefined}
                            onClick={(e) => {execution?.status === TestExecutionStatusEnum.Finalizada ? reativar(e) : finaliza(e)}} 
                            style={{
                            fontSize: "12px",
                            }}>
                                {execution?.status === TestExecutionStatusEnum.Finalizada ? "Reativar Execução" : "Finalizar Execução"}
                        </Button>
                    </div>
                </div>
                <div>
                    <label><b>Comentários:</b></label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: "100%", padding: "0.5em", height: "4em" }}
                    />
                </div>
                <div>
                    <Button 
                    variant="contained"  
                    color="info" 
                    style={{
                        //width: "160px", 
                        fontSize: "14px"
                    }} 
                    onClick={comments}
                        >Salvar comentário
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
        </div>
    );
};

export default RunExecutionScreen;