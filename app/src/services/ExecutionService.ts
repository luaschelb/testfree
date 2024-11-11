import Execution from "../models/Execution"; // Assuma que você tem esse modelo
import TestCase from "../models/TestCase"; // Assuma que você tem esse modelo para test cases

class ExecutionService {
    // Buscar todas as execuções
    static async getAllExecutions(): Promise<Execution[]> {
        const response = await fetch('http://localhost:8080/executions/list');
        if (!response.ok) {
            throw new Error('Erro ao buscar execuções.');
        }
        const body = await response.json();
        return body.map((item: any) => new Execution(item.id, item.start_date, item.end_date, item.test_plan_id, item.build_id, item.status, item.comments));
    }

    // Buscar todas as execuções por project
    static async getAllExecutionsByProject(project_id : number): Promise<any> {
        const response = await fetch(`http://localhost:8080/executions/project/${project_id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar execuções.');
        }
        const body = await response.json();
        return body
    }

    // Buscar execução por ID (incluindo casos de teste e arquivos)
    static async getExecutionById(id: number): Promise<Execution> {
        const response = await fetch(`http://localhost:8080/executions/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar a execução.');
        }
        const item = await response.json();
        
        // Criar o objeto Execution e associar os test cases e arquivos
        let execution = new Execution(item.execution.id, item.execution.start_date, item.execution.end_date, item.execution.test_plan_id, item.execution.build_id, item.execution.status, item.execution.comments);
        execution.testCases = item.test_cases.map((testCase: any) => {
            let tc = new TestCase(testCase.id, testCase.name, testCase.description, testCase.steps, testCase.test_scenario_id);
            if(testCase.passed)
                tc.status = 1
            else if(testCase.skipped)
                tc.status = 2
            else if(testCase.failed)
                tc.status = 3
            tc.comment = testCase.comment
            tc.files = testCase.files;
            tc.created_at = testCase.created_at;
            tc.test_execution_test_case_id = testCase.test_execution_test_case_id;
            console.log(tc)
            return tc;
        });
        return execution;
    }

    // Criar uma nova execução
    static async createExecution(data: { start_date: string, end_date: string, test_plan_id: number, build_id: number, status?: number, comments?: string }): Promise<Response> {
        const response = await fetch('http://localhost:8080/executions', {
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
        const response = await fetch(`http://localhost:8080/executions/${data.id}`, {
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
        const response = await fetch(`http://localhost:8080/executions/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao deletar a execução.');
        }
        return response;
    }

    // Vincular um caso de teste a uma execução
    static async linkTestCaseToExecution(executionId: number, testCaseId: number): Promise<Response> {
        const response = await fetch('http://localhost:8080/executions/link-test-case', {
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
        const response = await fetch('http://localhost:8080/executions/unlink-test-case', {
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
        const response = await fetch('http://localhost:8080/executions/link-file', {
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
        const response = await fetch(`http://localhost:8080/executions/unlink-file/${fileId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao desvincular o arquivo.');
        }
        return response;
    }
}

export default ExecutionService;
