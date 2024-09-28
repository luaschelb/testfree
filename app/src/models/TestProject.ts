export interface IProject {
    name: string,
    description: string
}

export class TestProject implements IProject{
    id: number;
    name: string;
    description: string;

    constructor({ id, name, description }: { id: number, name: string, description: string }) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export default TestProject