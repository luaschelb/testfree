import { useEffect, useState } from "react";
import Build from "../../models/Build";
import BuildService from "../../services/BuildService";
import { useNavigate } from "react-router-dom";
import "../../shared_styles/BasicScreenContainer.css";
import "../../shared_styles/StyledTable.css";
import "../../shared_styles/ClickableOpacityIcon.css";
import "../../shared_styles/ClickableOpacityButton.css";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

function BuildScreen() {
    const [builds, setBuilds] = useState<Build[]>([]);
    const { selectedProject } = useGlobalSelectedProject();
    const navigate = useNavigate();

    useEffect(() => {
        BuildService.getBuildsByProjectId(selectedProject).then((res) => {
            setBuilds(res);
        });
    }, [selectedProject]);

    const handleDelete = async (id: number) => {
        if (window.confirm(`Tem certeza que deseja deletar o build com ID ${id}?`)) {
            try {
                await BuildService.deleteBuild(id);
                alert("Build deletado com sucesso");
                setBuilds(builds.filter(build => build.id !== id));
                navigate("/builds");
            } catch (error) {
                alert('Erro ao deletar build: ' + (error as Error).message);
            }
        }
    };

    return (
        <div className="BasicScreenContainer">
            <div style={{ fontSize: '2em' }}>Tela de Builds</div>
            <div>
                <Button 
                    variant="contained"
                    color="info"
                    onClick={() => { navigate(`/criar_build`) }}
                >
                Adicionar Build</Button> 
            </div>
            <div>
                <table className="styledTable">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Título</th>
                            <th>Versão</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            builds.length ? (
                                builds.map((build: Build) => (
                                <tr key={build.id}>
                                    <td>{build.id}</td>
                                    <td>{build.title}</td>
                                    <td>{build.version}</td>
                                    <td>{build.description}</td>
                                    <td>
                                        <Tooltip title="Editar">
                                            <IconButton aria-label="Editar" onClick={() => { navigate(`/editar_build/${build.id}`) }}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Deletar">
                                            <IconButton aria-label="Delete" onClick={() => handleDelete(build.id)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                                ))
                            ): (
                                <tr style={{marginTop: '6px'}}>
                                <td colSpan={5}>Não foram encontradas builds para o projeto selecionado</td></tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BuildScreen;
