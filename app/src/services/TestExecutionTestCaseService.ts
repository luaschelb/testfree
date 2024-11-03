import TestExecutionTestCase from "../models/TestExecutionTestCase";

export default class TestExecutionTestCaseService {
    static async createTestExecutionTestCase(data: TestExecutionTestCase): Promise<Response> {
        const response = await fetch('http://localhost:8080/testexecutions_testcases', {
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
        const response = await fetch(`http://localhost:8080/testexecutions_testcases/${data.id}`, {
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