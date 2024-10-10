import Execution from "../models/Execution";

interface ExecutionData {
    id?: number;
    start_date: string;
    end_date: string;
    test_plan_id: number;
    build_id: number;
}

class ExecutionService {
    // Buscar todas as execuções por test_plan_id
    static async getExecutionsByTestPlanId(test_plan_id: number): Promise<Execution[]> {
        const response = await fetch(`http://localhost:8080/executions/test-plan/${test_plan_id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar execuções.');
        }
        const body = await response.json();
        return body.map((item: any) => new Execution(item.id, item.start_date, item.end_date, item.test_plan_id, item.build_id));
    }

    // Criar uma nova execução
    static async createExecution(data: ExecutionData): Promise<Response> {
        const response = await fetch('http://localhost:8080/executions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Erro no servidor ao criar execução.');
        }
        return response;
    }

    // Buscar uma execução por ID
    static async getExecutionById(id: number): Promise<Execution> {
        const response = await fetch(`http://localhost:8080/executions/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar execução.');
        }
        const item = await response.json();
        return new Execution(item.id, item.start_date, item.end_date, item.test_plan_id, item.build_id);
    }

    // Atualizar uma execução existente
    static async updateExecution(data: ExecutionData): Promise<Response> {
        const response = await fetch(`http://localhost:8080/executions/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Erro no servidor ao atualizar execução.');
        }
        return response;
    }

    // Deletar uma execução por ID
    static async deleteExecution(id: number): Promise<Response> {
        const response = await fetch(`http://localhost:8080/executions/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Erro no servidor ao deletar execução.');
        }
        return response;
    }
}

export default ExecutionService;