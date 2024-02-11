// import multer from "multer";
// import { handleUpload } from "./cloudinaryController";
// import { runMiddleware } from "../middleware/multerMiddleware";

// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const myUploadMiddleware = upload.single("sample_file");

// export const handler = async (req, res) => {
//     try {
//       await runMiddleware(req, res, myUploadMiddleware);
//       const b64 = Buffer.from(req.file.buffer).toString("base64");
//       let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
//       const cldRes = await handleUpload(dataURI);
//       res.json(cldRes);
//     } catch (error) {
//       console.log(error);
//       res.send({
//         message: error.message,
//       });
//     }
//   };

//   export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };
  

//   module.exports = {
//     handler,
//     config
//   }


const uploadOnCloudinary = require("../utils/cloudinaryHelper");

const uploadFolder = async (req, res) => {
  try {
    const { folderName } = req.body;

    if (!folderName) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    for (const file of req.files) {
      const filePath = file.path;
      const publicId = `${folderName}/${file.originalname}`;
      await uploadOnCloudinary(filePath, publicId);
    }

    res.status(200).json({ message: 'Folder uploaded successfully' });
  } catch (error) {
    console.error('Error uploading folder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { uploadFolder };
