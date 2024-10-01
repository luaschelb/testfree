class Build {
    id: number;
    title: string;
    version: string;
    description: string;
    active: boolean;
    project_id: number;

    constructor(id: number, title: string, version: string, description: string, active: boolean, project_id: number) {
        this.id = id;
        this.title = title;
        this.version = version;
        this.description = description;
        this.active = active;
        this.project_id = project_id;
    }
}

export default Build;