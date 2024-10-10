class Execution {
    id: number;
    start_date: string;
    end_date: string;
    test_plan_id: number;
    build_id: number;

    constructor(id: number, start_date: string, end_date: string, test_plan_id: number, build_id: number) {
        this.id = id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.test_plan_id = test_plan_id;
        this.build_id = build_id;
    }
}

export default Execution;