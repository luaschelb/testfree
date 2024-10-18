import { useEffect, useState } from "react";
import TestProject from "../../models/TestProject";
import TestProjectService from "../../services/TestProjectService";
import { useNavigate } from "react-router-dom";
import "../../shared_styles/BasicScreenContainer.css"
import "../../shared_styles/StyledTable.css"
import "../../shared_styles/ClickableOpacityIcon.css"
import "../../shared_styles/ClickableOpacityButton.css"
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import { Button } from "@mui/material";


function TestProjectScreen() {
    const { testProjects, setTestProjects } = useGlobalSelectedProject();
    const navigate = useNavigate();

    const handleDelete = async (id: number) => {
        if (window.confirm(`Tem certeza que deseja deletar o projeto de teste com ID ${id}?`)) {
            try {
                await TestProjectService.deleteTestProject(id);
                alert("Projeto deletado com sucesso");
                setTestProjects(testProjects.filter(tc => tc.id !== id));
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
                        {testProjects.map((tc: TestProject) => (
                            <tr key={tc.id}>
                                <td>{tc.id}</td>
                                <td>{tc.name}</td>
                                <td>{tc.description}</td>
                                <td>
                                    <span className="ClickableOpacityIcon" onClick={() => { navigate(`/editar_projeto/${tc.id}`) }}>
                                        ✏️
                                    </span>
                                    <span className="ClickableOpacityIcon" onClick={() => handleDelete(tc.id)}>
                                        🗑️
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TestProjectScreen;