import TestScenario from "./TestScenario"

class TestCase {
    id: number
    name: string
    description: string
    steps: string
    test_scenario_id: string
    testscenario ?: TestScenario
    files ?: File[]
    
    constructor(id: number, name: string, description: string, steps: string, test_scenario_id: string) {
        this.id = id
        this.description = description
        this.steps = steps
        this.test_scenario_id = test_scenario_id
        this.name = name
    } 

}

export default TestCase