import { Link } from "react-router-dom";
import "./Header.css"

function Header() {
    return (
        <div className="HeaderContainer">
            <Link className="HeaderLink" to="/">🐞Test Free</Link>
            <Link className="HeaderLink" to="/testcases">Test Cases</Link>
            <button>Sair</button>
        </div>
    );
  }
  
  export default Header;
  