

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    first_name :{
        type: String
    },
    last_name :{
        type: String
    },
    email :{
        type: String
    },
    password :{
        type: String
    },
    mobile :{
        type: Number
    },
    address: [String]

})

module.exports = User = mongoose.model('users', UserSchema);