const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const PORT = process.env.PORT || 3000
const container = require('./container');
const socketIo = require('socket.io')
const { Users } = require('./helpers/UserClass');
const { Global } = require('./helpers/Global')


container.resolve(function(user, _, admin, home, group, result, privatechat) {
    const app = setExpress()
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/footballkik', {useNewUrlParser: true});

    function setExpress(){
        const app = express()
        const server = http.createServer(app)
        const io = socketIo(server);
        server.listen(PORT, () => {
            console.log(`App listening on port ${PORT}!`);
        });
        ConfigureExpress(app)
        //Socket Connection
        require('./socket/groupchat')(io, Users);
        require('./socket/sendrequest')(io);
        require('./socket/globalroom')(io, Global);
        require('./socket/privatechat')(io)



        // Setup Routing
        const router = require('express-promise-router')();
        user.SetRouting(router);        
        admin.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        result.SetRouting(router);
        privatechat.SetRouting(router);
        app.use(router);
    }

   function ConfigureExpress(app) {

        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.use(validator());
        app.set('view engine', 'ejs');
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());

       
        app.use(session({
            secret: 'jdjdjdj',
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
        
        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ = _;
    }
})


