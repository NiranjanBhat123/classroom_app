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
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import toast from 'react-hot-toast';

function UserList() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedEmail, setEditedEmail] = useState('');
  const [userType, setUserType] = useState('teacher');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/principal/fetch_users');
        setUsers(response.data);
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditedEmail(user.email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setEditedEmail('');
  };

  const handleSave = async () => {
    if (selectedUser) {
      try {
        const response = await axios.put('http://localhost:5000/api/principal/edit_user', {
          id: selectedUser._id,
          email: editedEmail,
          role: userType
        });

        if (response.status === 200) {
          toast.success(`${userType.charAt(0).toUpperCase() + userType.slice(1)} details updated successfully!`);
          setUsers(users.map(user =>
            user._id === selectedUser._id ? { ...user, email: editedEmail } : user
          ));
          handleClose();
        }
      } catch (error) {
        toast.error(`Failed to update ${userType}`);
        console.error(`Error updating ${userType}:`, error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        const response = await axios.delete('http://localhost:5000/api/principal/delete_user', {
          data: { id: selectedUser._id, role: userType }
        });

        if (response.status === 200) {
          toast.success('User deleted successfully!');
          setUsers(users.filter(u => u._id !== selectedUser._id));
        }
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', error);
      } finally {
        setDeleteConfirmOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setSelectedUser(null);
  };

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
    }
  };

  const filteredUsers = users.filter(user =>
    user.role.toLowerCase() === userType
  );

  return (
    <>
      <Typography variant="h6" gutterBottom>
        User List
      </Typography>
      <ToggleButtonGroup
        color="primary"
        value={userType}
        exclusive
        onChange={handleUserTypeChange}
        aria-label="User Type"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="teacher">Teachers</ToggleButton>
        <ToggleButton value="student">Students</ToggleButton>
      </ToggleButtonGroup>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              {userType === 'teacher' && <TableCell>Classroom Assigned</TableCell>}
              <TableCell style={{ textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                {userType === 'teacher' && (
                  <TableCell>
                    {user.assignedClassroom
                      ? user.assignedClassroom
                      : 'No classroom assigned'}
                  </TableCell>
                )}
                <TableCell>
                  <Button onClick={() => handleEdit(user)}>Edit</Button>
                  <Button onClick={() => handleDeleteClick(user)} color="error">Delete</Button>
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
            Are you sure you want to delete this user? This action cannot be undone.
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
        <DialogTitle>Edit User</DialogTitle>
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

export default UserList;
