import * as React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import "../../shared_styles/BasicScreenContainer.css"
import { useGlobalStatus } from '../../context/GlobalStatusContext';


export default function HomeScreen() {
  const { status } = useGlobalStatus(); // Usa o setStatus do contexto
  return (
    <div>
      <div className="BasicScreenContainer">
        <h1>Test Home Page {status}</h1>
        <p>Esta tela serve de placeholder para uma futura tela inicial</p>
        <p>Links para as outras páginas:</p>
        {/* Links aqui são redundantes, pois já estão no Drawer */}
        <Link to="/" className="HomeScreenLinks">Página Inicial</Link><br />
        <Link to="/scenarios" className="HomeScreenLinks">Cenários</Link><br />
        <Link to="/projects" className="HomeScreenLinks">Projetos</Link><br />
      </div>
    </div>
  );
}
