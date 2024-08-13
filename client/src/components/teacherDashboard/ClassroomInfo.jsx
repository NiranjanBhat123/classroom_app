import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import toast from 'react-hot-toast';

function ClassroomInfo() {
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editedEmail, setEditedEmail] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const fetchClassroomInfo = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/teacher/classroom_info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClassroom(response.data.classroom);
      setStudents(response.data.students);
    } catch (error) {
      toast.error('Failed to fetch classroom info');
    }
  };

  useEffect(() => {
    fetchClassroomInfo();
  }, []);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditedEmail(student.email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
    setEditedEmail('');
  };

  const handleSave = async () => {
    if (selectedStudent) {
      
      try {
        const response = await axios.put('http://localhost:5000/api/principal/edit_user', {
          id: selectedStudent._id,
          email: editedEmail,
          role:"student"
        });

        if (response.status === 200) {
          toast.success('Student details updated successfully!');
          setStudents(students.map(student =>
            student._id === selectedStudent._id ? { ...student, email: editedEmail } : student
          ));
          handleClose();
        }
      } catch (error) {
        toast.error('Failed to update student');
      }
    }
  };

  const handleDelete = async () => {
    if (selectedStudent) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.delete('http://localhost:5000/api/principal/delete_user', {
          data: { id: selectedStudent._id ,
            role:"student"
          },
        });

        if (response.status === 200) {
          toast.success('Student deleted successfully!');
          setStudents(students.filter(s => s._id !== selectedStudent._id));
        }
      } catch (error) {
        toast.error('Failed to delete student');
      } finally {
        setDeleteConfirmOpen(false);
        setSelectedStudent(null);
      }
    }
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setSelectedStudent(null);
  };

  return (
    <>
    <Typography variant="h6" gutterBottom>
       
      </Typography>
      {classroom && (
        <>
          <Typography variant="body1" style={{fontWeight:"bold"}}>
            Classroom: {classroom.name}
          </Typography>
          <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
            Class Schedule
          </Typography>
          <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
            <Table sx={{ minWidth: 650 }} aria-label="schedule table">
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(classroom.schedule).map(([day, times]) => (
                  <TableRow key={day}>
                    <TableCell>{day}</TableCell>
                    <TableCell>{times.start || 'N/A'}</TableCell>
                    <TableCell>{times.end || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Typography variant="h6" gutterBottom>
        Students
      </Typography>
      {classroom && (
        <Typography variant="body1">
          strength: {students.length}
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="classroom table">
          <TableHead>
            <TableRow>
              <TableCell>Student Email</TableCell>
              <TableCell style={{ textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(student)}>Edit</Button>
                  <Button onClick={() => handleDeleteClick(student)} color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this student? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent sx={{ padding: '20px', width: '500px', maxWidth: '100%' }}>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ClassroomInfo;
