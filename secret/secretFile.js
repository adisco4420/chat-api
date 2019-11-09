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
    },
    cloudinaryData: {
        name: process.env.cloudinaryName,
        apiKey: process.env.cloudinaryApiKey,
        secretKey: process.env.cloudinarySecretKey
    }
}