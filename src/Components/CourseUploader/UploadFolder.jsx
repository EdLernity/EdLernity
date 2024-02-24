import React, { useState } from "react";
import axios from "axios";
import InputButton from "../Input/InputButton";
import CourseContentDescription from "./CourseContentDescription";

const UploadFolder = () => {
  const [courseTitle, setCourseName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseOverviewDesc, setCourseOverviewDesc] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [answers, setAnswers] = useState([""]);
  const [courseContentDescription, setCourseContentDescription] = useState([{ question: "", answer: "" }]);
  const [isPopular, setIsPopular] = useState(false);
  const [initialPrice, setInitialPrice] = useState("");
  const [offeredPrice, setOfferedPrice] = useState("");

  const data = {
    courseTitle : courseTitle,
    initialPrice :  initialPrice,
    offeredPrice : offeredPrice ,
    courseDesc : courseDesc,
    courseOverviewDesc : courseOverviewDesc,
    folderName : folderName,
    isPopular : isPopular,
    courseContentDescription : courseContentDescription
  }

  console.log(data)

  const addQuestion = () => {
    setQuestions([...questions, ""]);
    setAnswers([...answers, ""]);
    setCourseContentDescription([...courseContentDescription, { question: "", answer: "" }]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);

    const updatedAnswers = [...answers];
    updatedAnswers.splice(index, 1);
    setAnswers(updatedAnswers);

    const updatedCourseContentDescription = [...courseContentDescription];
    updatedCourseContentDescription.splice(index, 1);
    setCourseContentDescription(updatedCourseContentDescription);
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleCourseName = (e) => {
    setCourseName(e.target.value);
  };

  const handleCourseDesc = (e) => {
    setCourseDesc(e.target.value);
  };

  const handlePopularCourseChange = (e) => {
    setIsPopular(e.target.checked);
  };

  const handleInitialPriceChange = (e) => {
    setInitialPrice(e.target.value);
  };

  const handleOfferedPriceChange = (e) => {
    setOfferedPrice(e.target.value);
  };

  const handleCourseOverviewDesc = (e) => {
    setCourseOverviewDesc(e.target.value);
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

    // const courseFormData = new FormData(data);

    for (const file of sortedFiles) {
      formData.append("files", file);
    }

    try {
      setMessage(
        "Uploading Course details...,Please do not refresh the page"
      );
      const courseResponse = await axios.post(
        "http://localhost:3001/api/save-course",
        data,
      );
      
      console.log(courseResponse);

      setMessage(courseResponse.data.message);

      if(courseResponse.status === 200){
        setTimeout(()=>{
          setMessage(
            "Uploading videos...,Please do not refresh the page. It may take some time depending on the number of files."
          );
        },2000);
        const response = await axios.post(
          "http://localhost:3001/api/upload-folder",
          formData);
  
        setMessage(response.data.message);
      }

    } catch (error) {
      setMessage(error.response.data.message);
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
            <InputButton
              type="text"
              id="courseTitle"
              label="Course Name"
              fullWidth
              value={courseTitle}
              onChange={handleCourseName}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="text"
              id="initialPrice"
              label="Initial Price"
              fullWidth
              value={initialPrice}
              onChange={handleInitialPriceChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
          <InputButton
              type="text"
              id="offeredPrice"
              label="Offered Price"
              fullWidth
              value={offeredPrice}
              onChange={handleOfferedPriceChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="text"
              id="courseDesc"
              label="Course Description"
              fullWidth
              value={courseDesc}
              onChange={handleCourseDesc}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="text"
              id="courseOverviewDesc"
              label="Course Overview Description"
              fullWidth
              value={courseOverviewDesc}
              onChange={handleCourseOverviewDesc}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="text"
              id="folderName"
              label="folder Name"
              fullWidth
              value={folderName}
              onChange={handleFolderNameChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="border-2 border-solid rounded border-[#1539cf] p-2 mb-4">
            <div className="mb-4">Course Content :</div>
            <CourseContentDescription
              questions={questions}
              setQuestions={setQuestions}
              answers={answers}
              setAnswers={setAnswers}
              addQuestion={addQuestion}
              removeQuestion={removeQuestion}
              courseContentDescription={courseContentDescription}
              setCourseContentDescription={setCourseContentDescription}
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="checkbox"
              label="Popular"
              id="popular"
              value={isPopular}
              onChange={handlePopularCourseChange}
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="file"
              id="files"
              label="Select Files:"
              fullWidth
              multiple
              onChange={handleFileChange}
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
