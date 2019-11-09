const multer = require('multer');
const { cloudinaryData } = require('../secret/secretFile')
const path = require('path');
var fs = require('fs')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: cloudinaryData.name,
    api_key: cloudinaryData.apiKey,
    api_secret: cloudinaryData.secretKey
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads'))
    },
    filename: function(req, file, cb) {
      console.log(file)
      cb(null, file.originalname)
    }
  })

const uploader = function(req, res, next) {
  const path = req.filePath;
  const fileName = new Date().toISOString();
  uploadFile(req, res , next,  path, fileName)
  

  return;
    const upload = multer({ storage }).single('upload')
    upload(req, res, function(err) {
      if (err) {
        return res.send(err)
      }
  
      console.log('file uploaded to server')
    const path = req.file.path
    // const uniqueFilename = new Date().toISOString()
    const fileName = 'james@mail.com';
    cloudinary.uploader.upload(
        path,
        { 
            public_id: `blog/${fileName}`,
            overwrite: true
        }, // directory and tags are optional
        function(err, image) {
          if (err) return res.status(500).send(err)
          console.log('file uploaded to Cloudinary', image)
          fs.unlinkSync(path)
          res.json(image)
        }
      )
    
    })
}
const uploadFile = (req, res,  next, path, fileName) => {
  cloudinary.uploader.upload(
    path,
    { 
        public_id: `blog/${fileName}`,
        overwrite: true
    }, // directory and tags are optional
    function(err, image) {
      if (err) return res.status(500).send(err)
      fs.unlinkSync(path)
      req.body.upload = image.url;
      next()
    }
  )
}
const deleteFile = function(req, res) {
  const url = 'http://res.cloudinary.com/dx5bcp5ps/image/upload/v1573136462/blog/2019-11-07T14:20:59.272Z.svg'
  const {name} = path.parse(url)
  const publicId = `blog/${name}`;
  cloudinary.api.delete_resources([ publicId ],
    function(error, result) {
      if(error) {
        res.status(500).json(error)
      } else {
        res.status(200).send(result);
      }
      console.log(result, error); 
    });
  
    
}


// cloudinary.v2.uploader.upload("dog.mp4", 
//   {resource_type: "video", public_id: "my_folder/my_sub_folder/my_dog",
//   overwrite: true, notification_url: "https://mysite.example.com/notify_endpoint"},
//   function(error, result) {console.log(result, error)});

module.exports = {
  uploader,
  deleteFile
};