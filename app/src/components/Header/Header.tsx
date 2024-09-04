import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
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
import Settings from '@mui/icons-material/Settings';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import LadyBettleSvg from "../../resources/LadyBeetleSvg";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
	easing: theme.transitions.easing.sharp,
	duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
	transition: theme.transitions.create('margin', {
	  easing: theme.transitions.easing.easeOut,
	  duration: theme.transitions.duration.enteringScreen,
	}),
	marginLeft: 0,
  }),
}));

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

export default function Header() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
	{ text: "Página Inicial", to: "/", icon: <Home />},
	{ text: "Cenários", to: "/scenarios", icon: <Description />},
	{ text: "Builds", to: "/builds", icon: <Build />},
	{ text: "Execuções", to: "/executions", icon: <PlayArrow />},
	{ text: "Planos de Teste", to: "/testplans", icon: <Grid4x4 />},
	{ text: "Projetos", to: "/projects", icon: <Folder />},
	{ text: "Configurações", to: "/settings", icon: <Settings />},
  ];

  return (
	<Box sx={{ display: 'flex' }}>
	  <CssBaseline />
	  <AppBar position="fixed" open={open} >
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
			<LadyBettleSvg />
			<Typography variant="h6" noWrap component="div">
				Test Free
			</Typography>
		  </div>
		  <div style={{display: 'flex', columnGap: '8px', fontSize: '24'}}>
			<AccountCircle 
			/>
			Luana Schelb
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
		open={open}
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
	  <Main open={open}>
		<DrawerHeader />
	  </Main>
	</Box>
  );
}
