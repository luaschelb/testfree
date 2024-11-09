import { useNavigate, useParams } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import { useEffect, useState } from "react";
import Execution from "../../models/Execution";
import TestScenario from "../../models/TestScenario";
import BuildService from "../../services/BuildService";
import ExecutionService from "../../services/ExecutionService";
import TestPlanService from "../../services/TestPlanService";
import TestScenarioService from "../../services/TestScenarioService";
import TestExecutionStatusEnum from "../../enums/TestExecutionStatusEnum";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React from "react";

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
    const [shouldUpdateScreen, setShouldUpdateScreen] = useState<boolean>(false);
    
    const toggleScenario = (scenarioId: number) => {
        if (expandedScenarios.includes(scenarioId)) {
            setExpandedScenarios(expandedScenarios.filter(id => id !== scenarioId));
        } else {
            setExpandedScenarios([...expandedScenarios, scenarioId]);
        }
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
                                    testscenariosData[i].testCases[j].files = found.files
                                }
                            }
                        }
                        console.log(testscenariosData)
                        setExecution(res1);
                        setDescription(res1.comments)
                        setTestScenarios(testscenariosData);
                        setShouldUpdateScreen(false)
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
                margin: "0px 10% 0px 10%",
                borderRadius: "8px",
                border: "solid 1px #222"
            }}
        >
            <div style={{display: "flex", flexDirection: "row", gap: "16px"}}>
                <label><b>Plano de Teste:</b> {execution?.testPlan?.name}</label>
                <label><b>Build:</b> {execution?.build?.title}</label>
                <label><b>Status:</b> {execution?.status ? TestExecutionStatusEnum[execution?.status] : ""}</label>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px"
            }}>
                {testScenarios.map(scenario => (
                    <div key={scenario.id}>
                        <div style={{display: "grid", gridTemplateColumns: '1fr 2fr repeat(5, 1fr)', justifyItems: "center"}}>
                            <th>Código</th>
                            <th>Cenário de Teste</th>
                            <th>Não executados</th>
                            <th>Sucesso</th>
                            <th>Pulados</th>
                            <th>Com erros</th>
                            <span></span>
                            <span>{scenario.id}</span>
                            <span>{scenario.name}</span>
                            <span>{scenario.testCases.filter(tc => tc.status === 0).length}</span>
                            <span>{scenario.testCases.filter(tc => tc.status === 1).length}</span>
                            <span>{scenario.testCases.filter(tc => tc.status === 2).length}</span>
                            <span>{scenario.testCases.filter(tc => tc.status === 3).length}</span>
                            <span>
                                <button type="button" onClick={() => toggleScenario(scenario.id)}>
                                    {expandedScenarios.includes(scenario.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </button>
                            </span>
                        </div>
                        {expandedScenarios.includes(scenario.id) &&
                            <div>
                                <div style={{display: "grid", gridTemplateColumns: '1fr 2fr 2fr 3fr repeat(2, 1fr)', justifyItems: "center"}}>
                                    <span><b>ID</b></span>
                                    <span><b>Nome</b></span>
                                    <span><b>Descrição</b></span>
                                    <span><b>Comentários</b></span>
                                    <span><b>Status</b></span>
                                </div>
                                {scenario.testCases.map(testCase => (
                                    <>
                                        <div key={testCase.id} style={{display: "grid", gridTemplateColumns: '1fr 2fr 2fr 3fr repeat(2, 1fr)', justifyItems: "center"}}>
                                            <span>{testCase.id}</span>
                                            <span>{testCase.name}</span>
                                            <span>{testCase.description}</span>
                                            <span>{testCase.comment}</span>
                                            <span>{testCase.mapStatusToString()}</span>
                                        </div>
                                        {/*<img src={}*/}
                                    </>
                                ))}
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReportScreen;