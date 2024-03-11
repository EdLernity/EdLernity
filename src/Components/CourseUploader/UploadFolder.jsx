import React, { useState } from "react";
import axios from "axios";
import InputButton from "../Input/InputButton";
import CourseContentDescription from "./CourseContentDescription";

const UploadFolder = () => {
  let videoNames = [];
  const [questions, setQuestions] = useState([""]);
  const [answers, setAnswers] = useState([""]);
  const [courseContentDescription, setCourseContentDescription] = useState([{ question: "", answer: "" }]);
  const [formsData, setFormsData] = useState({
    courseTitle: "",
    folderName: "",
    courseDesc: "",
    courseOverviewDesc: "",
    selectedFiles: [],
    message: "",
    isPopular: false,
    initialPrice: "",
    offeredPrice: "",
    imagePath: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === "checkbox" ? checked : type === "file" ? files : value;
    setFormsData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormsData((prevData) => ({ ...prevData, selectedFiles: files }));
    console.log(formsData.selectedFiles)
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formsData.folderName || formsData.selectedFiles.length === 0) {
      setFormsData({...formsData, message : "Please enter folder name and select files"});
      return;
    }

    // Sort selected files by name
    const sortedFiles = Array.from(formsData.selectedFiles).sort((a, b) => {
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
    formData.append("folderName", formsData.folderName);

    // const courseFormData = new FormData(data);

    for (const file of sortedFiles) {
      formData.append("files", file);
      videoNames.push(file.name)
      console.log(videoNames)
    }

    const data = {
      courseTitle : formsData.courseTitle,
      initialPrice :  formsData.initialPrice,
      offeredPrice : formsData.offeredPrice ,
      courseDesc : formsData.courseDesc,
      courseOverviewDesc : formsData.courseOverviewDesc,
      folderName : formsData.folderName,
      isPopular : formsData.isPopular ? true : false,
      courseContentDescription : courseContentDescription,
      imagePath  : formsData.imagePath,
      videoNames : videoNames
    }

    console.log(data)

    try {
      setFormsData({...formsData, message : "Uploading Course details...,Please do not refresh the page"});
      const courseResponse = await axios.post(
        "http://3.110.210.79:3001/api/save-course",
        data,
      );

      setFormsData({...formsData, message : courseResponse.data.message});

      if(courseResponse.status === 200){
        setTimeout(()=>{
          setFormsData({...formsData, message : "Uploading videos...,Please do not refresh the page. It may take some time depending on the number of files."});
        },2000);
        const response = await axios.post(
          "http://3.110.210.79:3001/api/upload-folder",
          formData);

        setFormsData({...formsData, message : response.data.message});
      }

    } catch (error) {
      handleError(error)
    }
  };

  const handleError = (error) => {
    console.error("Error uploading folder:", error);
    let errorMessage = "Error uploading course details. Please check your internet connection and retry";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || error.response.data.error || errorMessage;
    }
    setFormsData({ ...formsData, message: errorMessage });
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
              name="courseTitle"
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="text"
              id="initialPrice"
              label="Initial Price"
              fullWidth
              name="initialPrice"
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
          <InputButton
              type="text"
              id="offeredPrice"
              label="Offered Price"
              fullWidth
              name="offeredPrice"
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="text"
              id="courseDesc"
              label="Course Description"
              fullWidth
              name="courseDesc"
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="text"
              id="courseOverviewDesc"
              label="Course Overview Description"
              fullWidth
              name="courseOverviewDesc"
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="text"
              id="folderName"
              label="Folder Name"
              fullWidth
              name="folderName"
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <InputButton
              type="text"
              id="imagePath"
              label="Image Path"
              fullWidth
              name="imagePath"
              onChange={handleChange}
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
              name="isPopular"
              onChange={handleChange}
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
        {formsData.message && <div className="mt-4 text-green-600">{formsData.message}</div>}
      </div>
    </div>
  );
};

export default UploadFolder;
