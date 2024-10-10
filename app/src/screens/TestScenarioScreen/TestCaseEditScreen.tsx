import { FormEvent, useEffect, useState } from "react";
import TestCase from "../../models/TestCase";
import TestScenario from "../../models/TestScenario";
import TestCaseService from "../../services/TestCaseService";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";

const TestCaseEditScreen = (props: {
        lastClicked : TestCase,
        SetShouldUpdate: (arg: boolean) => void,
        testScenarios: TestScenario[]
        SetMenuToShow: (arg: TestScenarioMenuControlEnum) => void
    }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState("");
    const [test_scenario_id, setTest_scenario_id] = useState(0);
    const [initialName, setInitialName] = useState("");

    useEffect(() => {
        setName(props.lastClicked.name)
        setDescription(props.lastClicked.description)
        setSteps(props.lastClicked.steps)
        setTest_scenario_id(parseInt(props.lastClicked.test_scenario_id))
        setInitialName(props.lastClicked.name)
    }, [props.lastClicked])

    async function handleUpdateTestCaseClick(event: FormEvent, ) {
        event.preventDefault();
        const oldData = props.lastClicked as TestCase;

        if (!name.trim()  || !description.trim()  || !steps.trim() ) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        if (test_scenario_id === 0) {
            alert('Obrigatório escolher um cenário de teste');
            return;
        }
        try {
            await TestCaseService.updateTestCase(new TestCase(
                oldData.id,
                name,
                description,
                steps,
                String(test_scenario_id)
            ))
            setInitialName(name)
            alert("Sucesso")
            props.SetShouldUpdate(true)
        } catch (error) {
            alert('Erro ao atualizar caso de teste: ' + (error as Error).message);
        }
    }

    async function handleDelete() {
        try {
            await TestCaseService.deleteTestCase(props.lastClicked.id)
            alert("Sucesso")
            props.SetMenuToShow(TestScenarioMenuControlEnum.DEFAULT)
            props.SetShouldUpdate(true)
        } catch (error) {
            alert('Erro ao deletar caso de teste: ' + (error as Error).message);
        }
    }
    return (
        <div style={{display: "flex", "flexDirection": "column", gap: "8px"}}>
            <div style={{fontWeight: "bold", fontSize: "16px", margin: 0, padding: 0, border: 0}}>Caso de teste: {initialName}</div>
            <select
                value={test_scenario_id}
                onChange={(event) => {
                    setTest_scenario_id(parseInt(event.target.value))
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
                <div style={{display: 'flex', justifyContent: "space-between"}}>
                    <button type="submit" 
                    className="TestScenarioScreenFormButtons"
                    onClick={handleUpdateTestCaseClick}>
                        Editar
                    </button>
                    <button onClick={handleDelete}>Deletar Caso de Teste</button>
                </div>
        </div> 
    )
}

export default TestCaseEditScreen;