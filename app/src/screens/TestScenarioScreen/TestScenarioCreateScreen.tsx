import { FormEvent, useEffect, useState } from "react";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import TestScenarioService from "../../services/TestScenarioService";
import { useNavigate } from "react-router-dom";

const TestScenarioCreateScreen = (props: {
        SetShouldUpdate: (arg: boolean) => void,
        SetMenuToShow: (arg: TestScenarioMenuControlEnum) => void
    }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { selectedProject } = useGlobalSelectedProject();
    const navigate = useNavigate();
    
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
        <div style={{display: "flex", "flexDirection": "column"}}>
            <div>Novo cenário de teste</div>
            Nome: <input 
                    id="TestScenarioName" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"/>
            Descrição: <input 
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