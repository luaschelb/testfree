import Build from "../models/Build";
import { apiRequest } from "./ApiService";

class BuildService {
    static async getBuildsByProjectId(project_id : number): Promise<Build[]> {
        const response = await apiRequest(`/builds/project/${project_id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar builds.');
        }
        const body = await response.json();
        let builds = []
        if(body?.builds?.length > 0)
        {
            builds = body.builds.map((item: any) => new Build(item.id, item.title, item.version, item.description, item.active, item.project_id));
        }
        return builds;
    }

    static async createBuild(data: { title: string, version: string, description: string, active: boolean, project_id: number }): Promise<Response> {
        const response = await apiRequest('/builds', {
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

    static async getBuildById(id: number): Promise<Build> {
        const response = await apiRequest(`/builds/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o build.');
        }
        const item = await response.json();
        return new Build(item.id, item.title, item.version, item.description, item.active, item.project_id);
    }

    static async updateBuild(data: Build): Promise<Response> {
        const response = await apiRequest(`/builds/${data.id}`, {
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

    static async deleteBuild(id: number): Promise<Response> {
        const response = await apiRequest(`/builds/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }
        return response;
    }
}

export default BuildService;
