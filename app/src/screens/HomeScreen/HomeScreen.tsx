import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./HomeScreen.css"

function HomeScreen() {
    return (
        <>
            <Header />
            <div className="HomeScreenContainer">
                <h1>Test Home Page</h1>
                <p>Esta tela serve de placeholder para uma futura tela inicial</p>
                <p>Links para as outras páginas:</p>
                <Link to="/" className="HomeScreenLinks">Home Page</Link>
                <Link to="/testcases"className="HomeScreenLinks">Test Cases</Link>
                <Link to="/testprojects"className="HomeScreenLinks">Test Projects</Link>
            </div>
        </>
    )
}

export default HomeScreen;