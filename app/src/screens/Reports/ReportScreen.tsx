import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import Execution from "../../models/Execution";
import TestScenario from "../../models/TestScenario";
import BuildService from "../../services/BuildService";
import ExecutionService from "../../services/ExecutionService";
import TestPlanService from "../../services/TestPlanService";
import TestScenarioService from "../../services/TestScenarioService";
import TestExecutionStatusEnum from "../../enums/TestExecutionStatusEnum";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Button, IconButton } from "@mui/material";
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';
import { Download } from "@mui/icons-material";
import TestExecutionTestCaseStatusEnum from "../../enums/TestExecutionTestCaseStatusEnum";
import File from "../../models/File";

const ReportScreen = () => {
    const navigate = useNavigate();
    const { selectedProject } = useGlobalSelectedProject();
    const { id } = useParams<{ id: string }>();
    const [testScenarios, setTestScenarios] = useState<TestScenario[]>([]);
    const [execution, setExecution] = useState<Execution>();
    const [expandedScenarios, setExpandedScenarios] = useState<number[]>([]);
    const [expandedTestCases, setExpandedTestCases] = useState<{ [key: number]: number[] }>({});
    const [shouldUpdateScreen, setShouldUpdateScreen] = useState<boolean>(false);

    let options : Options = {
        method: "save",
        filename: `relatorio.pdf`,
        page: { margin: Margin.MEDIUM },
     };
    

    const toggleScenario = (scenarioId: number) => {
        setExpandedScenarios((prev) =>
            prev.includes(scenarioId)
                ? prev.filter(id => id !== scenarioId)
                : [...prev, scenarioId]
        );
    };

    const toggleTestCase = (scenarioId: number, testCaseId: number) => {
        setExpandedTestCases((prev) => ({
            ...prev,
            [scenarioId]: prev[scenarioId]?.includes(testCaseId)
                ? prev[scenarioId].filter(id => id !== testCaseId)
                : [...(prev[scenarioId] || []), testCaseId]
        }));
    };

function handlePDFGeneration() {
    // Salva o estado atual de expansão
    const prevExpandedScenarios = [...expandedScenarios];
    const prevExpandedTestCases = JSON.parse(JSON.stringify(expandedTestCases));

    // Expande todos os cenários e casos de teste
    const allScenarioIds = testScenarios.map(s => s.id);
    const allExpandedTestCases: { [key: number]: number[] } = {};
    testScenarios.forEach(s => {
        allExpandedTestCases[s.id] = s.testCases.map((tc: any) => tc.id);
    });

    setExpandedScenarios(allScenarioIds);
    setExpandedTestCases(allExpandedTestCases);

    // Dá um pequeno delay para garantir re-render antes de gerar o PDF
    setTimeout(() => {
        const getTargetElement = () => {
            let content = document.getElementById('content-id') as HTMLElement;
            let expandIcons = content.getElementsByClassName('expandIcon');
            for (let i = 0; i < expandIcons.length; i++) {
                expandIcons[i].setAttribute('hidden', 'true');
            }
            return content;
        };

        generatePDF(getTargetElement, options)
            .then(() => {
                // Restaura os ícones
                let content = document.getElementById('content-id') as HTMLElement;
                let expandIcons = content.getElementsByClassName('expandIcon');
                for (let i = 0; i < expandIcons.length; i++) {
                    expandIcons[i].removeAttribute('hidden');
                }

                // Restaura o estado anterior
                setExpandedScenarios(prevExpandedScenarios);
                setExpandedTestCases(prevExpandedTestCases);
            });
    }, 300); // tempo suficiente para o re-render antes da captura
}


    useEffect(() => {
        ExecutionService.getExecutionById(Number(id)).then((res1) => {
            setExecution(res1);
            console.log(res1)
            setTestScenarios(res1.scenarios)
        });
    }, [selectedProject, shouldUpdateScreen]);

    // Função auxiliar para obter status de cada testCase
    const getTestCaseStatus = (testCaseId: number) : number => {
        const exec = execution?.test_executions_test_cases?.find(e => e.test_case_id === testCaseId);
        if (!exec) return 0;
        return exec.status;
    };

    // Função auxiliar para obter comentário do testCase
    const getTestCaseFiles = (testCaseId: number) : File[]  => {
        const exec = execution?.test_executions_test_cases?.find(e => e.test_case_id === testCaseId);
        return exec?.files ? exec.files : []
    };

    return (
        <div
        style={{
            padding: "16px",
            margin: "16px 22% 0px 22%",
            borderRadius: "8px",
            border: "solid 1px #222",
        }}>
            <Button variant="contained" color="primary" style={{
                marginRight: "8px"
                }}
                onClick={() => { navigate(`/executar_execucao/${execution?.id}`)}}
                >Ver Execução
            </Button>
            <Button 
                color="success" 
                variant="contained" 
                endIcon={<Download />}
                onClick={handlePDFGeneration}
                >Download PDF
            </Button>
            <div 
                style={{
                    backgroundColor: "#fefefe",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginTop: "16px"
                }}
                id="content-id"
            >
                <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                    <label><b>Plano de Teste:</b> {execution?.test_plan?.name}</label>
                    <label><b>Build:</b> {execution?.build?.title}</label>
                    <label><b>Finalizada em:</b> {execution?.end_date?.toLocaleString()}</label>
                    <label><b>Status:</b> {execution?.status ? TestExecutionStatusEnum[execution?.status] : ""}</label>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginLeft: "10px" }}>
                    {testScenarios.map((scenario: any, tsIndex: number) => (
                        <div key={scenario.id}>
                            <div style={{ display: "flex", alignItems: "center"}}>
                                <div style={{minHeight: 40}}>
                                    <IconButton onClick={() => toggleScenario(scenario.id)}>
                                        <div className="expandIcon">
                                            {expandedScenarios.includes(scenario.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </div>
                                    </IconButton>
                                </div>                
                                <div style={{ display: "flex", gap: "16px" ,alignItems: "center"}}>
                                    <div style={{ fontSize: '20px', fontWeight: "bold"}}>
                                        {tsIndex + 1}. {scenario.name}
                                    </div>            
                                    <div><b>Não executados: </b><span>{scenario.testCases.filter((tc : any) => getTestCaseStatus(tc.id) === 0).length}</span></div>
                                    <div><b>Sucesso: </b><span>{scenario.testCases.filter((tc : any) => getTestCaseStatus(tc.id) === 1).length}</span></div>
                                    <div><b>Pulados: </b><span>{scenario.testCases.filter((tc : any) => getTestCaseStatus(tc.id) === 2).length}</span></div>
                                    <div><b>Com erros: </b><span>{scenario.testCases.filter((tc : any) => getTestCaseStatus(tc.id) === 3).length}</span></div>
                                </div>
                            </div>
                            {expandedScenarios.includes(scenario.id) && (
                                <div style={{ marginLeft: "30px" }}>
                                    {scenario.testCases.map((testCase: any, tcIndex: number) => (
                                        <div key={testCase.id}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{minHeight: 40}}>
                                                    <IconButton onClick={() => toggleTestCase(scenario.id, testCase.id)}>
                                                        <div className="expandIcon">
                                                            {expandedTestCases[scenario.id]?.includes(testCase.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        </div>
                                                    </IconButton>
                                                </div>
                                                <div style={{ fontSize: '18px', fontWeight: "bold" }}>
                                                    {tcIndex + 1}. {testCase.name}
                                                </div>
                                                <div style={{marginLeft: "6px"}}>
                                                - {TestExecutionTestCaseStatusEnum[getTestCaseStatus(testCase.id)]}
                                                </div>
                                            </div>
                                            {expandedTestCases[scenario.id]?.includes(testCase.id) && (
                                                <div style={{ marginLeft: "40px" }}>
                                                    <div><b>Descrição do teste: </b>{testCase.description}</div>
                                                    <div><b>Execução realizada em:</b> {testCase?.created_at}</div>
                                                    <div><b>Status: </b>{TestExecutionTestCaseStatusEnum[getTestCaseStatus(testCase.id)]}</div>
                                                    <div><b>Comentários da execução: </b>{testCase.comment}</div>
                                                    <b>Evidências:</b>
                                                    {getTestCaseFiles(testCase.id)?.map((file: File) => {
                                                        console.log(`http://localhost:8080/testfiles${file.path}`) 
                                                        return (
                                                        <div key={file.id}>
                                                            <img 
                                                                src={`http://localhost:8080/testfiles${file.path}`}
                                                                width={400}
                                                                alt={`Evidência do Caso ${testCase.id}`}
                                                            />
                                                        </div>
                                                    )})}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ReportScreen;