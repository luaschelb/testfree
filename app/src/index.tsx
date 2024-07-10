import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomeScreen from './screens/HomeScreen/HomeScreen';
import TestCaseScreen from './screens/TestCaseScreen/TestCaseScreen';
import CreateTestCaseScreen from './screens/CreateTestCaseScreen/CreateTestCaseScreen';
import EditTestCaseScreen from './screens/EditTestCaseScreen/EditTestCaseScreen';
import TestProjectScreen from './screens/TestProjectScreen/TestProjectScreen';
import CreateTestProjectScreen from './screens/CreateTestProjectScreen/CreateTestProjectScreen';
import EditTestProjectScreen from './screens/EditTestProjectScreen/EditTestCaseScreen';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />
  },
  {
    path: "/testcases",
    element: <TestCaseScreen />
  },
  {
    path: "/testprojects",
    element: <TestProjectScreen />
  },
  {
    path: "/create_testprojects",
    element: <CreateTestProjectScreen />
  },
  {
    path: "/edit_testprojects/:id",
    element: <EditTestProjectScreen />
  },
  {
    path: "/create_testcases",
    element: <CreateTestCaseScreen />
  },
  {
    path: "/edit_testcases/:id",
    element: <EditTestCaseScreen />
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);