import Header from "../../components/Header/Header";
import TestCase from "../../models/TestCase";
import TestCaseService from "../../services/TestCaseService";
import "./CreateTestCaseScreen.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTestCaseScreen() {
    const [description, setDescription] = useState("")
    const [steps, setSteps] = useState("")

    const navigate = useNavigate();

    async function submit() {
        if (!description.trim() || !steps.trim()) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        try {
            await TestCaseService.createTestCase({
                description: description,
                steps: steps
            })
            alert("Sucesso")
            navigate("/testcases");
        } catch (error) {
            alert('Erro ao cadastrar caso de teste: ' + (error as Error).message);
        }
    }

    return (
        <>
            <Header />
            <div className="CreateTestCaseScreenContainer">
                <div className="CreateTestCaseScreenContainer__title">Tela de Criar de Casos de Uso</div>
                <form onSubmit={(event)=>{event.preventDefault();submit()}}>
                    <div>Descrição do Teste</div>
                    <input type="text" id="testDescription"></input>
                    <div>Passos do Teste</div>
                    <textarea id="testSteps" rows={10} cols={50}></textarea>
                    <button type='submit'>Cadastrar</button>
                </form>
            </div>
        </>
    );
}

export default CreateTestCaseScreen;