import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import TestProject from "../../models/TestProject";
import TestProjectService from "../../services/TestProjectService";
import { useNavigate } from "react-router-dom";
import "./TestProjectScreen.css"

function TestProjectScreen() {
    const [testProjects, setTestProjects] = useState<TestProject[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        TestProjectService.getTestProjects().then((res) => {
            setTestProjects(res);
        });
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm(`Tem certeza que deseja deletar o projeto de teste com ID ${id}?`)) {
            try {
                await TestProjectService.deleteTestProject(id);
                alert("Projeto deletado com sucesso");
                setTestProjects(testProjects.filter(tc => tc.id !== id));
                navigate("/testProjects");
            } catch (error) {
                alert('Erro ao deletar projeto de teste: ' + (error as Error).message);
            }
        }
    };

    return (
        <>
            <Header />
            <div className="TestProjectScreenContainer">
                <div className="TestProjectScreenContainer__title">Tela de Projeto de Teste</div>
                <Link to="/create_testProjects" className="AddTestProjectButton">Adicionar Projeto</Link>
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
                            {testProjects.map((tc: TestProject) => (
                                <tr key={tc.id}>
                                    <td>{tc.id}</td>
                                    <td>{tc.name}</td>
                                    <td>{tc.description}</td>
                                    <td>
                                        <span className="ClickableOpacity" onClick={() => { navigate(`/edit_testProjects/${tc.id}`) }}>
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

export default TestProjectScreen;