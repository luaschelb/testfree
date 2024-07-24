import { FormEvent } from "react";
import TestCase from "../../../models/TestCase";
import TestScenario from "../../../models/TestScenario";
import TestCaseService from "../../../services/TestCaseService";

const TestCaseEditScreen = (props: {lastClicked : TestCase}) => {
    
    async function handleUpdateTestCaseClick(event: FormEvent, ) {
        event.preventDefault();
        const oldData = props.lastClicked as TestCase;
        const formData = new FormData(event.target as HTMLFormElement)
        const test_id = formData.get("TestCaseTest_id") as string
        const name = formData.get("TestCaseName") as string
        const description = formData.get("TestCaseDescription") as string
        const steps = formData.get("TestCaseSteps") as string

        if (!test_id.trim() || !name.trim() || !description.trim() || !steps.trim()) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        try {
            await TestCaseService.updateTestCase(new TestCase(
                oldData.id,
                test_id,
                name,
                description,
                steps,
                oldData.testscenario_id
            ))
            alert("Sucesso")
        } catch (error) {
            alert('Erro ao atualizar caso de teste: ' + (error as Error).message);
        }
    }

    return (
        <div style={{display: "flex", "flexDirection": "column"}}>
            <div>Caso de Teste</div>
            <h3>{props.lastClicked.test_id} - {props.lastClicked.name}</h3>
                id: <input 
                        id="TestCaseTest_id"
                        defaultValue={props.lastClicked.test_id}
                        type="text"/>
                name: <input 
                        id="TestCaseName"
                        defaultValue={props.lastClicked.name}
                        type="text"/>
                description: <input 
                        id="TestCaseDescription"
                        defaultValue={props.lastClicked.description}
                        type="text"/>
                steps: <textarea 
                        id="TestCaseSteps"
                        defaultValue={props.lastClicked.steps}
                        rows={8}/>
                <button type="submit" onClick={handleUpdateTestCaseClick}>
                    Atualizar
                </button>
        </div> 
    )
}

export default TestCaseEditScreen;