import TestCase from "./TestCase";

class TestScenario {
    id: number;
    test_id: string
    name: string;
    description: string;
    testProjectId: number;
    isOpen?: boolean;
    testCases: TestCase[] = [];

    constructor(id: number, test_id: string, name: string, description: string, testProjectId: number) {
        this.id = id;
        this.test_id = test_id;
        this.name = name;
        this.description = description;
        this.testProjectId = testProjectId;
        this.isOpen = true;
    }
}

export default TestScenario;
