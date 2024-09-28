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
import EditTestProjectScreen from './screens/Projects/EditTestCaseScreen';
import Header from './components/Header/Header';

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
      { path: "/builds", element: <>Builds</> },
      { path: "/executions", element: <>Execuções</> },
      { path: "/testplans", element: <>Planos de Teste</> },
      { path: "/projects", element: <TestProjectScreen /> },
      { path: "/criar_projeto", element: <CreateTestProjectScreen /> },
      { path: "/editar_projeto/:id", element: <EditTestProjectScreen /> },
      { path: "/settings", element: <>Configurações</> },
    ]
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);