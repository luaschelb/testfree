export default class File {
    id: number
    name: string
    path:  string
    test_executions_test_cases_id:  number
    
    constructor(id: number, name: string, path: string, test_executions_test_cases_id: number) {
        this.id = id
        this.name = name
        this.path = path
        this.test_executions_test_cases_id = test_executions_test_cases_id
    } 

}