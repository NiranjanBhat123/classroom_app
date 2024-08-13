// components/dashboard/AddTeacher.jsx
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import axios from "axios"

function AddTeacher() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/teacher/add_student',
        {
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success(response.data.message || 'Student added successfully!');
      setEmail('');
      setPassword('');
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || 'Failed to add student');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };
  


  return (
    <Box component="form" onSubmit={handleSubmit} noValidate 
    sx={{ 
      mt: 1, 
      width: '400px', 
      mx: 'auto', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      p: 2, 
      backgroundColor: 'white',
      borderRadius: '8px',
    }}
    >
      <Typography variant="h6" gutterBottom>
        Add a New Student
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
}

export default AddTeacher;

