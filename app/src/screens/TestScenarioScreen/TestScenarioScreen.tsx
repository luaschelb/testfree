import { useEffect, useState } from "react";
import TestScenarioService from "../../services/TestScenarioService";
import "./TestScenarioScreen.css"
import TestScenario from "../../models/TestScenario";
import TestCase from "../../models/TestCase";
import TreeViewComponent from "./TreeViewComponent";
import TestScenarioEditScreen from "./TestScenarioEditScreen";
import TestCaseEditScreen from "./TestCaseEditScreen";
import TestScenarioMenuControl from "../../enums/TestScenarioMenuControlEnum";
import TestScenarioCreateScreen from "./TestScenarioCreateScreen";
import TestCaseCreateScreen from "./TestCaseCreateScreen";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import { Button } from "@mui/material";


function TestScenarioScreen() {
    const [testScenarios, SetTestScenarios] = useState<TestScenario[]>([]);
    const [lastClicked, SetLastClicked] = useState<TestScenario | TestCase | null>(null);
    const [shouldUpdate, SetShouldUpdate] = useState(false);
    const [menuToShow, SetMenuToShow] = useState<TestScenarioMenuControl>(TestScenarioMenuControl.DEFAULT)
    const { testProjects, selectedProject } = useGlobalSelectedProject(); // Usa o setStatus do contexto

    useEffect(() => {
        TestScenarioService.getTestScenariosEagerLoading(selectedProject).then((newData) => {
            newData = newData.map((testScenario) => {
                let obj = testScenarios.find((aux) => aux.id === testScenario.id)
                if(obj?.isOpen)
                {
                    testScenario.isOpen = true
                }
                return testScenario
            }) 
            SetTestScenarios(newData);
        });
        SetShouldUpdate(false)
    }, [shouldUpdate, selectedProject]);

    return (
        <div className="BasicScreenContainer">
            <div style={{fontSize: '1em'}}>Cenários de teste para o projeto: {testProjects.find((x) => x.id === selectedProject)?.name}</div>
            <div className="TestScenarioScreenToolBar">
                <Button variant="contained" onClick={() => {SetMenuToShow(TestScenarioMenuControl.CREATE_TEST_SCENARIO)}}>Criar Cenário de Teste</Button>
                <Button variant="contained" onClick={() => {SetMenuToShow(TestScenarioMenuControl.CREATE_TEST_CASE)}}>Criar Caso de Teste</Button>
            </div>
            <div className="TestScenarioScreenTreeViewAndPanel">
                <TreeViewComponent 
                    testScenarios={testScenarios}
                    SetTestScenarios={SetTestScenarios}
                    SetLastClicked={SetLastClicked}
                    SetMenuToShow={SetMenuToShow}
                />
                <div className="TestScenarioScreen">
                    {
                        (menuToShow === TestScenarioMenuControl.DEFAULT && 
                            <>
                                <p>Clique no botão "Criar Cenário de Teste" na barra superior para criar um novo cenário</p>
                                <p>Clique em algo na arvore lateral para visualizar/editar cenários e casos de teste existentes</p>
                            </> 
                        ) ||
                        (menuToShow === TestScenarioMenuControl.CREATE_TEST_SCENARIO && 
                            <TestScenarioCreateScreen 
                                SetShouldUpdate={SetShouldUpdate}
                                SetMenuToShow={SetMenuToShow}
                            />
                        ) ||
                        (menuToShow === TestScenarioMenuControl.EDIT_TEST_SCENARIO && 
                            <TestScenarioEditScreen 
                                lastClicked={lastClicked as TestScenario}
                                SetShouldUpdate={SetShouldUpdate}
                                SetMenuToShow={SetMenuToShow}
                                />) ||
                                
                        (menuToShow === TestScenarioMenuControl.CREATE_TEST_CASE && 
                            <TestCaseCreateScreen 
                                lastClicked={lastClicked as TestCase}
                                testScenarios = {testScenarios}
                                SetShouldUpdate={SetShouldUpdate}
                                SetMenuToShow={SetMenuToShow}
                                />) ||
                        (menuToShow === TestScenarioMenuControl.EDIT_TEST_CASE && 
                            <TestCaseEditScreen 
                                testScenarios = {testScenarios}
                                lastClicked={lastClicked as TestCase}
                                SetShouldUpdate={SetShouldUpdate}
                                SetMenuToShow={SetMenuToShow}
                                />)
                    }
                </div>
            </div>
        </div>
    )
}

export default TestScenarioScreen;