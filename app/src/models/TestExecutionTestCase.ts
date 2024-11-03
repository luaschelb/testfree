export default class TestExecutionTestCase {
    id ?: number
    created_at: string
    comment: string
    passed: number
    skipped: number
    failed: number
    test_execution_id: number
    test_case_id: number

    constructor(
        created_at: string,
        comment: string,
        passed: number,
        skipped: number,
        failed: number,
        test_execution_id: number,
        test_case_id: number
    ) {
        this.created_at = created_at
        this.comment = comment
        this.passed = passed
        this.skipped = skipped
        this.failed = failed
        this.test_execution_id = test_execution_id
        this.test_case_id = test_case_id
    }
}