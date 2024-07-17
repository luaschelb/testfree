import TestScenario from "./TestScenario"

class TestCase {
    id: number
    test_id: string
    name: string
    description: string
    steps: string
    testscenario_id: string
    testscenario ?: TestScenario
    
    constructor(id: number, test_id: string, name: string, description: string, steps: string, testscenario_id: string) {
        this.id = id
        this.test_id = test_id
        this.description = description
        this.steps = steps
        this.testscenario_id = testscenario_id
        this.name = name
    } 

}

export default TestCase