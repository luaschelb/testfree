import { useEffect, useState } from "react";
import Execution from "../../models/Execution";
import TestPlanService from "../../services/TestPlanService";
import { useNavigate } from "react-router-dom";
import "../../shared_styles/BasicScreenContainer.css";
import "../../shared_styles/StyledTable.css";
import "../../shared_styles/ClickableOpacityIcon.css";
import "../../shared_styles/ClickableOpacityButton.css";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import { Button } from "@mui/material";
import ExecutionService from "../../services/ExecutionService";
import Build from "../../models/Build";
import { TestPlan } from "../../models/TestPlan";

function ExecutionScreen() {
    const [ executions, setExecutions ] = useState<Execution[]>([]);
    const { selectedProject } = useGlobalSelectedProject();
    const [ build, setBuild ] = useState<Build>();
    const [ testPlan, setTestPlan] = useState<TestPlan>();
    const navigate = useNavigate();

    useEffect(() => {
        ExecutionService.getAllExecutionsByProject(selectedProject).then((res : any) => {
            setExecutions(res);
            setTestPlan(res.test_plan_name)
            setBuild(res.build_version)
        });
    }, [selectedProject]);

    const handleDelete = async (id: number) => {
        if (window.confirm(`Tem certeza que deseja deletar a execução com ID ${id}?`)) {
            try {
                await ExecutionService.deleteExecution(id);
                alert("Execução deletado com sucesso");
                setExecutions(executions.filter(execution => execution.id !== id));
                navigate("/testplans");
            } catch (error) {
                alert('Erro ao deletar execução: ' + (error as Error).message);
            }
        }
    };

    return (
        <div className="BasicScreenContainer">
            <div style={{ fontSize: '2em' }}>Tela de Execuções</div>
            <div>
                <Button 
                    variant="contained"
                    color="info"
                    onClick={() => { navigate(`/criar_testplan`) }}
                >
                Adicionar Execução</Button> 
            </div>
            <div>
                <table className="styledTable">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Plano de Teste</th>
                            <th>Build</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {executions.map((execution: any) => (
                            <tr key={execution.execution_id}>
                                <td>{execution.execution_id}</td>
                                <td>{execution.test_plan_name}</td>
                                <td>{execution.build_version}</td>
                                <td>{execution.status}</td>
                                <td>
                                    <span className="ClickableOpacityIcon" onClick={() => { navigate(`/editar_execucao/${execution.execution_id}`) }}>
                                        ✏️
                                    </span>
                                    <span className="ClickableOpacityIcon" onClick={() => handleDelete(execution.execution_id)}>
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

export default ExecutionScreen;