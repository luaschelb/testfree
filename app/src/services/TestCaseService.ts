import TestCase from "../models/TestCase";

class TestCaseService {
    static async getTestCases() : Promise<TestCase[]> {
        const response = await fetch("http://localhost:8080/testcases/")
        const body = await response.json()
        const testCases = body.map((item : any) => { return new TestCase(item.id, item.description, item.steps)})
        return testCases
    }
    
    static async createTestCase(data : any) : Promise<Response> {
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
        return response
    }

}

export default TestCaseService;