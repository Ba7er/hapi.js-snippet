'user strict'

const bcrypt = require('bcrypt');
const User = require('../models/Users');
const mongoose = require('mongoose');


exports.plugin = {
    register : (server, options, next) =>{
        server.route({
            method: 'POST',
            path: "/register",
            handler : (req, h) =>{
                const userData = {
                    first_name: req.payload.first_name,
                    last_name: req.payload.last_name,
                    email: req.payload.email,
                    password: req.payload.password, 
                }
                return User.findOne({email: req.payload.email})
                .then((user) =>{
                    if(!user){
                        bcrypt.hash(req.payload.password, 10, (err, hash) =>{
                            userData.password = hash
                            return User.create(userData).then(user =>{
                                return {status: user.email}
                            }).catch(err =>{
                                return 'error' + err
                            })
                        }) 
                        return {status: userData.email}
                    }else {
                        return {error : 'user already exists'}
                    }
                }).catch(err =>{
                    return 'error' + err
                })
            },
            options: {
                auth: false
            }
        })
        server.route({
            method: 'POST',
            path: '/login',
            handler: (req, h) =>{
                return User.findOne({email: req.payload.email}).then(user =>{
                    if(user){
                        if(bcrypt.compareSync(req.payload.password,user.password)){
                            const payload = {
                                id: user.id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                email: user.email
                            }
                            let token = req.server.methods.jwtSign(payload);
                            return token
                            
                        }else{
                            return {error : 'Invalid username or password'}
                        }
                    }else {
                        return {error : 'User cant be found '}
                    }
                }).catch(err =>{
                    return {message: 'there is error with the then on login', error: err}
                })
               
            },
            options: {
                auth: false
            }
        })
        server.route({
            method:'GET',
            path: '/profile',
            handler: (req, h) =>{
                const token = req.headers.authorization;
                const x = req.server.methods.jwtDecode(token);
                return req.server.methods.jwtDecode(token);
            }
        })
        server.route({
            method: 'POST',
            path:'/updateprofile',
            handler: (req, h) => {
                const token = req.headers.authorization;
                const decodedToken = req.server.methods.jwtDecode(token);
                
                return User.findOne({_id: mongoose.Types.ObjectId(decodedToken.id)}).then(user =>{
                    if(user){
                        user.first_name = req.payload.first_name;
                        user.last_name = req.payload.last_name;
                        user.email = req.payload.email;
                        user.save()
                        return {message: 'User udpated successfully'}
                    }else{
                        return {error: 'user does not exists'}
                    }
                }).catch(err =>{
                    return 'error from catch in update profile' + err
                })
                
            }
            
        })
    },
    name:'users'
}