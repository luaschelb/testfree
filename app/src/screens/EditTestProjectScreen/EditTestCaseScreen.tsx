import Header from "../../components/Header/Header";
import TestProjectService from "../../services/TestProjectService";
import "./EditTestProjectScreen.css";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditTestProjectScreen() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [description, setDescription] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [initialDescription, setInitialDescription] = useState<string>("");
    const [initialName, setInitialName] = useState<string>("");

    useEffect(() => {
        async function fetchTestProject() {
            try {
                const testProject = await TestProjectService.getTestProjectById(Number(id));
                setDescription(testProject.description);
                setName(testProject.name);
                setInitialDescription(testProject.description);
                setInitialName(testProject.name);
            } catch (error) {
                alert('Erro ao carregar projeto: ' + (error as Error).message);
                navigate("/testcases");
            }
        }

        fetchTestProject();
    }, [id, navigate]);

    async function submit(event: FormEvent) {
        event.preventDefault();

        if (!description.trim() || !name.trim()) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        if (description === initialDescription && name === initialName) {
            alert('Nenhuma alteração foi feita.');
            return;
        }

        try {
            await TestProjectService.updateTestProject(Number(id), {
                description: description,
                name: name
            });
            alert("Sucesso");
            navigate("/testprojects");
        } catch (error) {
            alert('Erro ao atualizar projeto: ' + (error as Error).message);
        }
    }

    return (
        <>
            <Header />
            <div className="EditTestProjectScreenContainer">
                <div className="EditTestProjectScreenContainer__title">Tela de Editar Projeto</div>
                <form onSubmit={submit}>
                    <div>Descrição do Projeto</div>
                    <input 
                        type="text" 
                        id="testDescription" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                    <div>Nome do Projeto</div>
                    <textarea 
                        id="testName" 
                        rows={10} 
                        cols={50} 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                    <button type='submit'>Atualizar</button>
                </form>
            </div>
        </>
    );
}

export default EditTestProjectScreen;