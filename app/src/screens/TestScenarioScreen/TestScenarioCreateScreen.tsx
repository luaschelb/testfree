import { FormEvent, useState } from "react";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import TestScenarioService from "../../services/TestScenarioService";
import "../../shared_styles/BasicForm.css"
import { Button } from "@mui/material";

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
            props.SetMenuToShow(TestScenarioMenuControlEnum.DEFAULT)
        } catch (error) {
            alert('Erro ao cadastrar cenário: ' + (error as Error).message);
        }
    }

    return (
        <form className="BasicForm">
            <div style={{fontWeight: "bold", fontSize: "16px", margin: 0, padding: 0, border: 0}}>Novo cenário de teste</div>
            <div className="InputLabel">Nome:</div>
            <input
                    id="TestScenarioName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"/>
            <div className="InputLabel">Descrição:</div>
            <textarea
                    id="TestScenarioDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3} />
            <div>
                <Button size="small" variant="contained"
                    onClick={(event) => submit(event)}>
                    Cadastrar
                </Button>
            </div>
        </form>
    )
}

export default TestScenarioCreateScreen;