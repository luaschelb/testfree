import Execution from "../models/Execution"; // Assuma que você tem esse modelo
import File from "../models/File";
import TestCase from "../models/TestCase"; // Assuma que você tem esse modelo para test cases
import TestExecutionTestCase from "../models/TestExecutionTestCase";
import TestScenario from "../models/TestScenario";
import { apiRequest } from "./ApiService";

class ExecutionService {
    // Buscar todas as execuções por project
    static async getAllExecutionsByProject(project_id : number): Promise<any> {
        const response = await apiRequest(`/executions/project/${project_id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar execuções.');
        }
        const body = await response.json();
        return body
    }

static async getExecutionById(id: number): Promise<Execution> {
    const response = await apiRequest(`/executions/${id}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar a execução.');
    }

    const item = await response.json();

    // Criar objeto Execution
    const execution = new Execution(
        item.id,
        item.title,
        item.start_date,
        item.end_date,
        item.test_plan_id,
        item.build_id,
        item.status,
        item.comments
    );

    // Associar build e test_plan
    execution.build = item.build;
    execution.test_plan = item.test_plan;

    // Mapear test_executions_test_cases
    execution.test_executions_test_cases = item.test_executions_test_cases?.map((tetc: any) => {
        const testCaseData = tetc.test_case;

        const tc = new TestCase(
            testCaseData.id,
            testCaseData.name,
            testCaseData.description,
            testCaseData.steps || "",
            testCaseData.test_scenario_id.toString()
        );

        const testExecTC = new TestExecutionTestCase(
            tetc.created_at,
            tetc.comment,
            tetc.status,
            tetc.test_execution_id,
            tetc.test_case_id
        );
        console.log(tetc.files)
        let files : File[]= []
        files = tetc.files.map((f : any) => {
            return new File(f.id, f.name, f.path, tetc.id)
        })
        testExecTC.files = files;
        testExecTC.id = tetc.id;
        testExecTC.test_case = tc;
        tc.test_execution_test_case_id = tetc.id;

        return testExecTC;
    }) || [];

    // Mapear cenários e test cases
    execution.scenarios = item.scenarios?.map((scenario: any) => {
        const ts = new TestScenario(
            scenario.id,
            scenario.id.toString(),
            scenario.name,
            scenario.description,
            item.test_plan_id
        );

        ts.testCases = scenario.testCases?.map((tcData: any) => {
            const tc = new TestCase(
                tcData.id,
                tcData.name,
                tcData.description,
                tcData.steps || "",
                tcData.test_scenario_id.toString()
            );
            return tc;
        }) || [];

        return ts;
    }) || [];

    return execution;
}

    // Criar uma nova execução
    static async createExecution(data: { start_date: Date, end_date: Date | null, test_plan_id: number, build_id: number, status?: number, comments?: string }): Promise<Response> {
        const response = await apiRequest('/executions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erro ao criar a execução.');
        }
        return response;
    }

    // Atualizar uma execução
    static async updateExecution(data: Execution): Promise<Response> {
        const response = await apiRequest(`/executions/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar a execução.');
        }
        return response;
    }

    // Deletar uma execução
    static async deleteExecution(id: number): Promise<Response> {
        const response = await apiRequest(`/executions/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao deletar a execução.');
        }
        return response;
    }

    // Vincular um caso de teste a uma execução
    static async linkTestCaseToExecution(executionId: number, testCaseId: number): Promise<Response> {
        const response = await apiRequest('/executions/link-test-case', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ test_execution_id: executionId, test_case_id: testCaseId }),
        });
        if (!response.ok) {
            throw new Error('Erro ao vincular o caso de teste à execução.');
        }
        return response;
    }

    // Desvincular um caso de teste de uma execução
    static async unlinkTestCaseFromExecution(executionId: number, testCaseId: number): Promise<Response> {
        const response = await apiRequest('/executions/unlink-test-case', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ test_execution_id: executionId, test_case_id: testCaseId }),
        });
        if (!response.ok) {
            throw new Error('Erro ao desvincular o caso de teste da execução.');
        }
        return response;
    }

    // Vincular um arquivo a um caso de teste em uma execução
    static async linkFileToTestCase(data: { name: string, path: string, test_executions_test_cases_id: number }): Promise<Response> {
        const response = await apiRequest('/executions/link-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erro ao vincular o arquivo ao caso de teste.');
        }
        return response;
    }

    // Desvincular um arquivo de um caso de teste em uma execução
    static async unlinkFileFromTestCase(fileId: number): Promise<Response> {
        const response = await apiRequest(`/executions/unlink-file/${fileId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao desvincular o arquivo.');
        }
        return response;
    }
}

export default ExecutionService;
