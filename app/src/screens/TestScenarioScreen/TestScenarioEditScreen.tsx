import { useEffect, useState } from "react";
import TestScenario from "../../models/TestScenario";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import TestScenarioService from "../../services/TestScenarioService";


const TestScenarioEditScreen = (props: {
        lastClicked : TestScenario,
        SetShouldUpdate: (arg: boolean) => void,
        SetMenuToShow: (arg: TestScenarioMenuControlEnum) => void
    }) => {
    const [test_id, setTest_id] = useState(0);
    const [name, setName] = useState("");
    const [initialName, setInitialName] = useState("");
    const [description, setDescription] = useState("");
    const { selectedProject } = useGlobalSelectedProject();
     
    useEffect(() => {
        setTest_id(props.lastClicked.id)
        setName(props.lastClicked.name)
        setDescription(props.lastClicked.description)
        setInitialName(props.lastClicked.name)
    }, [props.lastClicked])

    async function handleUpdateScenarioClick(id: number, testProjectId : number) {
        if ( !name || !description) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        try {
            await TestScenarioService.updateTestScenario(props.lastClicked.id,{
                name: name,
                description: description,
                test_project_id: selectedProject,
            })
            setInitialName(name)
            alert("Sucesso")
            props.SetShouldUpdate(true)
        } catch (error) {
            alert('Erro ao editar cenário: ' + (error as Error).message);
        }
    }
    
    return (
        <div style={{display: "flex", "flexDirection": "column"}}>
            <button onClick={()=> {props.SetMenuToShow(TestScenarioMenuControlEnum.CREATE_TEST_CASE)}}>Criar caso de Teste</button>
            <h3>{props.lastClicked.test_id} - {initialName}</h3>
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