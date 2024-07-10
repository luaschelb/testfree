import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomeScreen from './screens/HomeScreen/HomeScreen';
import TestScenarioScreen from './screens/TestScenarioScreen/TestScenarioScreen';
import TestProjectScreen from './screens/TestProjectScreen/TestProjectScreen';
import CreateTestProjectScreen from './screens/CreateTestProjectScreen/CreateTestProjectScreen';
import EditTestProjectScreen from './screens/EditTestProjectScreen/EditTestCaseScreen';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />
  },
  {
    path: "/cenarios",
    element: <TestScenarioScreen />
  },
  {
    path: "/projetos",
    element: <TestProjectScreen />
  },
  {
    path: "/criar_projeto",
    element: <CreateTestProjectScreen />
  },
  {
    path: "/editar_projeto/:id",
    element: <EditTestProjectScreen />
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