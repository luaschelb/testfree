import BuildService from "../../services/BuildService";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import Checkbox from '@mui/material/Checkbox';

function CreateBuildScreen() {
    const { selectedProject } = useGlobalSelectedProject();
    const navigate = useNavigate();
    const { setShouldUpdateProjectList } = useGlobalSelectedProject();
    const [active, setActive] = useState(true)
    
    async function submit(event: FormEvent) {
        event.preventDefault();

        const title = (document.getElementById("title") as HTMLInputElement).value;
        const version = (document.getElementById("version") as HTMLInputElement).value;
        const description = (document.getElementById("description") as HTMLInputElement).value;

        if (
            !title ||
            !version ||
            !description ||
            !active
        ) {
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
            <form onSubmit={submit} style={{flex: 1, flexDirection: 'column', columnGap: "16px"}}>
                <div>Título</div>
                <input type="text" id="title"></input>
                <div>Versão</div>
                <input type="text" id="version"></input>
                <div>Descrição</div>
                <input type="text" id="description"></input>
                <div>Ativo</div>
                <Checkbox 
                    id="active"
                    checked={active}
                    onChange={(event) => setActive(event.target.checked)}
                    />
                <div>
                    <button type='submit'>Cadastrar</button>
                </div>
            </form>
        </div>
    );
}

export default CreateBuildScreen;