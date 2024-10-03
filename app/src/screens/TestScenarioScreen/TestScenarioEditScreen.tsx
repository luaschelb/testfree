import { useEffect, useState } from "react";
import TestScenario from "../../models/TestScenario";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";


const TestScenarioEditScreen = (props: {
        lastClicked : TestScenario,
        SetShouldUpdate: (arg: boolean) => void,
        SetMenuToShow: (arg: TestScenarioMenuControlEnum) => void
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
            <button onClick={()=> {props.SetMenuToShow(TestScenarioMenuControlEnum.CREATE_TEST_CASE)}}>Criar caso de Teste</button>
            <h3>{props.lastClicked.test_id} - {props.lastClicked.name}</h3>
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
            <button className="TestScenarioScreenFormButtons"
                onClick={() => handleUpdateScenarioClick(props.lastClicked.id, props.lastClicked.testProjectId)}>
                Editar
            </button>
        </div>
    )
}

export default TestScenarioEditScreen;