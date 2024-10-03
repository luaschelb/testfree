import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import HomeScreen from './screens/HomeScreen/HomeScreen';
import TestScenarioScreen from './screens/TestScenarioScreen/TestScenarioScreen';
import TestProjectScreen from './screens/Projects/TestProjectScreen';
import CreateTestProjectScreen from './screens/Projects/CreateTestProjectScreen';
import EditTestProjectScreen from './screens/Projects/EditTestProjectScreen';
import Header from './components/Header/Header';
import BuildScreen from './screens/Builds/BuildScreen';
import { GlobalSelectedProjectProvider } from './context/GlobalSelectedProjectContext';
import CreateBuildScreen from './screens/Builds/CreateBuildScreen';
import EditBuildScreen from './screens/Builds/EditBuildScreen';

const Layout = () => (
  <div>
    <Header />
    <Outlet />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Usa o Layout para incluir o Header
    children: [
      { path: "/", element: <HomeScreen /> },
      { path: "/scenarios", element: <TestScenarioScreen /> },
      { path: "/builds", element: <BuildScreen /> },
      { path: "/criar_build", element: <CreateBuildScreen /> },
      { path: "/editar_build/:id", element: <EditBuildScreen /> },
      { path: "/executions", element: <>Execuções</> },
      { path: "/testplans", element: <>Planos de Teste</> },
      { path: "/projetos", element: <TestProjectScreen /> },
      { path: "/criar_projeto", element: <CreateTestProjectScreen /> },
      { path: "/editar_projeto/:id", element: <EditTestProjectScreen /> },
      { path: "/configuracoes", element: <>Configurações</> },
    ]
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalSelectedProjectProvider> {/* Envolva a aplicação */}
      <RouterProvider router={router} />
    </GlobalSelectedProjectProvider>
  </React.StrictMode>
);