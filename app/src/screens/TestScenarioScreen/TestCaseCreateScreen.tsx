import { FormEvent, useState } from "react";
import TestCase from "../../models/TestCase";
import TestCaseService from "../../services/TestCaseService";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";
import TestScenario from "../../models/TestScenario";
import { Button } from "@mui/material";

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
        <form className="BasicForm">
            <div style={{fontWeight: "bold", fontSize: "16px", margin: 0, padding: 0, border: 0}}>Novo caso de teste</div>
            <b>Cenário de teste:</b>
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
            <b>Nome:</b> <input 
                    id="TestCaseName"
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    type="text"/>
            <b>Descrição:</b> <textarea 
                    id="TestCaseDescription"
                    value={description}
                    onChange={(e)=> setDescription(e.target.value)}
                    rows={3} />
            <b>Passos:</b> <textarea 
                    id="TestCaseSteps"
                    value={steps}
                    onChange={(e)=> setSteps(e.target.value)}
                    rows={8}/>
            
            <div>
                <Button size="small" variant="contained"
                onClick={handleCreateTestCaseClick}>
                    Cadastrar
                </Button>
            </div>
        </form>
    )
}

export default TestCaseCreateScreen;