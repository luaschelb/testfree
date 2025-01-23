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
import File from "../../models/File";
import { Download } from "@mui/icons-material";

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
        const getTargetElement = () => {
            let content = document.getElementById('content-id') as HTMLElement
            let expandIcons = content.getElementsByClassName('expandIcon')
            for(let i = 0; i < expandIcons.length; i++)
            {
                expandIcons[i].setAttribute('hidden', 'true')
            }
            return content
         };
         generatePDF(getTargetElement, options)
         let content = document.getElementById('content-id') as HTMLElement
         let expandIcons = content.getElementsByClassName('expandIcon')
         for(let i = 0; i < expandIcons.length; i++)
         {
             expandIcons[i].removeAttribute('hidden')
         }
         return content
    }

    useEffect(() => {
        ExecutionService.getExecutionById(Number(id)).then((res1) => {
            BuildService.getBuildById(Number(res1.build_id)).then((res2) => {
                TestPlanService.getTestPlanByIdEager(Number(res1.test_plan_id)).then((res3) => {
                    TestScenarioService.getTestScenariosEagerLoadingByTestPlans(selectedProject, res3.testCases).then((testscenariosData) => {
                        const allScenarioIds = testscenariosData.map(scenario => scenario.id);
                        const initialExpandedTestCases: { [key: number]: number[] } = {};
    
                        // Adicione todos os IDs dos casos de teste para cada cenário.
                        testscenariosData.forEach(scenario => {
                            initialExpandedTestCases[scenario.id] = scenario.testCases.map(tc => tc.id);
                        });
    
                        setExpandedScenarios(allScenarioIds);
                        setExpandedTestCases(initialExpandedTestCases);
    
                        res1.build = res2;
                        res1.testPlan = res3;
                        for(let i = 0; i < testscenariosData.length; i++) {
                            for(let j = 0; j < testscenariosData[i].testCases.length; j++) {
                                let found = res1.testCases?.find((tc) => tc.id === testscenariosData[i].testCases[j].id)
                                if(found) {
                                    testscenariosData[i].testCases[j].test_execution_test_case_id = found.test_execution_test_case_id;
                                    testscenariosData[i].testCases[j].status = found.status;
                                    testscenariosData[i].testCases[j].comment = found.comment;
                                    testscenariosData[i].testCases[j].files = found.files;
                                    testscenariosData[i].testCases[j].created_at = found.created_at;
                                }
                            }
                        }
                        setExecution(res1);
                        setTestScenarios(testscenariosData);
                        setShouldUpdateScreen(false);
                    });
                });
            });
        });
    }, [selectedProject, shouldUpdateScreen]);

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
                    <label><b>Plano de Teste:</b> {execution?.testPlan?.name}</label>
                    <label><b>Build:</b> {execution?.build?.title}</label>
                    <label><b>Finalizada em:</b> {execution?.end_date}</label>
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
                                    <div><b>Sucesso: </b><span>{scenario.testCases.filter((tc : any) => tc.status === 1).length}</span></div>
                                    <div><b>Pulados: </b><span>{scenario.testCases.filter((tc : any) => tc.status === 2).length}</span></div>
                                    <div><b>Com erros: </b><span>{scenario.testCases.filter((tc : any) => tc.status === 3).length}</span></div>
                                    <div><b>Não executados: </b><span>{scenario.testCases.filter((tc : any) => tc.status === 0).length}</span></div>
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
                                                - {testCase.mapStatusToString().toLocaleLowerCase()}
                                                </div>
                                            </div>
                                            {expandedTestCases[scenario.id]?.includes(testCase.id) && (
                                                <div style={{ marginLeft: "40px" }}>
                                                    <div><b>Descrição do teste: </b>{testCase.description}</div>
                                                    <div><b>Execução realizada em:</b> {testCase?.created_at}</div>
                                                    <div><b>Status: </b>{testCase.mapStatusToString()}</div>
                                                    <div><b>Comentários da execução: </b>{testCase.comment}</div>
                                                    <b>Evidências:</b>
                                                    {testCase.files?.map((file: File) => (
                                                        <div key={file.id}>
                                                            <img 
                                                                src={`http://localhost:8080/testfiles${file.path}`}
                                                                width={400}
                                                                alt={`Evidência do Caso ${testCase.id}`}
                                                            />
                                                        </div>
                                                    ))}
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