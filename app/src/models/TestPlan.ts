export class TestPlan {
    id: number;
    name: string;
    description: string;
    active: boolean;
    project_id: number;
    testCases: number[] = [];

    constructor(id: number, name: string, description: string, active: boolean, project_id: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.active = active;
        this.project_id = project_id;
    }
}