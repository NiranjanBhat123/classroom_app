import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import toast from 'react-hot-toast';
import axios from 'axios';

function CreateClassroom() {
  const defaultTime = '12:30';
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState({
    Monday: { start: defaultTime, end: defaultTime },
    Tuesday: { start: defaultTime, end: defaultTime },
    Wednesday: { start: defaultTime, end: defaultTime },
    Thursday: { start: defaultTime, end: defaultTime },
    Friday: { start: defaultTime, end: defaultTime },
    Saturday: { start: defaultTime, end: defaultTime },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a classroom name');
      return;
    }

    try {
      console.log('Submitting data:', { name, schedule });
      
      const response = await axios.post('https://classroom-app-5.onrender.com/api/principal/create_classroom', {
        name,
        schedule
      });

      if (response.status === 201) {
        toast.success('Classroom created successfully!');
        setName('');
        setSchedule({
          Monday: { start: defaultTime, end: defaultTime },
          Tuesday: { start: defaultTime, end: defaultTime },
          Wednesday: { start: defaultTime, end: defaultTime },
          Thursday: { start: defaultTime, end: defaultTime },
          Friday: { start: defaultTime, end: defaultTime },
          Saturday: { start: defaultTime, end: defaultTime },
        });
      } else {
        toast.error('Failed to create classroom');
      }
    } catch (error) {
      console.error('Error creating classroom:', error);
      toast.error('Failed to create classroom');
    }
  };

  const handleTimeChange = (day, type, value) => {
    setSchedule(prev => {
      const newSchedule = {
        ...prev,
        [day]: { ...prev[day], [type]: value }
      };
      console.log('Updated schedule:', newSchedule);
      return newSchedule;
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Create a New Classroom
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Classroom Name"
        name="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Grid container spacing={2}>
        {Object.entries(schedule).map(([day, times]) => (
          <Grid item xs={12} sm={6} key={day}>
            <Typography variant="subtitle1">{day}</Typography>
            <TextField
              label="Start Time"
              type="time"
              value={times.start}
              onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="End Time"
              type="time"
              value={times.end}
              onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
              fullWidth
              margin="normal"
            />
          </Grid>
        ))}
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Create Classroom
      </Button>
    </Box>
  );
}

export default CreateClassroom;