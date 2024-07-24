import Header from "../../components/Header/Header";
import { FormEvent, useEffect, useState } from "react";
import TestScenarioService from "../../services/TestScenarioService";
import "./TestScenarioScreen.css"
import TestScenario from "../../models/TestScenario";
import TestCase from "../../models/TestCase";
import TestCaseService from "../../services/TestCaseService";
import TreeViewComponent from "./TreeViewComponent/TreeViewComponent";
import TestScenarioEditScreen from "./TestScenarioEditScreen/TestScenarioEditScreen";
import TestCaseEditScreen from "./TestCaseEditScreen/TestCaseEditScreen";


function TestScenarioScreen() {
    const [testScenarios, SetTestScenarios] = useState<TestScenario[]>([]);
    const [lastClicked, SetLastClicked] = useState<TestScenario | TestCase | null>(null);
    

    useEffect(() => {
        TestScenarioService.getTestScenariosEagerLoading().then((res) => {
            SetTestScenarios(res);
        });
    }, []);

    return (
        <>
            <Header />
            <div className="TestScenarioScreenContainer">
                <TreeViewComponent testScenarios={testScenarios} SetTestScenarios={SetTestScenarios} SetLastClicked={SetLastClicked}/>
                <div className="TestScenarioScreen">
                    {
                        (lastClicked === null && <>Clique em algo para visualizar/editar</> ) ||
                        (lastClicked instanceof TestScenario && <TestScenarioEditScreen lastClicked={lastClicked}/>) ||
                        (lastClicked instanceof TestCase && <TestCaseEditScreen lastClicked={lastClicked} />)
                    }
                </div>
            </div>
        </>
    )
}

export default TestScenarioScreen;