import { Link } from "react-router-dom";
import "./Header.css"
import LadyBettleSvg from "../../resources/LadyBeetleSvg";

function Header() {
    return (
        <div className="HeaderContainer">
            <Link className="HeaderLink" to="/">
            <div className="HeaderClickableLogo">
                <LadyBettleSvg />
                Test Free
            </div>
            </Link>
            <Link className="HeaderLink" to="/testcases">Test Cases</Link>
            <button>Sair</button>
        </div>
    );
  }
  
  export default Header;
  