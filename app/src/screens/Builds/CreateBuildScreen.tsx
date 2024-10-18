import BuildService from "../../services/BuildService";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import Checkbox from '@mui/material/Checkbox';
import { Button } from "@mui/material";
import "../../shared_styles/BasicForm.css"

function CreateBuildScreen() {
    const { selectedProject } = useGlobalSelectedProject();
    const navigate = useNavigate();
    const { setShouldUpdateProjectList } = useGlobalSelectedProject();
    const [active, setActive] = useState(true)
    const [title, setTitle] = useState("")
    const [version, setVersion] = useState("")
    const [description, setDescription] = useState("")
    
    async function submit(event: FormEvent) {
        event.preventDefault();

        if ( !title || !version || !description || !active ) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        try {
            await BuildService.createBuild({
                title: title,
                version: version,
                description: description,
                active: active,
                project_id: selectedProject
            })
            setShouldUpdateProjectList(true)
            alert("Sucesso")
            navigate("/Builds");
        } catch (error) {
            alert('Erro ao cadastrar Build: ' + (error as Error).message);
        }
    }

    return (
        <div className="BasicScreenContainer">
            <Link to="/Builds">&lt; Voltar</Link>
            <h2 style={{margin: 0}}>Criar Build</h2>
            <form onSubmit={submit} className="BasicForm">
                <div className="InputLabel">Título</div>
                <input 
                    type="text" 
                    className="BasicFormInput"
                    value={title}
                    onChange={(event) => {setTitle(event.target.value)}}
                />
                <div className="InputLabel">Versão</div>
                <input 
                    type="text" 
                    className="BasicFormInput"
                    value={version}
                    onChange={(event) => {setVersion(event.target.value)}}
                />
                <div className="InputLabel">Descrição</div>
                <textarea 
                    value={description}
                    className="BasicFormDescription"
                    onChange={(event) => {setDescription(event.target.value)}}
                />
                <div style={{display: "flex", alignItems: "center"}}>
                    <div className="InputLabel">Ativo</div>
                    <Checkbox 
                        id="active"
                        checked={active}
                        onChange={(event) => setActive(event.target.checked)}
                        />
                </div>
                <div>
                    <Button variant="contained" onClick={submit}>Cadastrar</Button>
                </div>
            </form>
        </div>
    );
}

export default CreateBuildScreen;