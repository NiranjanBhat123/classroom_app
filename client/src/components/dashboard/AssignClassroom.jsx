import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography
} from '@mui/material';
import toast from 'react-hot-toast';
import axios from 'axios';

function AssignClassroom() {
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersResponse, classroomsResponse] = await Promise.all([
          axios.get('https://classroom-app-5.onrender.com/api/principal/fetch_teachers'),
          axios.get('https://classroom-app-5.onrender.com/api/principal/fetch_classrooms')
        ]);
        console.log(teachersResponse.data);
        setTeachers(teachersResponse.data);
        setClassrooms(classroomsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch teachers and classrooms');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedClassroom) {
      toast.error('Please select both a teacher and a classroom');
      return;
    }

    try {
      const response = await axios.post('https://classroom-app-5.onrender.com/api/principal/assign_classroom', {
        teacherId: selectedTeacher,
        classroomId: selectedClassroom
      });

      if (response.status === 200) {
        toast.success('Classroom assigned successfully!');
        setSelectedTeacher('');
        setSelectedClassroom('');
      }
    } catch (error) {
      console.error('Error assigning classroom:', error);
      toast.error('Failed to assign classroom');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Assign Classroom to Teacher
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="teacher-select-label">Teacher</InputLabel>
        {teachers.length === 0 ? (
          <Typography variant="body1" style={{marginTop:"3rem" , textAlign:"center"}} color="error">
            No teachers available.
          </Typography>
        ) : (
          <Select
            labelId="teacher-select-label"
            id="teacher-select"
            value={selectedTeacher}
            label="Teacher"
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher._id} value={teacher._id}>{teacher.email}</MenuItem>
            ))}
          </Select>
        )}

      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="classroom-select-label">Classroom</InputLabel>
        <Select
          labelId="classroom-select-label"
          id="classroom-select"
          value={selectedClassroom}
          label="Classroom"
          onChange={(e) => setSelectedClassroom(e.target.value)}
        >
          {classrooms.map((classroom) => (
            <MenuItem key={classroom._id} value={classroom._id}>{classroom.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Assign Classroom
      </Button>
    </Box>
  );
}

export default AssignClassroom;