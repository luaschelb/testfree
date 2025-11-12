import TestExecutionStatusEnum from "../enums/TestExecutionStatusEnum";
import Build from "./Build";
import TestCase from "./TestCase";
import TestExecutionTestCase from "./TestExecutionTestCase";
import { TestPlan } from "./TestPlan";
import TestScenario from "./TestScenario";

class Execution {
    id: number;
    title: string;
    start_date: Date;
    end_date: Date | null;
    status: number;
    comments: string;
    test_plan_id: number;
    build_id: number;

    // Relacionamentos
    build?: Build;
    test_plan?: TestPlan;
    scenarios: TestScenario[] = [];
    test_executions_test_cases?: TestExecutionTestCase[];

    constructor(
        id: number,
        title: string,
        start_date: Date,
        end_date: Date | null,
        test_plan_id: number,
        build_id: number,
        status: number,
        comments: string,
        build?: Build,
        test_plan?: TestPlan,
        scenarios: TestScenario[] = [],
        test_executions_test_cases?: TestExecutionTestCase[]
    ) {
        this.id = id;
        this.title = title;
        this.start_date = start_date;
        this.end_date = end_date;
        this.test_plan_id = test_plan_id;
        this.build_id = build_id;
        this.status = status;
        this.comments = comments;
        this.build = build;
        this.test_plan = test_plan;
        this.scenarios = scenarios;
        this.test_executions_test_cases = test_executions_test_cases;
    }

    mapStatusToString = (): string => {
        return TestExecutionStatusEnum[this.status];
    };
}

export default Execution;
