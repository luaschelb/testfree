import { Link } from "react-router-dom";
import "./Header.css"
import LadyBettleSvg from "../../resources/LadyBeetleSvg";
import { useLocation } from 'react-router-dom'

function Header() {
    const location = useLocation();

    return (
        <div className="HeaderContainer">
            <Link className={location.pathname === "/" ? "HeaderLink HeaderLinkActive" : "HeaderLink"} to="/">
                <div className="HeaderClickableLogo">
                    <LadyBettleSvg />
                    Test Free
                </div>
            </Link>
            <Link className={location.pathname === "/cenarios" ? "HeaderLink HeaderLinkActive" : "HeaderLink"} to="/cenarios">Cenários</Link>
            <Link className={location.pathname === "/projetos" ? "HeaderLink HeaderLinkActive" : "HeaderLink"} to="/projetos">Projetos</Link>
            <button>Sair</button>
        </div>
    );
  }
  
  export default Header;
  