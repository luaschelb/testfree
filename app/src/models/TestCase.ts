class TestCase {
    id?: number
    description?: string
    steps?: string
    
    constructor(id: number, description: string, steps: string) {
        this.id = id
        this.description = description
        this.steps = steps
    } 
}

export default TestCase