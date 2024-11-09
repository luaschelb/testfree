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
import { IconButton } from "@mui/material";
import File from "../../models/File";

const ReportScreen = () => {
    const { selectedProject } = useGlobalSelectedProject();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [selectedTestCases, setSelectedTestCases] = useState<number[]>([]);
    const [testScenarios, setTestScenarios] = useState<TestScenario[]>([]);
    const [execution, setExecution] = useState<Execution>();
    const [expandedScenarios, setExpandedScenarios] = useState<number[]>([]);
    const [expandedTestCases, setExpandedTestCases] = useState<{ [key: number]: number[] }>({});
    const [shouldUpdateScreen, setShouldUpdateScreen] = useState<boolean>(false);

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
                                }
                            }
                        }
                        setExecution(res1);
                        setDescription(res1.comments);
                        setTestScenarios(testscenariosData);
                        setShouldUpdateScreen(false);
                    });
                });
            });
        });
    }, [selectedProject, shouldUpdateScreen]);

    return (
        <div 
            className="BasicScreenContainer"
            style={{
                backgroundColor: "#fefefe",
                padding: "16px",
                borderRadius: "8px",
                border: "solid 1px #222"
            }}
        >
            <div style={{display: "flex", flexDirection: "row", gap: "16px"}}>
                <label><b>Plano de Teste:</b> {execution?.testPlan?.name}</label>
                <label><b>Build:</b> {execution?.build?.title}</label>
                <label><b>Status:</b> {execution?.status ? TestExecutionStatusEnum[execution?.status] : ""}</label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginLeft: "60px" }}>
                {testScenarios.map((scenario: any, tsIndex: number) => (
                    <div key={scenario.id}>
                        <div style={{ display: "grid", gridTemplateColumns: 'auto 2fr repeat(4, 1fr)', alignItems: "center" }}>
                            <div>
                                <IconButton onClick={() => toggleScenario(scenario.id)}>
                                    {expandedScenarios.includes(scenario.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: "bold" }}>
                                {tsIndex + 1}. {scenario.name}
                            </div>
                            <div><b>Não executados: </b><span>{scenario.testCases.filter((tc : any) => tc.status === 0).length}</span></div>
                            <div><b>Sucesso: </b><span>{scenario.testCases.filter((tc : any) => tc.status === 1).length}</span></div>
                            <div><b>Pulados: </b><span>{scenario.testCases.filter((tc : any) => tc.status === 2).length}</span></div>
                            <div><b>Com erros: </b><span>{scenario.testCases.filter((tc : any) => tc.status === 3).length}</span></div>
                        </div>
                        {expandedScenarios.includes(scenario.id) && (
                            <div style={{ marginLeft: "60px" }}>
                                {scenario.testCases.map((testCase: any, tcIndex: number) => (
                                    <div key={testCase.id}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <IconButton onClick={() => toggleTestCase(scenario.id, testCase.id)}>
                                                {expandedTestCases[scenario.id]?.includes(testCase.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                            <div style={{ fontSize: '18px', fontWeight: "bold" }}>
                                                {tcIndex + 1}. {testCase.name}
                                            </div>
                                            <div style={{marginLeft: "6px"}}>
                                               - {testCase.mapStatusToString().toLocaleLowerCase()}
                                            </div>
                                        </div>
                                        {expandedTestCases[scenario.id]?.includes(testCase.id) && (
                                            <div style={{ marginLeft: "40px" }}>
                                                <div><b>Status: </b>{testCase.mapStatusToString()}</div>
                                                <div><b>Descrição: </b>{testCase.description}</div>
                                                <div><b>Comentários: </b>{testCase.comment}</div>
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
    );
}

export default ReportScreen;