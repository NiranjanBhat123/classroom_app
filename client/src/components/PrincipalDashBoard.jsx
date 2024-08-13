import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  CssBaseline,
  IconButton,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  PersonAdd as PersonAddIcon,
  ClassOutlined as ClassIcon,
  PeopleOutline as PeopleIcon,
  AssignmentInd as AssignmentIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import AddTeacher from './dashboard/AddTeacher';
import CreateClassroom from './dashboard/CreateClassroom';
import UserList from './dashboard/UserList';
import AssignClassroom from './dashboard/AssignClassroom';

const drawerWidth = 240;

function PrincipalDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Add Teacher', 'Create Classroom', 'User List', 'Assign Classroom'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton 
              onClick={() => setSelectedOption(text)}
              sx={{
                bgcolor: selectedOption === text ? '#eee' : 'transparent',
              }}
            >
              <ListItemIcon>
                {index === 0 ? <PersonAddIcon /> : 
                 index === 1 ? <ClassIcon /> : 
                 index === 2 ? <PeopleIcon /> : <AssignmentIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const renderContent = () => {
    switch (selectedOption) {
      case 'Add Teacher':
        return <AddTeacher />;
      case 'Create Classroom':
        return <CreateClassroom />;
      case 'User List':
        return <UserList />;
      case 'Assign Classroom':
        return <AssignClassroom />;
      default:
        return (
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            textAlign="center"
            sx={{ mt: 4 }}
          >
            Welcome Principal
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Principal Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          {renderContent()}
        </Container>
      </Box>
      <Toaster />
    </Box>
  );
}

export default PrincipalDashboard;