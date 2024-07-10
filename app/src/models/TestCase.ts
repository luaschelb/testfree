import TestScenario from "./TestScenario"

class TestCase {
    id: number
    description: string
    steps: string
    testscenario_id: string
    testscenario ?: TestScenario
    
    constructor(id: number, description: string, steps: string, testscenario_id: string) {
        this.id = id
        this.description = description
        this.steps = steps
        this.testscenario_id = testscenario_id
    } 

}

export default TestCase