import TestCase from "../models/TestCase";

class TestCaseService {
    static async getTestCases(): Promise<TestCase[]> {
        const response = await fetch("http://localhost:8080/testcases/");
        if (!response.ok) {
            throw new Error('Erro ao buscar casos de teste.');
        }
        const body = await response.json();
        const testCases = body.map((item: any) => new TestCase(item.id, item.name, item.description, item.steps, item.testscenario_id));
        return testCases;
    }

    static async createTestCase(data: {name: string, description: string, steps: string, test_scenario_id: string}): Promise<Response> {
        const response = await fetch('http://localhost:8080/testcases', {
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

    static async getTestCaseById(id: number): Promise<TestCase> {
        const response = await fetch(`http://localhost:8080/testcases/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o caso de teste.');
        }
        const item = await response.json();
        return new TestCase(item.id, item.name, item.description, item.steps, item.testscenario_id);
    }

    static async updateTestCase(data : TestCase): Promise<Response> {
        const response = await fetch(`http://localhost:8080/testcases/${data.id}`, {
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

    static async deleteTestCase(id: number): Promise<Response> {
        const response = await fetch(`http://localhost:8080/testcases/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }
        return response;
    }
}

export default TestCaseService;
