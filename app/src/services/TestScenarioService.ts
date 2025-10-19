import TestCase from "../models/TestCase";
import TestScenario from "../models/TestScenario";
import { apiRequest } from "./ApiService";

class TestScenarioService {
    static async getTestScenarios(): Promise<TestScenario[]> {
        const response = await apiRequest("/scenarios");
        if (!response.ok) {
            throw new Error('Erro ao buscar cenários de teste.');
        }
        const body = await response.json();
        const testScenarios = body.map((item: any) => new TestScenario(item.id, item.count, item.name, item.description, item.test_project_id));
        return testScenarios;
    }

    static async getTestScenariosEagerLoading(project_id : number): Promise<TestScenario[]> {
        const response = await apiRequest(`/scenarios/project/${project_id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar cenários de teste.');
        }
        const body = await response.json();
        const testScenarios = body.map((item: any) => {
            let testScenario = new TestScenario(item.id, item.count, item.name, item.description, item.test_project_id)
            testScenario.testCases = item.test_cases.map((testcase : any) => { return new TestCase(testcase.id, testcase.name, testcase.description, testcase.steps, testcase.test_scenario_id)})
            return testScenario
        });
        return testScenarios;
    }
    
    static async createTestScenario(data: { name: string, description: string, test_project_id: number }): Promise<Response> {
        const response = await apiRequest('/scenarios', {
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
        const response = await apiRequest(`/scenarios/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o cenário de teste.');
        }
        const item = await response.json();
        return new TestScenario(item.id, item.count, item.name, item.description, item.test_project_id);
    }

    static async updateTestScenario(id: number, data: { name: string, description: string, test_project_id: number }): Promise<Response> {
        const response = await apiRequest(`/scenarios/${id}`, {
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
        const response = await apiRequest(`/scenarios/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }
        return response;
    }
}

export default TestScenarioService;