import TestCase from "../models/TestCase";

class TestCaseService {
    static async getTestCases() : Promise<TestCase[]> {
        const response = await fetch("http://localhost:8080/testcases/")
        const body = await response.json()
        const testCases = body.map((item : any) => { return new TestCase(item.id, item.description, item.steps)})
        return testCases
    }
}

export default TestCaseService;