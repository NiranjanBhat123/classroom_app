import React, { useState, useEffect } from 'react';
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
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

import AddStudent from './teacherDashboard/AddStudent';
import ClassroomInfo from './teacherDashboard/ClassroomInfo';

const drawerWidth = 240;

function TeacherDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchTeacherEmail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('https://classroom-app-5.onrender.com/api/teacher/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTeacherEmail(response.data.email);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching teacher info:', error);
        toast.error('Failed to load teacher information');
      }
    };

    fetchTeacherEmail();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['My Classroom', 'Add Student'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton 
              onClick={() => setSelectedOption(text)}
              sx={{
                bgcolor: selectedOption === text ? '#eee' : 'transparent',
              }}
            >
              <ListItemIcon>
                {index === 0 ? <ClassIcon /> : <PersonAddIcon />}
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
      case 'My Classroom':
        return <ClassroomInfo />;
      case 'Add Student':
        return <AddStudent />;
      default:
        return (
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            textAlign="center"
            sx={{ mt: 4 }}
          >
            Welcome {teacherEmail}
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
            Teacher Dashboard
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

export default TeacherDashboard;
