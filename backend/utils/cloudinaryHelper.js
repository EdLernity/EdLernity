// const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// export async function handleUpload(file) {
//   const res = await cloudinary.uploader.upload(file, {
//     resource_type: "auto",
//   });
//   return res;
// }


const cloudinary = require("cloudinary").v2;
const { log } = console;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary  = async (path,publicId) => {
  try{
    if(!path)  throw new Error('No file provided');
    const res = await cloudinary.uploader.upload(path,{
      resource_type: 'auto',
      public_id: publicId
    })
    // file uploded sucessfuly
    console.log("Uploded sucessfully");
    log("Logging the uploaded image details...")
    log(`Public ID : ${res.public_id}`);
    log(`URL       : ${res.secure_url}`)
    console.log(res)
    return res;
  }catch(err){
    fs.unlinkSync(path)
    console.error(err);
    log(err);
    return null
  }
};

module.exports = uploadOnCloudinary;