import TestExecutionTestCase from "../models/TestExecutionTestCase";
import { apiRequest } from "./ApiService";

export default class TestExecutionTestCaseService {
    static async createTestExecutionTestCase(data: TestExecutionTestCase): Promise<Response> {
        const response = await apiRequest('/testexecutions_testcases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erro.');
        }
        return response;
    }

    static async updateTestExecutionTestCase(data : TestExecutionTestCase): Promise<Response> {
        const response = await apiRequest(`/testexecutions_testcases/${data.id}`, {
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
}