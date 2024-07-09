import { useEffect, useState } from "react";
import TestCase from "../../models/TestCase";
import TestCaseService from "../../services/TestCaseService";
import "./TestCaseTable.css";
import { useNavigate } from "react-router-dom";

function TestCaseTable() {
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
    );
}

export default TestCaseTable;