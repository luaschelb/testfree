import Header from "../../components/Header/Header";
import TestProjectService from "../../services/TestProjectService";
import "./CreateTestProjectScreen.css";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTestProjectScreen() {
    const navigate = useNavigate();

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
            alert("Sucesso")
            navigate("/testprojects");
        } catch (error) {
            alert('Erro ao cadastrar projeto: ' + (error as Error).message);
        }
    }

    return (
        <>
            <Header />
            <div className="CreateTestProjectScreenContainer">
                <div className="CreateTestProjectScreenContainer__title">Tela de Criar de Projetos</div>
                <form onSubmit={submit}>
                    <div>Descrição do Projeto</div>
                    <input type="text" id="projectDescription"></input>
                    <div>Nome do Projeto</div>
                    <textarea id="projectName" rows={10} cols={50}></textarea>
                    <button type='submit'>Cadastrar</button>
                </form>
            </div>
        </>
    );
}

export default CreateTestProjectScreen;