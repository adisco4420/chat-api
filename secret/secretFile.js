const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    facebook: {
        clientID: process.env.facebookClientId,
        clientSecret: process.env.facebookSecret
    },
    
    google: {
        clientID: process.env.googleClientId,
        clientSecret: process.env.googleSecret
    }
}