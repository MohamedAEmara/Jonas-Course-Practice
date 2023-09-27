const express = require('express');
const fs = require('fs');
const router = express.Router();


// Another way to import modules from Controllers modules is to name all functions to include..
const {getAllUsers, getUser, createUser, deleteUser, updateUser} = require('./../controllers/userController');


router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;