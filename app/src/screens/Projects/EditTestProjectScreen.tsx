import TestProjectService from "../../services/TestProjectService";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import { Button } from "@mui/material";

function EditTestProjectScreen() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { setShouldUpdateProjectList } = useGlobalSelectedProject();

    const [formState, setFormState] = useState({
        name: "",
        description: "",
        initialName: "",
        initialDescription: ""
    });

    // Função para atualizar o estado de forma dinâmica
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    useEffect(() => {
        async function fetchTestProject() {
            try {
                const testProject = await TestProjectService.getTestProjectById(Number(id));
                setFormState({
                    name: testProject.name,
                    description: testProject.description,
                    initialName: testProject.name,
                    initialDescription: testProject.description
                });
            } catch (error) {
                alert('Erro ao carregar projeto: ' + (error as Error).message);
                navigate("/testcases");
            }
        }

        fetchTestProject();
    }, [id, navigate]);

    async function submit(event: FormEvent) {
        event.preventDefault();

        const { name, description, initialName, initialDescription } = formState;

        if (!name.trim() || !description.trim()) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        if (name === initialName && description === initialDescription) {
            alert('Nenhuma alteração foi feita.');
            return;
        }

        try {
            await TestProjectService.updateTestProject(Number(id), {
                name,
                description
            });
            setShouldUpdateProjectList(true)
            alert("Sucesso");
            navigate("/projetos");
        } catch (error) {
            alert('Erro ao atualizar projeto: ' + (error as Error).message);
        }
    }

    return (
        <div className="BasicScreenContainer">
            <Link to="/projetos">&lt; Voltar</Link>
            <h2 style={{margin: 0}}>Editar Projeto</h2>
            <form onSubmit={submit} className="BasicForm">
            <div className="InputLabel">Nome do Projeto</div>
                <input 
                    type="text"
                    id="name"
                    className="BasicFormInput"
                    value={formState.name}
                    onChange={handleChange}
                />
                <div className="InputLabel">Descrição do Projeto</div>
                <textarea 
                    id="description"
                    className="BasicFormDescription"
                    value={formState.description}
                    onChange={handleChange}
                />
                <div>
                    <Button variant="contained" onClick={submit}>Atualizar</Button>
                </div>
            </form>
        </div>
    );
}

export default EditTestProjectScreen;