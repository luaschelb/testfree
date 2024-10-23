import TestExecutionStatusEnum from "../enums/TestExecutionStatusEnum";
import Build from "./Build";
import TestCase from "./TestCase";
import { TestPlan } from "./TestPlan";

class Execution {
    id: number;
    start_date: string;
    status: number;
    comments: string;
    end_date: string;
    test_plan_id: number;
    build_id: number;
    testCases?: TestCase[];
    testPlan?: TestPlan;
    build?: Build;

    constructor(id: number, start_date: string, end_date: string, test_plan_id: number, build_id: number, status: number, comments: string) {
        this.id = id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.test_plan_id = test_plan_id;
        this.build_id = build_id;
        this.status = status;
        this.comments = comments;
    }
    
    mapStatusToString = () => {
        return TestExecutionStatusEnum[this.status]
    }
}

export default Execution;