import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomeScreen from './screens/HomeScreen/HomeScreen';
import TestCaseScreen from './screens/TestCaseScreen/TestCaseScreen';
import Header from './components/Header/Header';
import CreateTestCaseScreen from './screens/CreateTestCaseScreen/CreateTestCaseScreen';
import EditTestCaseScreen from './screens/EditTestCaseScreen/EditTestCaseScreen';
import TestProjectScreen from './screens/TestProjectScreen/TestProjectScreen';


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