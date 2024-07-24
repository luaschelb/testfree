import TestCase from "../../../models/TestCase";
import TestScenario from "../../../models/TestScenario";

let TreeViewComponent = (props : {
    testScenarios: TestScenario[], 
    SetTestScenarios: (arg: TestScenario[]) => void
    SetLastClicked: (arg : TestScenario | TestCase | null) => void

}) => (
    <div className="TreeViewComponent">
    {
        props.testScenarios.map((scenario, index) => (
            <div key={scenario.id}>
                <span 
                    className="ClickableOpacityTreeView"
                    onClick={() => {
                        let newData = props.testScenarios.map((c, i) => {
                            if (i === index)
                                c.isOpen = !c.isOpen
                            return c;
                        })
                        props.SetLastClicked(scenario)
                        props.SetTestScenarios(newData)
                    }}
                    >
                    <span style={{paddingRight: "8px"}}>
                        {scenario.isOpen ? "➖" : "➕"}
                    </span>
                    <span>
                        {scenario.isOpen ? "📂" : "📁"}
                    </span>
                    {`${scenario.test_id}: ${scenario.name}`}
                </span>
                {
                    scenario.isOpen 
                        && 
                    <div className="TreeViewTestCases">
                        {scenario.testCases.map((testcase, index) => (
                            <span 
                                key={testcase.id}
                                className="TreeViewTestCase"
                                onClick={() => {
                                    props.SetLastClicked(testcase)
                                }}
                                >
                                {`📄 ${testcase.test_id}: ${testcase.name}`}
                            </span>
                        ))}
                    </div>  
                }
            </div>
        ))
    }
    </div>
)

export default TreeViewComponent