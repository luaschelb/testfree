import TestProjectService from "../../services/TestProjectService";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";

function CreateTestProjectScreen() {
    const navigate = useNavigate();
    const { setShouldUpdateProjectList } = useGlobalSelectedProject();

    async function submit(event: FormEvent) {
        event.preventDefault();

        const description = (document.getElementById("projectDescription") as HTMLInputElement).value;
        const name = (document.getElementById("projectName") as HTMLTextAreaElement).value;

        if (!description.trim() || !name.trim()) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        try {
            await TestProjectService.createTestProject({
                description: description,
                name: name
            })
            setShouldUpdateProjectList(true)
            alert("Sucesso")
            navigate("/projetos");
        } catch (error) {
            alert('Erro ao cadastrar projeto: ' + (error as Error).message);
        }
    }

    return (
        <div className="BasicScreenContainer">
            <Link to="/projetos">&lt; Voltar</Link>
            <h2 style={{margin: 0}}>Criar Projeto</h2>
            <form onSubmit={submit} style={{flex: 1, flexDirection: 'column', columnGap: "16px"}}>
                <div>Nome do Projeto</div>
                <input type="text" id="projectName"></input>
                <div>Descrição do Projeto</div>
                <textarea id="projectDescription" rows={10} cols={50}></textarea>
                <div>
                    <button type='submit'>Cadastrar</button>
                </div>
            </form>
        </div>
    );
}

export default CreateTestProjectScreen;