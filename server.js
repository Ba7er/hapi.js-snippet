'user strict'

const Hapi= require('@hapi/hapi');
const mongoose = require('mongoose');
const HapiJWT = require('hapi-jsonwebtoken');
const HapiJWTConfig = require('./models/jsonwebtoken');

const server = Hapi.server({
    host: "localhost",
    port: "3000",
    routes : {
        cors:true
    }
});

//original mongo connect
server.app.db = mongoose.connect(
    "mongodb://localhost:27017/hapijslogin",
    {useNewUrlParser: true}
);

// Dany was here
const init = async () =>{
    await server.register(HapiJWT.plugin).catch(err =>{console.log('could not register JWT', err)})
    server.auth.strategy('jwt', 'hapi-jsonwebtoken', HapiJWTConfig);
    server.auth.default('jwt');
    
    await server.register({
        plugin: require('./routes/Users'),
        routes : {
            prefix: '/users'
        }
    }).catch(err => {
        console.log('this is an error from Init func at server.js', err)
    })

    await server.start().then(console.log('the server is running at', server.info.uri))
};

init();