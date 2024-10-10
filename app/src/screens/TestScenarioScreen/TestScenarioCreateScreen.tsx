import { FormEvent, useState } from "react";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import TestScenarioService from "../../services/TestScenarioService";

const TestScenarioCreateScreen = (props: {
        SetShouldUpdate: (arg: boolean) => void,
        SetMenuToShow: (arg: TestScenarioMenuControlEnum) => void
    }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { selectedProject } = useGlobalSelectedProject();
    
    async function submit(event: FormEvent) {
        event.preventDefault();

        if ( !name || !description) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        try {
            await TestScenarioService.createTestScenario({
                name: name,
                description: description,
                test_project_id: selectedProject,
            })
            alert("Sucesso")
            props.SetShouldUpdate(true)
        } catch (error) {
            alert('Erro ao cadastrar cenário: ' + (error as Error).message);
        }
    }

    return (
        <div style={{display: "flex", "flexDirection": "column", gap: "8px"}}>
            <div style={{fontWeight: "bold", fontSize: "16px", margin: 0, padding: 0, border: 0}}>Novo cenário de teste</div>
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
            <button className="TestScenarioScreenFormButtons"
                onClick={(event) => submit(event)}>
                Cadastrar
            </button>
        </div>
    )
}

export default TestScenarioCreateScreen;