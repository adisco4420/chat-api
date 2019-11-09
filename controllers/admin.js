const path = require('path');
const fs = require('fs');
const { uploader, deleteFile} = require('../helpers/Cloudinary')
module.exports = function(Club, formidable){
    return {
        SetRouting: function(router){
            router.get('/dashboard', this.adminPage);
            router.delete('/deleteFile/:url', deleteFile)
            
            router.post('/uploadFile', this.uploadFile, uploader, this.adminPostPage);
            router.post('/dashboard', this.adminPostPage);
        },
        
        adminPage: function(req, res){
           return res.render('admin/dashboard');
        },
        
        adminPostPage: function(req, res){
            const newClub = new Club();
            newClub.name = req.body.club;
            newClub.country = req.body.country;
            newClub.image = req.body.upload;
            newClub.save((err) => {
                res.render('admin/dashboard');
            })
        },
        
        uploadFile: function(req, res, next) {
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, '../public/uploads');
            let filePath = 'no fie path'
            form.on('file', (field, file) => {
                fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
                    if(err) throw err;
                })
                filePath = form.uploadDir + '\\' +file.name;
            });
            form.on('field', (name, value) => {
                req.body[name] = value;
            })
            
            form.on('error', (err) => {
                res.send('error')
                
            });
            
            form.on('end', () => {
                req.filePath = filePath;
                next();        
            });
            
            form.parse(req);

            
        }
    }
}