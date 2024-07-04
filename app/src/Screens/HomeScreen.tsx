import { Link } from "react-router-dom";
import Header from "../components/Header/Header";

function HomeScreen() {
    return (
        <>
            <Header />
            <h1>Test Home Page</h1>
            <p>Esta tela serve de placeholder para uma futura tela inicial</p>
            <p>Links para as outras páginas:</p>
            <Link to="/">Home Page</Link>
            <Link to="/testcases">Test Cases</Link>
        </>
    )
}

export default HomeScreen;