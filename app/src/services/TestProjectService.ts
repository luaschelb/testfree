import TestCounts from "../models/TestCounts";
import {TestProject, IProject} from "../models/TestProject";

class TestProjectService {
    static async getTestProjects(): Promise<TestProject[]> {
        const response = await fetch("http://localhost:8080/projetos/");
        if (!response.ok) {
            throw new Error('Erro ao buscar projetos de teste.');
        }
        const body = await response.json();
        const testProjects = body.map((item: any) => new TestProject({ ...item }));
        return testProjects;
    }

    static async createTestProject(data: IProject): Promise<Response> {
        const response = await fetch('http://localhost:8080/projetos', {
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

    static async getTestProjectById(id: number): Promise<TestProject> {
        const response = await fetch(`http://localhost:8080/projetos/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o projeto de teste.');
        }
        const item = await response.json();
        return new TestProject({ ...item });
    }
    // Função para pegar os counts do projeto de teste
    static async getTestProjectCounts(id: number): Promise<TestCounts> {
        const response = await fetch(`http://localhost:8080/projetos/count/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar os counts do projeto de teste.');
        }
        const counts: TestCounts = await response.json();
        return counts;
    }

    static async updateTestProject(id: number, data: IProject): Promise<Response> {
        const response = await fetch(`http://localhost:8080/projetos/${id}`, {
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

    static async deleteTestProject(id: number): Promise<Response> {
        const response = await fetch(`http://localhost:8080/projetos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }
        return response;
    }
}

export default TestProjectService;
