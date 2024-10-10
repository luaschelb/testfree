import { FormEvent, useState } from "react";
import TestCase from "../../models/TestCase";
import TestCaseService from "../../services/TestCaseService";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";
import TestScenario from "../../models/TestScenario";

const TestCaseCreateScreen = (props: {
        lastClicked: TestCase,
        testScenarios: TestScenario[],
        SetShouldUpdate: (arg: boolean) => void,
        SetMenuToShow: (arg: TestScenarioMenuControlEnum) => void
    }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState("");
    const [testscenario_id, setTestscenario_id] = useState(0);

    async function handleCreateTestCaseClick(event: FormEvent, ) {
        event.preventDefault();

        if (!name.trim() || !description.trim()  || !steps.trim() ) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        if (testscenario_id === 0) {
            alert('Obrigatório escolher um cenário de teste');
            return;
        }
        try {
            await TestCaseService.createTestCase({
                name: name,
                description: description,
                steps: steps,
                test_scenario_id: String(testscenario_id)
            })
            alert("Sucesso")
            props.SetShouldUpdate(true)
            props.SetMenuToShow(TestScenarioMenuControlEnum.DEFAULT)
        } catch (error) {
            alert('Erro ao atualizar caso de teste: ' + (error as Error).message);
        }
    }

    return (
        <div style={{display: "flex", "flexDirection": "column", gap: "8px"}}>
        <h3>Novo caso de teste</h3>
            <select
                    value={testscenario_id}
                    onChange={(event) => {
                        setTestscenario_id(parseInt(event.target.value))
                    }}>
                <option>Selecione um cenário de teste:</option>
                {
                    props.testScenarios.map((x) => (
                        <option key={x.id} value={x.id}>{x.name}</option>
                    ))
                }
            </select>
            Nome: <input 
                    id="TestCaseName"
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    type="text"/>
            Descrição: <input 
                    id="TestCaseDescription"
                    value={description}
                    onChange={(e)=> setDescription(e.target.value)}
                    type="text"/>
            Passos: <textarea 
                    id="TestCaseSteps"
                    value={steps}
                    onChange={(e)=> setSteps(e.target.value)}
                    rows={8}/>
            <button 
                className="TestScenarioScreenFormButtons"
                type="submit" 
                onClick={handleCreateTestCaseClick}
            >
                Cadastrar
            </button>
        </div> 
    )
}

export default TestCaseCreateScreen;