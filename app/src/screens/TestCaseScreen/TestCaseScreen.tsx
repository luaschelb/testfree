import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import TestCaseTable from "../../components/TestCaseTable/TestCaseTable";
import "./TestCaseScreen.css"

function TestCaseScreen() {
    return (
        <>
            <Header />
            <div className="TestCaseScreenContainer">
                <div className="TestCaseScreenContainer__title">Tela de Casos de Uso</div>
                <Link to="/create_testcases" className="AddTestCaseButton">Adicionar Caso de Teste</Link>
                <TestCaseTable />
            </div>
        </>
    )
}

export default TestCaseScreen;