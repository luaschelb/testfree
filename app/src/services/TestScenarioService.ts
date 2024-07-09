import TestScenario from "../models/TestScenario";

class TestScenarioService {
    static async getTestScenarios(): Promise<TestScenario[]> {
        const response = await fetch("http://localhost:8080/testscenarios/");
        if (!response.ok) {
            throw new Error('Erro ao buscar cenários de teste.');
        }
        const body = await response.json();
        const testScenarios = body.map((item: any) => new TestScenario(item.id, item.name, item.description, item.testproject_id));
        return testScenarios;
    }

    static async createTestScenario(data: { name: string, description: string, testproject_id: number }): Promise<Response> {
        const response = await fetch('http://localhost:8080/testscenarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }
        return response;
    }

    static async getTestScenarioById(id: number): Promise<TestScenario> {
        const response = await fetch(`http://localhost:8080/testscenarios/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o cenário de teste.');
        }
        const item = await response.json();
        return new TestScenario(item.id, item.name, item.description, item.testproject_id);
    }

    static async updateTestScenario(id: number, data: { name: string, description: string, testproject_id: number }): Promise<Response> {
        const response = await fetch(`http://localhost:8080/testscenarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }
        return response;
    }

    static async deleteTestScenario(id: number): Promise<Response> {
        const response = await fetch(`http://localhost:8080/testscenarios/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }
        return response;
    }
}

export default TestScenarioService;