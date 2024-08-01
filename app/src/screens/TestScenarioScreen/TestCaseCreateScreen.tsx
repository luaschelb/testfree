import { FormEvent, useEffect, useState } from "react";
import TestCase from "../../models/TestCase";
import TestCaseService from "../../services/TestCaseService";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";

const TestCaseCreateScreen = (props: {
        lastClicked : TestCase,
        SetShouldUpdate: (arg: boolean) => void,
        SetMenuToShow: (arg: TestScenarioMenuControlEnum) => void
    }) => {
    const [test_id, setTest_id] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState("");

    async function handleCreateTestCaseClick(event: FormEvent, ) {
        event.preventDefault();
        const oldData = props.lastClicked as TestCase;

        if (!test_id.trim() || !name.trim() || !description.trim() || !steps.trim()) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        try {/*
            await TestCaseService.createTestCase(new TestCase(
                oldData.id,
                test_id,
                name,
                description,
                steps,
                oldData.testscenario_id
            ))*/
            alert("Sucesso")
            props.SetShouldUpdate(true)
            props.SetMenuToShow(TestScenarioMenuControlEnum.DEFAULT)
        } catch (error) {
            alert('Erro ao atualizar caso de teste: ' + (error as Error).message);
        }
    }

    return (
        <div style={{display: "flex", "flexDirection": "column"}}>
            <div>Novo caso de Teste</div>
                id: <input 
                        id="TestCaseTest_id"
                        value={test_id}
                        onChange={(e)=> setTest_id(e.target.value)}
                        type="text"/>
                name: <input 
                        id="TestCaseName"
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                        type="text"/>
                description: <input 
                        id="TestCaseDescription"
                        value={description}
                        onChange={(e)=> setDescription(e.target.value)}
                        type="text"/>
                steps: <textarea 
                        id="TestCaseSteps"
                        value={steps}
                        onChange={(e)=> setSteps(e.target.value)}
                        rows={8}/>
                <button type="submit" onClick={handleCreateTestCaseClick}>
                    Cadastrar
                </button>
        </div> 
    )
}

export default TestCaseCreateScreen;