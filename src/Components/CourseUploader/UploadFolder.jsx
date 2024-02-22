import React, { useState } from "react";
import axios from "axios";

const UploadFolder = () => {
  const [folderName, setFolderName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderName || selectedFiles.length === 0) {
      setMessage("Please enter folder name and select files");
      return;
    }

    // Sort selected files by name
    const sortedFiles = Array.from(selectedFiles).sort((a, b) => {
      // Extract numeric part of the filename
      const numA = parseInt(a.name.match(/\d+/)[0]);
      const numB = parseInt(b.name.match(/\d+/)[0]);

      // Compare numeric parts
      if (numA !== numB) {
        return numA - numB;
      }

      // If numeric parts are equal, compare lexicographically
      return a.name.localeCompare(b.name);
    });

    const formData = new FormData();
    formData.append("folderName", folderName);

    for (const file of sortedFiles) {
      formData.append("files", file);
    }

    try {
      setMessage("Uploading...,Please do not refresh the page. It may take some time depending on the number of files.");
      const response = await axios.post(
        "http://localhost:3001/api/upload-folder",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error uploading folder. Please try again.");
      console.error("Error uploading folder:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Upload Folder to Google Cloud Storage
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="folderName"
              className="block text-sm font-medium text-gray-700"
            >
              Folder Name:
            </label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={handleFolderNameChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="files"
              className="block text-sm font-medium text-gray-700"
            >
              Select Files:
            </label>
            <input
              type="file"
              id="files"
              multiple
              onChange={handleFileChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Upload
          </button>
        </form>
        {message && <div className="mt-4 text-green-600">{message}</div>}
      </div>
    </div>
  );
};

export default UploadFolder;
