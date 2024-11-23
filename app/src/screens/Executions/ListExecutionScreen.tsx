import { useEffect, useState } from "react";
import Execution from "../../models/Execution";
import { useNavigate } from "react-router-dom";
import "../../shared_styles/BasicScreenContainer.css";
import "../../shared_styles/StyledTable.css";
import "../../shared_styles/ClickableOpacityIcon.css";
import "../../shared_styles/ClickableOpacityButton.css";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import { Button, IconButton, Tooltip } from "@mui/material";
import ExecutionService from "../../services/ExecutionService";
import Build from "../../models/Build";
import { TestPlan } from "../../models/TestPlan";
import { Delete, PlayArrow } from "@mui/icons-material";
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TestExecutionStatusEnum from "../../enums/TestExecutionStatusEnum";

function ListExecutionScreen() {
    const [ executions, setExecutions ] = useState<Execution[]>([]);
    const { selectedProject } = useGlobalSelectedProject();
    const [ build, setBuild ] = useState<Build>();
    const [ testPlan, setTestPlan] = useState<TestPlan>();
    const [ shouldRefresh, setShouldRefresh] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        ExecutionService.getAllExecutionsByProject(selectedProject).then((res : any) => {
            setExecutions(res);
            setTestPlan(res.test_plan_name)
            setBuild(res.build_version)
            setShouldRefresh(false)
        });
    }, [selectedProject, shouldRefresh]);

    const handleDelete = async (id: number) => {
        if (window.confirm(`Tem certeza que deseja deletar a execução com ID ${id}?`)) {
            try {
                await ExecutionService.deleteExecution(id);
                alert("Execução deletado com sucesso");
                setExecutions(executions.filter((execution : any) => execution.execution_id !== id));
                navigate("/execucoes");
                //setShouldRefresh(true)
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
                    onClick={() => { navigate(`/criar_execucao`) }}
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
                        {
                            executions.length ? (
                                executions.map((execution: any) => (
                                    <tr key={execution?.execution_id}>
                                        <td>{execution?.execution_id}</td>
                                        <td>{execution?.test_plan_name}</td>
                                        <td>{execution?.build_version}</td>
                                        <td>{TestExecutionStatusEnum[execution?.status]}</td>
                                        <td>
                                            <div style={{flex: 1, alignContent: "center"}}>
                                                <Tooltip title="Executar">
                                                    <IconButton aria-label="PlayArrow" color="success" onClick={() => { navigate(`/executar_execucao/${execution?.execution_id}`) }}>
                                                        <PlayArrow />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Deletar">
                                                    <IconButton aria-label="Delete" onClick={() => handleDelete(execution?.execution_id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Baixar Relatório">
                                                    <IconButton aria-label="FileDownloadIcon" color="primary" onClick={() => { navigate(`/relatorios/${execution?.execution_id}`)}}>
                                                        <FileDownloadIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ): (
                                <tr style={{marginTop: '6px'}}>
                                <td colSpan={5}>Não foram encontradas execuções para o projeto selecionado</td></tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListExecutionScreen;