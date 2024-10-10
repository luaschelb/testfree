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
    const [name, setName] = useState("");
    const [initialName, setInitialName] = useState("");
    const [description, setDescription] = useState("");
    const { selectedProject } = useGlobalSelectedProject();
     
    useEffect(() => {
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
    
    async function handleDelete() {
        try {
            await TestScenarioService.deleteTestScenario(props.lastClicked.id)
            alert("Sucesso")
            props.SetShouldUpdate(true)
        } catch (error) {
            alert('Erro ao deletar cenário de teste: ' + (error as Error).message);
        }
    }
    
    return (
        <div style={{display: "flex", "flexDirection": "column", gap: "8px"}}>
            <div style={{fontWeight: "bold", fontSize: "16px", margin: 0, padding: 0, border: 0}}>Cenário de teste: {initialName}</div>
            <button onClick={()=> {props.SetMenuToShow(TestScenarioMenuControlEnum.CREATE_TEST_CASE)}}>Criar novo caso de teste para o cenário</button>
            <b>Nome:</b> <input 
                    id="TestScenarioName" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"/>
            <b>Descrição:</b> <input 
                    id="TestScenarioDescription" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"/>
                    
            <div style={{display: 'flex', justifyContent: "space-between"}}>
                <button className="TestScenarioScreenFormButtons"
                    onClick={() => handleUpdateScenarioClick(props.lastClicked.id, props.lastClicked.testProjectId)}>
                    Editar
                </button>
                <button onClick={handleDelete}>Deletar Cenário de Teste</button>
            </div>
        </div>
    )
}

export default TestScenarioEditScreen;