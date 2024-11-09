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
import TestPlanScreen from './screens/TestPlan/TestPlanScreen';
import CreateTestPlanScreen from './screens/TestPlan/CreateTestPlanScreen';
import EditTestPlanScreen from './screens/TestPlan/EditTestPlanScreen';
import ListExecutionScreen from './screens/Executions/ListExecutionScreen';
import CreateExecutionScreen from './screens/Executions/CreateExecutionScreen';
import EditExecutionScreen from './screens/Executions/EditExecutionScreen';
import RunExecutionScreen from './screens/Executions/RunExecutionScreen';
import ReportScreen from './screens/Reports/ReportScreen';

const Layout = () => (
  <div>
    <Header />
    <Outlet />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomeScreen /> },
      { path: "/scenarios", element: <TestScenarioScreen /> },
      { path: "/builds", element: <BuildScreen /> },
      { path: "/criar_build", element: <CreateBuildScreen /> },
      { path: "/editar_build/:id", element: <EditBuildScreen /> },
      { path: "/execucoes", element: <ListExecutionScreen /> },
      { path: "/criar_execucao", element: <CreateExecutionScreen /> },
      { path: "/editarr_execucao", element: <EditExecutionScreen /> },
      { path: "/executar_execucao/:id", element: <RunExecutionScreen /> },
      { path: "/testplans", element: <TestPlanScreen /> },
      { path: "/criar_testplan", element: <CreateTestPlanScreen /> },
      { path: "/editar_testplan/:id", element: <EditTestPlanScreen /> },
      { path: "/projetos", element: <TestProjectScreen /> },
      { path: "/criar_projeto", element: <CreateTestProjectScreen /> },
      { path: "/editar_projeto/:id", element: <EditTestProjectScreen /> },
      { path: "/relatorios/:id", element: <ReportScreen /> },
    ]
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalSelectedProjectProvider>
      <RouterProvider router={router} />
    </GlobalSelectedProjectProvider>
  </React.StrictMode>
);