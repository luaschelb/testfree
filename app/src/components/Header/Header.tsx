import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Home from '@mui/icons-material/Home';
import Description from '@mui/icons-material/Description';
import Build from '@mui/icons-material/Build';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Grid4x4 from '@mui/icons-material/Grid4x4';
import Folder from '@mui/icons-material/Folder';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import LadyBettleSvg from "../../resources/LadyBeetleSvg";
import { useGlobalSelectedProject } from '../../context/GlobalSelectedProjectContext'; // Importa o hook

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
	easing: theme.transitions.easing.sharp,
	duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
	width: `calc(100% - ${drawerWidth}px)`,
	marginLeft: `${drawerWidth}px`,
	transition: theme.transitions.create(['margin', 'width'], {
	  easing: theme.transitions.easing.easeOut,
	  duration: theme.transitions.duration.enteringScreen,
	}),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Header(args: {
	open: boolean,
	setOpen: (args: boolean) => void
	handleDrawerOpen: () => void
	handleDrawerClose: () => void
}) {
  const theme = useTheme();

  const handleDrawerToggle = () => {
	if(!args.open)
		args.handleDrawerOpen()
	else
		args.handleDrawerClose()
  }

  const { selectedProject, setSelectedProject, testProjects} = useGlobalSelectedProject(); // Usa o setStatus do contexto

  const menuItems = [
	{ text: "Página Inicial", to: "/", icon: <Home />},
	{ text: "Cenários", to: "/scenarios", icon: <Description />},
	{ text: "Builds", to: "/builds", icon: <Build />},
	{ text: "Execuções", to: "/execucoes", icon: <PlayArrow />},
	{ text: "Planos de Teste", to: "/testplans", icon: <Grid4x4 />},
	{ text: "Projetos", to: "/projetos", icon: <Folder />},
	//{ text: "Configurações", to: "/configuracoes", icon: <Settings />},
  ];

  return (
	<Box sx={{ display: 'flex' }}>
	  <CssBaseline />
	  <AppBar position="fixed" open={args.open} sx={{ backgroundColor: '#BFE0EB', color: "black", fontWeight: "bold", fontSize: '24px'}}>
		<Toolbar
			sx={{display: 'flex', justifyContent: "space-between"}}
		>
		  <div 
			style={{
				display: 'flex',
				alignItems: 'center',
				cursor: "pointer"
			}}
			onClick={handleDrawerToggle}
			>
			<IconButton
				color="inherit"
				aria-label="open drawer"
				onClick={handleDrawerToggle}
				edge="start"
				sx={{ mr: 2 }}
				>
			<MenuIcon />
		  </IconButton>
			<LadyBettleSvg/>
			Test Free
		  </div>
		  <div style={{marginRight: '10%'}}>
			<span style={{fontSize: "14px", paddingRight: "6px"}}>Selecione um projeto para trabalhar: </span>
		  <select
		  	id="selectProject"
		  	value={selectedProject}
			onChange={(event) => {
				window.localStorage.setItem('selectedProject', event.target.value)
				setSelectedProject(parseInt(event.target.value))
			}}
		  >
			<option value={0}>Selecione um projeto</option>
			{
				testProjects.map((project) => (
					<option key={project.id} value={project.id}>{project.name}</option>
				))
			}
		  </select>
		  </div>
		</Toolbar>
	  </AppBar>
	  <Drawer
		sx={{
		  width: drawerWidth,
		  flexShrink: 0,
		  '& .MuiDrawer-paper': {
			width: drawerWidth,
			boxSizing: 'border-box',
		  },
		}}
		variant="persistent"
		anchor="left"
		open={args.open}
	  >
		<DrawerHeader>
		  <IconButton onClick={handleDrawerToggle}>
			{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
		  </IconButton>
		</DrawerHeader>
		<Divider />
		<List>
		  {menuItems.map((item) => (
			<ListItem key={item.text} disablePadding>
			  <ListItemButton component={Link} to={item.to}>
				{item.icon}
				<ListItemText 
					primary={item.text} 
					sx={{marginLeft: 2}}	
				/>
			  </ListItemButton>
			</ListItem>
		  ))}
		</List>
	  </Drawer>
	</Box>
  );
}
