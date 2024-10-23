import { FormEvent, useEffect, useState } from "react";
import TestCase from "../../models/TestCase";
import TestScenario from "../../models/TestScenario";
import TestCaseService from "../../services/TestCaseService";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";
import { Button } from "@mui/material";

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
    async function handleCloneTestCaseClick(event: FormEvent, ) {
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
            await TestCaseService.createTestCase({
                name: name,
                description: description,
                steps: steps,
                test_scenario_id: String(test_scenario_id)
            })
            setInitialName(name)
            alert("Sucesso")
            props.SetShouldUpdate(true)
            props.SetMenuToShow(TestScenarioMenuControlEnum.DEFAULT)
        } catch (error) {
            alert('Erro ao clonar caso de teste: ' + (error as Error).message);
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
        <form className="BasicForm" style={{width: "100%"}}>
            <div style={{display: "flex", "flexDirection": "column", gap: "8px"}}>
                <div style={{fontSize: "16px", margin: 0, padding: 0, border: 0}}><b>Caso de teste:</b> {initialName}</div>
                <b>Cenário de teste:</b>
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
                    <div style={{display: 'flex', justifyContent: "space-between"}}>
                        <Button size="small" variant="contained"
                            onClick={handleUpdateTestCaseClick}>
                            Editar
                        </Button>
                        <Button size="small" variant="contained"
                            onClick={handleCloneTestCaseClick}>
                            Clonar
                        </Button>
                        <Button size="small" color="error" variant="contained"
                            onClick={handleDelete}>
                            Deletar
                        </Button>
                    </div>
            </div>
        </form>
    )
}

export default TestCaseEditScreen;