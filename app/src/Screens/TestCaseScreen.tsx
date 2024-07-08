import Header from "../components/Header/Header";
import TestCaseTable from "../components/TestCaseTable/TestCaseTable";
import "./TestCaseScreen.css"

function TestCaseScreen() {
    return (
        <>
            <Header />
            <div className="TestCaseScreenContainer">
                <span className="TestCaseScreenContainer__title">Tela de Casos de Uso</span>
                <button className="AddTestCaseButton">Adicionar Caso de Teste</button>
                <TestCaseTable />
            </div>
        </>
    )
}

export default TestCaseScreen;