import { Link } from "react-router-dom";
import "./Header.css"
import LadyBettleSvg from "../../resources/LadyBeetleSvg";

function Header() {
    return (
        <div className="HeaderContainer">
            <Link className="HeaderLink" to="/">
            <LadyBettleSvg />
                Test Free
            </Link>
            <Link className="HeaderLink" to="/testcases">Test Cases</Link>
            <button>Sair</button>
        </div>
    );
  }
  
  export default Header;
  