import TestScenario from "./TestScenario"

class TestCase {
    id: number
    description: string
    steps: string
    testcenario_id: string
    testscenario ?: TestScenario
    
    constructor(id: number, description: string, steps: string, testcenario_id: string) {
        this.id = id
        this.description = description
        this.steps = steps
        this.testcenario_id = testcenario_id
    } 

}

export default TestCase