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
import RunExecutionScreen from './screens/Executions/RunExecutionScreen';
import ReportScreen from './screens/Reports/ReportScreen';
import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  marginTop: 60,
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
	easing: theme.transitions.easing.sharp,
	duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `0px`,
  ...(open && {
	transition: theme.transitions.create('margin', {
	  easing: theme.transitions.easing.easeOut,
	  duration: theme.transitions.duration.enteringScreen,
	}),
	marginLeft: drawerWidth,
  }),
}));

const Layout = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Header 
	      open = {open}
	      setOpen = {setOpen}
	      handleDrawerOpen = {handleDrawerOpen}
	      handleDrawerClose = {handleDrawerClose}
      />
      <Main open={open}>
        <Outlet />
      </Main>
    </div>
  )
};

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