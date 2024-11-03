import TestCase from "../models/TestCase";
import { TestPlan } from "../models/TestPlan";

class TestPlanService {
    // Buscar todos os planos de teste
    static async getAllTestPlans(): Promise<TestPlan[]> {
        const response = await fetch('http://localhost:8080/test-plans');
        if (!response.ok) {
            throw new Error('Erro ao buscar planos de teste.');
        }
        const body = await response.json();
        return body.map((item: any) => new TestPlan(item.id, item.name, item.description, item.active, item.project_id));
    }

    static async getTestPlansByProjectId(project_id : number): Promise<TestPlan[]> {
        const response = await fetch(`http://localhost:8080/test-plans/project/${project_id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar test-plans.');
        }
        const body = await response.json();
        const testplans = body.map((item: any) => {
            let testplan = new TestPlan(item.id, item.name, item.description, item.active, item.project_id);
            testplan.testCases = item.test_cases
            return testplan
        });
        return testplans;
    }

    // Buscar um plano de teste por ID
    static async getTestPlanByIdEager(id: number): Promise<TestPlan> {
        const response = await fetch(`http://localhost:8080/test-plans/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o plano de teste.');
        }
        const item = await response.json();
        let testplan = new TestPlan(item.id, item.name, item.description, item.active, item.project_id);
        testplan.testCases = item.test_cases;
        return testplan;
    }

    // Criar um novo plano de teste
    static async createTestPlan(data: { name: string, description: string, active: boolean, project_id: number }): Promise<Response> {
        const response = await fetch('http://localhost:8080/test-plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erro ao criar o plano de teste.');
        }
        return response;
    }

    // Atualizar um plano de teste
    static async updateTestPlan(data: TestPlan): Promise<Response> {
        const response = await fetch(`http://localhost:8080/test-plans/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar o plano de teste.');
        }
        return response;
    }

    // Deletar um plano de teste
    static async deleteTestPlan(id: number): Promise<Response> {
        const response = await fetch(`http://localhost:8080/test-plans/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao deletar o plano de teste.');
        }
        return response;
    }

    // Vincular um caso de teste a um plano de teste
    static async linkTestCaseToTestPlan(testPlanId: number, testCaseId: number): Promise<Response> {
        const response = await fetch(`http://localhost:8080/test-plans/${testPlanId}/test-cases/${testCaseId}`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('Erro ao vincular o caso de teste ao plano de teste.');
        }
        return response;
    }

    // Desvincular um caso de teste de um plano de teste
    static async unlinkTestCaseFromTestPlan(testPlanId: number, testCaseId: number): Promise<Response> {
        const response = await fetch(`http://localhost:8080/test-plans/${testPlanId}/test-cases/${testCaseId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao desvincular o caso de teste do plano de teste.');
        }
        return response;
    }

    // Vincular múltiplos casos de teste a um plano de teste
    static async linkMultipleTestCases(testPlanId: number, testCaseIds: number[]): Promise<Response> {
        const response = await fetch(`http://localhost:8080/test-plans/${testPlanId}/test-cases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ testCaseIds }),
        });
        if (!response.ok) {
            throw new Error('Erro ao vincular múltiplos casos de teste ao plano de teste.');
        }
        return response;
    }
}

export default TestPlanService;