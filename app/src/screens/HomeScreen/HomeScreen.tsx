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
                <Link to="/" className="HomeScreenLinks">Página Inicial</Link>
                <Link to="/scenarios"className="HomeScreenLinks">Cenários</Link>
                <Link to="/projetos"className="HomeScreenLinks">Projetos</Link>
            </div>
        </>
    )
}

export default HomeScreen;