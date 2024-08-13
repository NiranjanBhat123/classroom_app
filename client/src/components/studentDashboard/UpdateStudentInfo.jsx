import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

function UpdateStudentInfo() {
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/student/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setEmail(response.data.email);
          setStudentId(response.data.id);
        }
      } catch (error) {
        console.error('Error fetching student info:', error);
        toast.error('Failed to load student information');
      }
    };
    fetchStudentInfo();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        id: studentId,
        email: email,
        role: 'student'
      };

      const response = await axios.put('http://localhost:5000/api/principal/edit_user', requestData);

      if (response.status === 200) {
        toast.success('Student details updated successfully!');
      }
    } catch (error) {
      console.error('Error updating student info:', error);
      toast.error('Failed to update student information');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Update Your Information
      </Typography>
      <Box component="form" onSubmit={handleSave} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Update Information
        </Button>
      </Box>
    </Paper>
  );
}

export default UpdateStudentInfo;