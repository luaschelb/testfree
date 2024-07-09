class TestScenario {
    id: number;
    name: string;
    description: string;
    testProjectId: number;

    constructor(id: number, name: string, description: string, testProjectId: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.testProjectId = testProjectId;
    }
}

export default TestScenario;
