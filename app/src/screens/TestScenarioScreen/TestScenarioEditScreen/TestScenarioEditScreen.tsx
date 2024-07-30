import { useEffect, useState } from "react";
import TestScenario from "../../../models/TestScenario";


const TestScenarioEditScreen = (props: {
        lastClicked : TestScenario,
        SetShouldUpdate: (arg: boolean) => void
    }) => {
    const [test_id, setTest_id] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    
    useEffect(() => {
        setTest_id(props.lastClicked.test_id)
        setName(props.lastClicked.name)
        setDescription(props.lastClicked.description)
    }, [props.lastClicked])

    const handleUpdateScenarioClick = (id: number, testProjectId : number) => {
        alert("não implementado")
        props.SetShouldUpdate(true)
    }
    
    return (
        <div style={{display: "flex", "flexDirection": "column"}}>
            <div>Cenário de Teste</div>
            <h3>{props.lastClicked.test_id} - {props.lastClicked.name}</h3>
            id: <input 
                    id="TestScenarioId" 
                    value={test_id}
                    onChange={(e) => setTest_id(e.target.value)}
                    type="text"
                />
            name: <input 
                    id="TestScenarioName" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"/>
            description: <input 
                    id="TestScenarioDescription" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"/>
            <button 
                onClick={() => handleUpdateScenarioClick(props.lastClicked.id, props.lastClicked.testProjectId)}>
                Atualizar
            </button>
        </div>
    )
}

export default TestScenarioEditScreen;