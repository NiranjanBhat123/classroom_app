const express = require("express");
const router = express.Router();
const addTeacher = require('../controllers/addTeacher');
const fetchUsers = require("../controllers/fetchUsers");
const editUser = require("../controllers/editUser");
const deleteUser = require("../controllers/deleteUser");
const createClassroom = require("../controllers/addClassroom");
const fetchTeachers = require("../controllers/fetchTeachers");
const fetchClassrooms = require("../controllers/fetchClassrooms");
const assignClassroom = require("../controllers/assignClassroom");


router.post('/add_teacher',addTeacher);
router.get('/fetch_users',fetchUsers);
router.put('/edit_user',editUser);
router.delete('/delete_user',deleteUser);
router.post('/create_classroom',createClassroom);
router.get('/fetch_teachers',fetchTeachers);
router.get('/fetch_classrooms',fetchClassrooms);
router.post('/assign_classroom',assignClassroom);
module.exports = router;