import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import TestScenarioService from "../../services/TestScenarioService";
import { useNavigate } from "react-router-dom";
import "./TestScenarioScreen.css"
import TestScenario from "../../models/TestScenario";

function TestScenarioScreen() {
    const [TestScenario, setTestScenario] = useState<TestScenario[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        TestScenarioService.getTestScenarios().then((res) => {
            setTestScenario(res);
        });
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm(`Tem certeza que deseja deletar o caso de teste com ID ${id}?`)) {
            try {
                await TestScenarioService.deleteTestScenario(id);
                alert("Caso de teste deletado com sucesso");
                setTestScenario(TestScenario.filter(tc => tc.id !== id));
                navigate("/TestScenarios");
            } catch (error) {
                alert('Erro ao deletar caso de teste: ' + (error as Error).message);
            }
        }
    };

    return (
        <>
            <Header />
            <div className="TestScenarioScreenContainer">
                <div className="TestScenarioScreenContainer__title">Tela de Cenários de Teste</div>
                <div className="tableContainer">
                    <table className="styledTable">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TestScenario.map((tc: TestScenario) => (
                                <tr key={tc.id}>
                                    <td>{tc.id}</td>
                                    <td>{tc.name}</td>
                                    <td>{tc.description}</td>
                                    <td>
                                        <span className="ClickableOpacity" onClick={() => { navigate(`/edit_TestScenarios/${tc.id}`) }}>
                                            ✏️
                                        </span>
                                        <span className="ClickableOpacity" onClick={() => handleDelete(tc.id)}>
                                            🗑️
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default TestScenarioScreen;