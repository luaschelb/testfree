import TestCase from "./TestCase"
import File from "./File";

export default class TestExecutionTestCase {
    id ?: number
    created_at: string
    comment: string
    status: number
    test_execution_id: number
    test_case_id: number
    files? : File[]
    test_case?: TestCase

    constructor(
        created_at: string,
        comment: string,
        status: number,
        test_execution_id: number,
        test_case_id: number
    ) {
        this.created_at = created_at
        this.comment = comment
        this.status = status
        this.test_execution_id = test_execution_id
        this.test_case_id = test_case_id
    }
}