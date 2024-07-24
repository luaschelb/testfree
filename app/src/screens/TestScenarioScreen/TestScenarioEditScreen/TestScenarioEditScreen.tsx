import TestScenario from "../../../models/TestScenario";

const handleUpdateScenarioClick = (id: number, testProjectId : number) => {
    alert("não implementado")
}

const TestScenarioEditScreen = (props: {lastClicked : TestScenario}) => (
    <div style={{display: "flex", "flexDirection": "column"}}>
        <div>Cenário de Teste</div>
        <h3>{props.lastClicked.test_id} - {props.lastClicked.name}</h3>
        id: <input 
                id="TestScenarioId" 
                value={props.lastClicked.test_id}
                type="text"
            />
        name: <input 
                id="TestScenarioName" 
                value={props.lastClicked.name}
                type="text"/>
        description: <input 
                id="TestScenarioDescription" 
                value={props.lastClicked.description}
                type="text"/>
        <button 
            onClick={() => handleUpdateScenarioClick(props.lastClicked.id, props.lastClicked.testProjectId)}>
            Atualizar
        </button>
    </div> 
)

export default TestScenarioEditScreen;