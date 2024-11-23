import { useEffect, useState, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import BuildService from "../../services/BuildService";
import Checkbox from '@mui/material/Checkbox';
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import "../../shared_styles/BasicForm.css"
import { Button } from "@mui/material";

function EditBuildScreen() {
    const { id } = useParams<{ id: string }>();
    const { selectedProject, setShouldUpdateProjectList } = useGlobalSelectedProject();
    const navigate = useNavigate();
    
    const [formState, setFormState] = useState({
        title: "",
        version: "",
        description: "",
        active: false,  // Defina como false inicialmente
        initialTitle: "",
        initialVersion: "",
        initialDescription: "",
        initialActive: false,  // Também inicialize com um valor booleano
    });

    useEffect(() => {
        async function fetchBuild() {
            try {
                const build = await BuildService.getBuildById(Number(id));
                setFormState({
                    title: build.title,
                    version: build.version,
                    description: build.description,
                    active: !!build.active,  // Garante que seja booleano
                    initialTitle: build.title,
                    initialVersion: build.version,
                    initialDescription: build.description,
                    initialActive: !!build.active,
                });
            } catch (error) {
                alert("Erro ao carregar build: " + (error as Error).message);
                navigate("/builds");
            }
        }
        fetchBuild();
    }, [id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prevState) => ({
            ...prevState,
            active: e.target.checked,
        }));
    };

    async function submit(event: FormEvent) {
        event.preventDefault();
        const { title, version, description, active, initialTitle, initialVersion, initialDescription, initialActive } = formState;

        if (!title || !version || !description) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        if (
            title === initialTitle &&
            version === initialVersion &&
            description === initialDescription &&
            active === initialActive
        ) {
            alert("Nenhuma alteração foi feita.");
            return;
        }

        try {
            await BuildService.updateBuild({
                id: Number(id),
                title,
                version,
                description,
                active,
                project_id: selectedProject,
            });
            setShouldUpdateProjectList(true);
            alert("Build atualizada com sucesso");
            navigate("/builds");
        } catch (error) {
            alert("Erro ao atualizar build: " + (error as Error).message);
        }
    }

    return (
        <div className="BasicScreenContainer">
            <Link to="/builds">&lt; Voltar</Link>
            <h2 style={{ margin: 0 }}>Editar Build</h2>
            <form onSubmit={submit} className="BasicForm">
                <div className="InputLabel">Título</div>
                <input
                    type="text"
                    id="title"
                    className="BasicFormInput"
                    value={formState.title}
                    onChange={handleChange}
                />
                <div className="InputLabel">Versão</div>
                <input
                    type="text"
                    id="version"
                    className="BasicFormInput"
                    value={formState.version}
                    onChange={handleChange}
                />
                <div className="InputLabel">Descrição</div>
                <textarea
                    className="BasicFormDescription"
                    id="description"
                    value={formState.description}
                    onChange={handleChange}
                />
                <div style={{display: "flex", alignItems: "center"}}>
                    <div className="InputLabel">Ativo</div>
                    <Checkbox
                        id="active"
                        checked={formState.active}  // Garante que é booleano
                        onChange={handleCheckboxChange}
                    />
                </div>
                <div>
                <Button variant="contained" onClick={submit}>Atualizar</Button>
                </div>
            </form>
        </div>
    );
}

export default EditBuildScreen;