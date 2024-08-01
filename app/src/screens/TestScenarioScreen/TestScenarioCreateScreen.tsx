import { useEffect, useState } from "react";
import TestScenario from "../../models/TestScenario";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";


const TestScenarioCreateScreen = (props: {
        SetShouldUpdate: (arg: boolean) => void,
        SetMenuToShow: (arg: TestScenarioMenuControlEnum) => void
    }) => {
    const [test_id, setTest_id] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreateScenarioClick = () => {
        alert("não implementado")
        props.SetShouldUpdate(true)
        props.SetMenuToShow(TestScenarioMenuControlEnum.DEFAULT)
    }
    
    return (
        <div style={{display: "flex", "flexDirection": "column"}}>
            <div>Novo cenário de teste</div>
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
                onClick={() => handleCreateScenarioClick()}>
                Atualizar
            </button>
        </div>
    )
}

export default TestScenarioCreateScreen;