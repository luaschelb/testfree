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
            <Link className={location.pathname === "/testcases" ? "HeaderLink HeaderLinkActive" : "HeaderLink"} to="/testcases">Test Cases/Cenarios</Link>
            <Link className={location.pathname === "/testprojects" ? "HeaderLink HeaderLinkActive" : "HeaderLink"} to="/testprojects">Test Projects</Link>
            <button>Sair</button>
        </div>
    );
  }
  
  export default Header;
  