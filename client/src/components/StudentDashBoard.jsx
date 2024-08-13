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
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  ExitToApp as LogoutIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import UpdateStudentInfo from './studentDashboard/UpdateStudentInfo';

const drawerWidth = 240;

function StudentDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('https://classroom-app-5.onrender.com/api/student/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setStudentEmail(response.data.email);
          setStudentId(response.data.id);
          fetchClassrooms(token, response.data.id);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching student info:', error);
        toast.error('Failed to load student information');
      }
    };

    fetchStudentInfo();
  }, [navigate]);

  const fetchClassrooms = async (token, studentId) => {
    try {
      const response = await axios.get(`https://classroom-app-5.onrender.com/api/student/${studentId}`);
      setClassrooms(response.data.classrooms);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      toast.error('Failed to load classrooms');
    } finally {
      setLoading(false);
    }
  };

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
        {['Update Info', 'My Classrooms'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => setSelectedOption(text)}
              sx={{
                bgcolor: selectedOption === text ? '#eee' : 'transparent',
              }}
            >
              <ListItemIcon>
                {index === 0 ? <PersonIcon /> : <ClassIcon />}
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
    if (loading) {
      return <Typography>Loading...</Typography>;
    }

    switch (selectedOption) {
      case 'Update Info':
        return <UpdateStudentInfo />;
      case 'My Classrooms':
        return (
          <div>
            <Typography variant="h6" gutterBottom>My Classrooms</Typography>
            {classrooms.map((classroom) => (
              <Accordion key={classroom._id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{classroom.name} - Students: {classroom.students.length}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle1">Students:</Typography>
                  <List>
                    {classroom.students.map((student) => (
                      <ListItem key={student._id}>
                        <ListItemText primary={student.email} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        );
      default:
        return (
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            textAlign="center"
            sx={{ mt: 4 }}
          >
            Welcome {studentEmail}
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
            Student Dashboard
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

export default StudentDashboard;
