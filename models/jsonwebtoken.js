'use strict';

const Users = require('./Users.js');
const mongoose= require('mongoose');


module.exports = {
    secretOrPrivateKey: 's3cr3t',
    sign: {},
    decode: {},
    verify: {},
    getToken: (request) => {

        return request.headers.authorization;
    },
    validate: (request, payload, h) => {
       return  Users.findOne({_id: mongoose.Types.ObjectId(payload.id)}).then(user =>{
            if(user){
               
                return {
                    isValid: true,
                    credentials: { id: user.id, name: user.first_name }
                };
            }
            return {
              credentials: null, isValid: false 
            }
        })

        
    }
};
