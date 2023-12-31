const crypto = require('crypto');           // Built-in Node Module..
const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const bcrypt = require('bcryptjs');

// User has the following attributes:
// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Please enter your name`],
        minlength: [3, `Username can't be less than 3 characters`],
        maxlength: [30, `Username can't be more than 30 characters`]
    },
    email: {
        type: String, 
        validate: [emailValidator.validate, `Please enter a valid mail`],
        required: [true, `Email can't be null`],
        unique: [true, 'This mail is already taken'],
        lowercase: true     // The validator will automatically change the mail to "lowercase"
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [8, 'Password cannot be less than 8 characters'],
        select: false       // password won't be showing up in any output..
    },
    confirmPassword: {
        type: String,   
        required: true,
        validate: {
            // This only works on "CREATE" & "SAVE"...
            validator: function(val) {
                return this.password === val;
            },
            message: `PasswordConfirm field is not the same as Password`
        }
    },
    passwordChangedAt: {
        type: Date
    },         // if the user doesn't have this property, the password didn't change.
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})



// Now, we'll encrypt the password. As it's not acceptable to store passwords as plain text in DB
// For security issues...

// SO, we'll apply a "pre" hock on "save" to encrypt the password before storing them in DB.
userSchema.pre('save', async function(next) {
    // We want to encrypt the password if we are updating password or SignUp ..
    // But if we update for example the name, we will not apply this hook
    
    // There is a built-in mongoose function that checks whether some field changed or not.
    if(!this.isModified('password')) return;    // if it's not modified, exit this function and 
                                                // go to the next middleware.
    
    // otherwise, We'll encrypt the password
    // We'll use "bcryptjs" npm module
    // NOTE: hash() is async function
    console.log('❤️❤️❤️');
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;       // to hide it from the database..
    // if we didn't do that, any attacker can see passwords from "confirmPassword" field..
    // The use for this filed is just to ensure the equality of the two fields..

    next();
})


// this is an "instance method", it's available for all users..
userSchema.methods.isCorrectPassword =  function(candidatePassword, userPassword) {
    // We passed userPassword as well.
    // Because we set select to in password field
    // So, this.password won't actually work.
    // let encrypted = await bcrypt.hash(candidatePassword, 10);
    // let tmp = await bcrypt.hash(candidatePassword, 10);
    // console.log(encrypted);
    // console.log(tmp);
    // console.log(userPassword);
    // return encrypted === userPassword;

    return bcrypt.compareSync(candidatePassword, userPassword);
        
    
    // We cannot compare them manually as "candidatePassword" is not hashed...
    // But the "userPassword" is hashed..
}



userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log('======================');
        console.log(changedTimestamp, JWTTimestamp);

        // if the time that token issued is before the last time password changed..
        // The user has to login again..
        return changedTimestamp > JWTTimestamp;
    } 
    // False ==> not changed 
    return false;
}



userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');  
    // We specified the length of the strnig to be 32 and convert it to string..
    
    // After that we have to hide it, we cannot store it directly to the DB
    // So, we'll encrypt it.

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');    // so it's encrypted as a hex format.
    // To store it into DB, we'll change the DB schema to include "passwordResetToken" and "passwordResetExpires"
    // as this token has an expiry date.


    this.passwordResetExpires = Date.now() + 600000;            // stands for 10 mins in milliseconds.

    console.log(resetToken);
    console.log('****************');
    console.log(this.passwordResetToken);

    return resetToken;
}


userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();     // We didn't change the password

    // Password changed now
    this.passwordChangedAt = Date.now() - 1000;         // To guarantee that the password changed before the token created 
    next();                                             // So, the user can login with this token.
})




// We'll implement a query middleware to prevent "Deleted" users from accessing or logging in.

userSchema.pre(/^find/, function(next) {    // Any query starting with "find" will apply this middleware on first. 
    // this points to current query..
    this.find({active: {$ne: false}});      // filter only active documents...
    // NOTE: active documents are document that don't have the property {active: false}
    // Because some documents are added before we set this default value {active: true} 
    next();
});







const User = mongoose.model('User', userSchema);
  

 



module.exports = User;