const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "YelpCamp",
        allowedFormats: ['jpeg', "png", "jpg"]
    }
    
})

const addFilesToBody = function (propertyName){
    return (req, res, next) => {
        req.body[propertyName] = req.files.map((file) => ({url: file.path, filename: file.filename}))
        next()
    }
}

module.exports = {
    cloudinary,
    storage, 
    addFilesToBody
}