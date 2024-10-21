import TestCase from "../../models/TestCase";
import TestScenario from "../../models/TestScenario";
import TestScenarioMenuControlEnum from "../../enums/TestScenarioMenuControlEnum";

const TreeViewComponent = (props : {
    testScenarios: TestScenario[], 
    SetTestScenarios: (arg: TestScenario[]) => void
    SetLastClicked: (arg : TestScenario | TestCase | null) => void
    SetMenuToShow: (arg: TestScenarioMenuControlEnum) => void
}) => {
    const handleCollapseAll = () => {
        let newData = props.testScenarios.map((c, i) => { c.isOpen = false; return c;})
        props.SetTestScenarios(newData)
    }

    const handleExpandAll = () => {
        let newData = props.testScenarios.map((c, i) => { c.isOpen = true; return c;})
        props.SetTestScenarios(newData)
    }

    return (
        <div className="TreeViewComponent" style={{userSelect: 'none'}}>
            {/* <span className="ClickableOpacityTreeView" style={{width: "fit-content"}}onClick={handleCollapseAll}>Collapse All</span>
            <span className="ClickableOpacityTreeView" style={{width: "fit-content"}}onClick={handleExpandAll}>Expand All</span> */}
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
                            props.SetTestScenarios(newData)
                        }}
                        >
                        <span style={{paddingRight: "8px"}}>
                            {scenario.isOpen ? "➖" : "➕"}
                        </span>
                        <span>
                            {scenario.isOpen ? "📂" : "📁"}
                        </span>
                    </span>
                    <span 
                        className="ClickableOpacityTreeView"
                        onClick={() => {
                            props.SetLastClicked(scenario)
                            props.SetMenuToShow(TestScenarioMenuControlEnum.EDIT_TEST_SCENARIO)
                        }}
                        >
                            {`${scenario.name}`}
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
                                        props.SetMenuToShow(TestScenarioMenuControlEnum.EDIT_TEST_CASE)
                                        props.SetLastClicked(testcase)
                                    }}
                                    >
                                    {`📄 ${testcase.name}`}
                                </span>
                            ))}
                        </div>  
                    }
                </div>
            ))
        }
        </div>
    )
}

export default TreeViewComponent