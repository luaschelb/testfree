import TestProjectService from "../../services/TestProjectService";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import "../../shared_styles/BasicForm.css"
import { Button } from "@mui/material";
import { TestPlan } from "../../models/TestPlan";
import TestPlanService from "../../services/TestPlanService";
import BuildService from "../../services/BuildService";
import Build from "../../models/Build";
import ExecutionService from "../../services/ExecutionService";

function CreateExecutionScreen() {
    const navigate = useNavigate();
    const { selectedProject, setShouldUpdateProjectList } = useGlobalSelectedProject();
    const [ testPlans, setTestPlans ] = useState<TestPlan[]>([]);
    const [ testPlanId, setTestPlanId ] = useState<number>(0);
    const [ builds, setBuilds ] = useState<Build[]>([]);
    const [ buildId, setBuildId ] = useState<number>(0);

    useEffect(() => {
        TestPlanService.getTestPlansByProjectId(selectedProject).then((res) => {
            if(res.length === 0)
            {
                return
            }
            setTestPlanId(res[0].id);
            setTestPlans(res);
        }).then(() => {
            BuildService.getBuildsByProjectId(selectedProject).then((res) => {
                if(res.length === 0)
                {
                    return
                }
                setBuildId(res[0].id);
                setBuilds(res);
            })
        })
    }, [selectedProject]);

    async function submit(event: FormEvent) {
        event.preventDefault();

        try {
            await ExecutionService.createExecution({
                start_date: "2024-09-28",
                end_date: "2024-09-28",
                test_plan_id: testPlanId,
                build_id: buildId,
            })
            setShouldUpdateProjectList(true)
            alert("Sucesso")
            navigate("/execucoes");
        } catch (error) {
            alert('Erro ao cadastrar Execução: ' + (error as Error).message);
        }
    }

    return (
        <div className="BasicScreenContainer">
            <Link to="/execucoes">&lt; Voltar</Link>
            <h2 style={{margin: 0}}>Criar Execução</h2>
            <form onSubmit={submit} className="BasicForm">
                {/* <div 
                    className="InputLabel">Nome do Execução</div>
                <input 
                    type="text"
                    className="BasicFormInput"
                    id="projectName"></input> */}
                <b>Plano de Teste:<span style={{color: "red"}}>*</span></b> 
                <select 
                    style={{height: "1.8rem"}}
                    value={testPlanId}
                    onChange={(event) => {
                        setTestPlanId(parseInt(event.target.value))
                    }}>
                    {
                        testPlans.map((tp) => <option value={tp.id} key={tp.id}>{tp.name}</option>)
                    }
                </select>
                <b>Build:<span style={{color: "red"}}>*</span></b> 
                <select 
                    style={{height: "1.8rem"}}
                    value={buildId}
                    onChange={(event) => {
                        setBuildId(parseInt(event.target.value))
                    }}>
                    {
                        builds.map((build) => <option value={build.id} key={build.id}>{build.title}</option>)
                    }
                </select>
                <div style={{display: "flex", flexDirection: "column", gap: "2px", marginTop: "8px"}}>
                    <Button variant="contained" onClick={submit}
                    //disabled={!builds.length || !testPlans.length}
                    style={{width: "fit-content" }}
                    >Cadastrar</Button>
                    {/* {
                        !builds.length || !testPlans.length ? (
                        <span style={{fontSize: "12px", color: "red"}}>Campos Build e Plano de Teste são obrigatórios</span>
                    ) : null
                    } */}
                </div>
            </form>
        </div>
    );
}

export default CreateExecutionScreen;