import TestCase from "../models/TestCase";
import TestScenario from "../models/TestScenario";

class TestScenarioService {
    static async getTestScenarios(): Promise<TestScenario[]> {
        const response = await fetch("http://localhost:8080/scenarios/");
        if (!response.ok) {
            throw new Error('Erro ao buscar cenários de teste.');
        }
        const body = await response.json();
        const testScenarios = body.map((item: any) => new TestScenario(item.id, item.count, item.name, item.description, item.test_project_id));
        return testScenarios;
    }

    static async getTestScenariosEagerLoading(project_id : number): Promise<TestScenario[]> {
        const response = await fetch(`http://localhost:8080/scenarios/eager/${project_id}`);
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

    static async getTestScenariosEagerLoadingByTestPlans(project_id : number, testcasesIds : number[]): Promise<TestScenario[]> {
        const response = await fetch(`http://localhost:8080/scenarios/eager/${project_id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar cenários de teste.');
        }
        const body = await response.json();
        let scenariosFinais : TestScenario[] = [];
        const testScenariosTotais = body.map((item: any) => {
            let testCasesFilhos = item.test_cases
            let restantes = testCasesFilhos.filter((tc_filho : any) => {
                return testcasesIds.find((tc_id) => tc_id === tc_filho.id)
            })
            if(restantes.length !== 0)
            {
                let testScenario = new TestScenario(item.id, item.count, item.name, item.description, item.test_project_id)
                testScenario.testCases = restantes.map((testcase : any) => { return new TestCase(testcase.id, testcase.name, testcase.description, testcase.steps, testcase.test_scenario_id)})
                scenariosFinais.push(testScenario)
                return testScenario
            }
        });
        return scenariosFinais;
    }

    static async createTestScenario(data: { name: string, description: string, test_project_id: number }): Promise<Response> {
        const response = await fetch('http://localhost:8080/scenarios', {
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
        const response = await fetch(`http://localhost:8080/scenarios/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o cenário de teste.');
        }
        const item = await response.json();
        return new TestScenario(item.id, item.count, item.name, item.description, item.test_project_id);
    }

    static async updateTestScenario(id: number, data: { name: string, description: string, test_project_id: number }): Promise<Response> {
        const response = await fetch(`http://localhost:8080/scenarios/${id}`, {
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
        const response = await fetch(`http://localhost:8080/scenarios/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }
        return response;
    }
}

export default TestScenarioService;