import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import TestCase from "../../models/TestCase";
import TestCaseService from "../../services/TestCaseService";
import { useNavigate } from "react-router-dom";
import "./TestCaseScreen.css"

function TestCaseScreen() {
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        TestCaseService.getTestCases().then((res) => {
            setTestCases(res);
        });
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm(`Tem certeza que deseja deletar o caso de teste com ID ${id}?`)) {
            try {
                await TestCaseService.deleteTestCase(id);
                alert("Caso de teste deletado com sucesso");
                setTestCases(testCases.filter(tc => tc.id !== id));
                navigate("/testcases");
            } catch (error) {
                alert('Erro ao deletar caso de teste: ' + (error as Error).message);
            }
        }
    };

    return (
        <>
            <Header />
            <div className="TestCaseScreenContainer">
                <div className="TestCaseScreenContainer__title">Tela de Casos de Uso</div>
                <Link to="/create_testcases" className="AddTestCaseButton">Adicionar Caso de Teste</Link>
                <div className="tableContainer">
                    <table className="styledTable">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Descrição</th>
                                <th>Passos</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testCases.map((tc: TestCase) => (
                                <tr key={tc.id}>
                                    <td>{tc.id}</td>
                                    <td>{tc.description}</td>
                                    <td>{tc.steps}</td>
                                    <td>
                                        <span className="ClickableOpacity" onClick={() => { navigate(`/edit_testcases/${tc.id}`) }}>
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

export default TestCaseScreen;