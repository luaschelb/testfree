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
    path: "/create_testcases",
    element: <CreateTestCaseScreen />
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