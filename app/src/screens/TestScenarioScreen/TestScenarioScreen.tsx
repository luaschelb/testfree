import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import TestScenarioService from "../../services/TestScenarioService";
import "./TestScenarioScreen.css"
import TestScenario from "../../models/TestScenario";
import TestCase from "../../models/TestCase";


function TestScenarioScreen() {
    const [testScenarios, setTestScenario] = useState<TestScenario[]>([]);
    const [lastClicked, setLastClicked] = useState<TestScenario | TestCase | null>(null);

    useEffect(() => {
        TestScenarioService.getTestScenariosEagerLoading().then((res) => {
            setTestScenario(res);
        });
    }, []);

    return (
        <>
            <Header />
            <div className="TestScenarioScreenContainer">
                <div className="TreeViewComponent">
                    {
                        testScenarios.map((scenario, index) => (
                            <>
                                <span 
                                    className="ClickableOpacityTreeView"
                                    onClick={() => {
                                        let newData = testScenarios.map((c, i) => {
                                            if (i === index)
                                                c.isOpen = !c.isOpen
                                            return c;
                                        })
                                        setLastClicked(scenario)
                                        setTestScenario(newData)
                                    }}
                                    >
                                    <span style={{paddingRight: "8px"}}>
                                        {scenario.isOpen ? "➖" : "➕"}
                                    </span>
                                    <span>
                                        {scenario.isOpen ? "📂" : "📁"}
                                    </span>
                                    {`${scenario.test_id}: ${scenario.name}`}
                                </span>
                                {
                                    scenario.isOpen 
                                        && 
                                    <div className="TreeViewTestCases">
                                        {scenario.testCases.map((testcase, index) => (
                                            <span 
                                                className="TreeViewTestCase"
                                                onClick={() => {
                                                    setLastClicked(testcase)
                                                }}
                                                >
                                                {`📄 ${testcase.test_id}: ${testcase.name}`}
                                            </span>
                                        ))}
                                    </div>  
                                }
                            </>
                        ))
                    }
                </div>
                <div className="TestScenarioScreen">
                    {
                        (lastClicked === null && <>Clique em algo para visualizar/editar</> )||
                        (lastClicked instanceof TestScenario && 
                            <div style={{display: "flex", "flexDirection": "column"}}>
                                <div>Cenário de Teste</div>
                                <h3>{lastClicked.test_id} - {lastClicked.name}</h3>
                                id: <input value={lastClicked.test_id} type="text"></input>
                                name: <input value={lastClicked.name} type="text"></input>
                                description: <input value={lastClicked.description} type="text"></input>
                            </div> 
                        )
                        ||
                        (lastClicked instanceof TestCase && 
                            <div>
                            <div style={{display: "flex", "flexDirection": "column"}}>
                                <div>Caso de Teste</div>
                                <h3>{lastClicked.test_id} - {lastClicked.name}</h3>
                                id: <input value={lastClicked.test_id} type="text"></input>
                                name: <input value={lastClicked.name} type="text"></input>
                                description: <input value={lastClicked.description} type="text"></input>
                                steps: <textarea value={lastClicked.steps} rows={8}></textarea>
                            </div> 
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default TestScenarioScreen;