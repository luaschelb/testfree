import File from "./File"
import TestScenario from "./TestScenario"

class TestCase {
    id: number
    name: string
    description: string
    steps: string
    test_scenario_id: string
    test_execution_test_case_id?: number
    testscenario ?: TestScenario
    files ?: File[]
    status ?: number
    comment ?: string
    created_at ?: string
    
    constructor(id: number, name: string, description: string, steps: string, test_scenario_id: string) {
        this.id = id
        this.description = description
        this.steps = steps
        this.test_scenario_id = test_scenario_id
        this.name = name
        this.status = 0;
    } 

    mapStatusToString = () => {
        if(this.status === 0)
            return "Não executado"
        if(this.status === 1)
            return "Sucesso"
        if(this.status === 2)
            return "Pulado"
        if(this.status === 3)
            return "Com erros"
        return ""
    }
}

export default TestCase