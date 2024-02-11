import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UploadFolder = () => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const formData = new FormData();
    const folderName = acceptedFiles[0].path.split('/')[1]; // Extract folder name from the first file

    formData.append('folderName', folderName); // Add folder name to FormData
    acceptedFiles.forEach((file,index) => {
      formData.append('files',file); // Append each file to FormData with the key files
    });
    
    try {
        await axios.post('http://localhost:3001/api/upload-folder', formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: progressEvent => {
            console.log(`Uploading Progress ${progressEvent.loaded} / ${progressEvent.total}`);
          }
        })
         .then(()=>{console.log("Successfully uploaded")})
         .catch((err)=>console.error(err));
    } catch (e) {
      console.log("Failed to upload", e);
    }
  }, []);


  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <h2>Upload Folder</h2>
      <div {...getRootProps()}>
        <input {...getInputProps()} directory="" webkitdirectory="" multiple />
        <p>Drag & drop files here, or click to select files</p>
      </div>
    </div>
  );
};

export default UploadFolder;
