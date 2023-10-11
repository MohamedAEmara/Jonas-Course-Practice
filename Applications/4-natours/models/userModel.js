const mongoose = require('mongoose');
const emailValidator = require('email-validator');

// User has the following attributes:
// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Please enter your name`],
        minlength: [5, `Username can't be less than 5 characters`],
        maxlength: [30, `Username can't be more than 30 characters`]
    },
    email: {
        type: String, 
        validate: [emailValidator.validate, `Please enter a valid mail`],
        required: [true, `Email can't be null`],
        unique: [true, 'This mail is already taken'],
        lowercase: true     // The validator will automatically change the mail to "lowercase"
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [8, 'Password cannot be less than 8 characters']
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(val) {
                return this.password === val;
            },
            message: `PasswordConfirm field is not the same as Password`
        }
    }
})




const User = mongoose.model('User', userSchema);