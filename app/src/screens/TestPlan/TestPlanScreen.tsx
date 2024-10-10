import { useEffect, useState } from "react";
import { TestPlan } from "../../models/TestPlan";
import TestPlanService from "../../services/TestPlanService";
import { useNavigate } from "react-router-dom";
import "../../shared_styles/BasicScreenContainer.css";
import "../../shared_styles/StyledTable.css";
import "../../shared_styles/ClickableOpacityIcon.css";
import "../../shared_styles/ClickableOpacityButton.css";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";

function TestPlanScreen() {
    const [testPlans, setTestPlans] = useState<TestPlan[]>([]);
    const { selectedProject } = useGlobalSelectedProject();
    const navigate = useNavigate();

    useEffect(() => {
        TestPlanService.getTestPlansByProjectId(selectedProject).then((res) => {
            setTestPlans(res);
        });
    }, [selectedProject]);

    const handleDelete = async (id: number) => {
        if (window.confirm(`Tem certeza que deseja deletar o plano de teste com ID ${id}?`)) {
            try {
                await TestPlanService.deleteTestPlan(id);
                alert("Plano de teste deletado com sucesso");
                setTestPlans(testPlans.filter(plan => plan.id !== id));
                navigate("/test-plans");
            } catch (error) {
                alert('Erro ao deletar plano de teste: ' + (error as Error).message);
            }
        }
    };

    return (
        <div className="BasicScreenContainer">
            <div style={{ fontSize: '2em' }}>Tela de Planos de Teste</div>
            <div
                onClick={() => { navigate(`/criar_testplan`) }}
                className="ClickableOpacityButton"
            >
                Adicionar Plano de Teste
            </div>
            <div>
                <table className="styledTable">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testPlans.map((plan: TestPlan) => (
                            <tr key={plan.id}>
                                <td>{plan.id}</td>
                                <td>{plan.name}</td>
                                <td>{plan.description}</td>
                                <td>{plan.active ? "Ativo" : "Inativo"}</td>
                                <td>
                                    <span className="ClickableOpacityIcon" onClick={() => { navigate(`/editar_testplan/${plan.id}`) }}>
                                        ✏️
                                    </span>
                                    <span className="ClickableOpacityIcon" onClick={() => handleDelete(plan.id)}>
                                        🗑️
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TestPlanScreen;