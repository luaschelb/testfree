import Header from "../../components/Header/Header";
import TestCaseService from "../../services/TestCaseService";
import "./EditTestCaseScreen.css";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditTestCaseScreen() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [description, setDescription] = useState<string>("");
    const [steps, setSteps] = useState<string>("");
    const [initialDescription, setInitialDescription] = useState<string>("");
    const [initialSteps, setInitialSteps] = useState<string>("");

    useEffect(() => {
        async function fetchTestCase() {
            try {
                const testCase = await TestCaseService.getTestCaseById(Number(id));
                setDescription(testCase.description);
                setSteps(testCase.steps);
                setInitialDescription(testCase.description);
                setInitialSteps(testCase.steps);
            } catch (error) {
                alert('Erro ao carregar caso de teste: ' + (error as Error).message);
                navigate("/testcases");
            }
        }

        fetchTestCase();
    }, [id, navigate]);

    async function submit(event: FormEvent) {
        event.preventDefault();

        if (!description.trim() || !steps.trim()) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        if (description === initialDescription && steps === initialSteps) {
            alert('Nenhuma alteração foi feita.');
            return;
        }

        try {
            await TestCaseService.updateTestCase(Number(id), {
                description: description,
                steps: steps
            });
            alert("Sucesso");
            navigate("/testcases");
        } catch (error) {
            alert('Erro ao atualizar caso de teste: ' + (error as Error).message);
        }
    }

    return (
        <>
            <Header />
            <div className="EditTestCaseScreenContainer">
                <div className="EditTestCaseScreenContainer__title">Tela de Editar Casos de Uso</div>
                <form onSubmit={submit}>
                    <div>Descrição do Teste</div>
                    <input 
                        type="text" 
                        id="testDescription" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                    <div>Passos do Teste</div>
                    <textarea 
                        id="testSteps" 
                        rows={10} 
                        cols={50} 
                        value={steps} 
                        onChange={(e) => setSteps(e.target.value)} 
                    />
                    <button type='submit'>Atualizar</button>
                </form>
            </div>
        </>
    );
}

export default EditTestCaseScreen;