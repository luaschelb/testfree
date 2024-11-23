import { useEffect, useState } from "react";
import TestProject from "../../models/TestProject";
import TestProjectService from "../../services/TestProjectService";
import { useNavigate } from "react-router-dom";
import "../../shared_styles/BasicScreenContainer.css"
import "../../shared_styles/StyledTable.css"
import "../../shared_styles/ClickableOpacityIcon.css"
import "../../shared_styles/ClickableOpacityButton.css"
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { red } from '@mui/material/colors';

const color = red[400];

function TestProjectScreen() {
    const { testProjects, setTestProjects, setShouldUpdateProjectList } = useGlobalSelectedProject();
    const navigate = useNavigate();

    const handleDelete = async (id: number) => {
        if (window.confirm(`Tem certeza que deseja deletar o projeto de teste com ID ${id}?`)) {
            try {
                await TestProjectService.deleteTestProject(id);
                alert("Projeto deletado com sucesso");
                setTestProjects(testProjects.filter(tc => tc.id !== id));
                setShouldUpdateProjectList(true)
                navigate("/projetos");
            } catch (error) {
                alert('Erro ao deletar projeto de teste: ' + (error as Error).message);
            }
        }
    };

    return (
        <div className="BasicScreenContainer">
            <div style={{fontSize: '2em'}}>Tela de Projetos</div>
            <div>
                <Button 
                    variant="contained"
                    color="info"
                    onClick={() => { navigate(`/criar_projeto`) }}
                >Adicionar Projeto</Button> 
            </div>
            <div >
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
                        {
                            testProjects.length ? (
                                testProjects.map((tc: TestProject) => (
                                    <tr key={tc.id}>
                                        <td>{tc.id}</td>
                                        <td>{tc.name}</td>
                                        <td>{tc.description}</td>
                                        <td>
                                            <Tooltip title="Editar">
                                                <IconButton aria-label="Editar" onClick={() => { navigate(`/editar_projeto/${tc.id}`) }}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Deletar">
                                                <IconButton aria-label="Delete" onClick={() => handleDelete(tc.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))): (
                                <tr style={{marginTop: '6px'}}>
                                <td colSpan={5}>Não foi encontrado nenhum projeto. Crie um para iniciar o uso da aplicação</td></tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TestProjectScreen;