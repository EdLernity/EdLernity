import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { apiInstancePrivate } from "../../Utils/AxiosInstance";
import Loader from "../Utils/Spinner";
import { showSnackbar } from "../Utils/enQueSnackBar";
const UploadFolder = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseOverviewDesc, setCourseOverviewDesc] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [folderName, setFolderName] = useState("");
  const [contentList, setContentList] = useState("");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState("")
  const [initialPrice, setInitialPrice] = useState(0);
  const [offeredPrice, setOfferedPrice] = useState(0);
  const [loading, setLoading] = useState(false)
let navigate=useNavigate()
  const [courseContent, setCourseContent] = useState([
    { title: "", description: "" },
  ]);
  const [isPopular, setIsPopular] = useState(false);
  const [bannerFiles, setBannerFiles] = useState();
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoTitles, setVideoTitles] = useState(Array.from({ length: videoFiles.length }, (_, index) => ({ index, title: "" })));
  useEffect(() => {
    const token = localStorage.getItem("_userAuth");
    if (!token) {
      navigate('/auth/login',{replace:true});
    }
  }, []);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Validation checks
    if (
      !courseTitle.trim() ||
      !tags.trim() ||
  !courseOverviewDesc.trim() ||
  !courseDesc.trim() ||
  !folderName.trim() ||
  !duration.trim()||
  !initialPrice.trim() ||
  !offeredPrice.trim()||
      !contentList ||
      !bannerFiles ||
      bannerFiles.length === 0 ||
      !videoFiles ||
      videoFiles.length === 0 ||
      courseContent.every(entry => !entry.title.trim() && !entry.description.trim())
    ) {
      // If any required field is empty or any video file doesn't have a title
      // Show error message or handle validation logic accordingly
      showSnackbar("All fields are required", "error", "top");
      return;
    }
  
    
    setLoading(true);
    // Create FormData object
    const formData = new FormData();
  
    // Append form data to FormData object
    formData.append("courseTitle", courseTitle);
    formData.append("courseOverviewDesc", courseOverviewDesc);
    formData.append("courseDesc", courseDesc);
    formData.append("folderName", folderName);
    formData.append("contentList", contentList);
    formData.append("isPopular", isPopular);
    formData.append("initialPrice", initialPrice);
    formData.append("offeredPrice", offeredPrice);
    formData.append("tags", tags);
    videoTitles.forEach(titleObj => {
      formData.append(`videoTitle[${titleObj?.index}]`, titleObj?.title);
    });
     // Append course content
     courseContent.forEach((entry, index) => {
      formData.append(`courseContent[${index}][title]`, entry.title);
      formData.append(`courseContent[${index}][description]`, entry.description);
    });
    formData.append("duration", duration);
   
      // Append banner file
if (bannerFiles.length > 0) {
  const bannerFileName = `${folderName}_thumbnail.${bannerFiles[0].name.split('.').pop()}`;
  formData.append("bannerFiles", new File([bannerFiles[0]], bannerFileName, { type: bannerFiles[0].type }));
}

// Append video files
videoFiles.forEach((file, index) => {
  const videoFileName = `${folderName}_video_${index}.${file.name.split('.').pop()}`;
  formData.append("videoFiles", new File([file], videoFileName, { type: file.type }));
});
;
  
   
  
    // Make API call using formData
    apiInstancePrivate.post("/api/v1/course/save-course",formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      showSnackbar(response.data.message,"success","top");
      window.location.reload();
    }).catch((error) => {
      // Handle error
      console.error("Error:");
    }).finally((response) => {
      setLoading(false);

    });
  };
  
  const handleVideoTitleChange = (e, index) => {
    const updatedVideoTitles = [...videoTitles];
    updatedVideoTitles[index] = { index, title: e.target.value };
    setVideoTitles(updatedVideoTitles);
  };
  
  const titleForIndex = (index) => {
    const titleObject = videoTitles.find((titleObj) => titleObj.index === index);
    return titleObject ? titleObject.title : "";
  };
  const addCourseContent = () => {
    setCourseContent([...courseContent, { title: "", description: "" }]);
  };
  const handleContentTitleChange = (index, value) => {
    const updatedCourseContent = [...courseContent];
    updatedCourseContent[index].title = value;
    setCourseContent(updatedCourseContent);
  };

  const handleContentDescriptionChange = (index, value) => {
    const updatedCourseContent = [...courseContent];
    updatedCourseContent[index].description = value;
    setCourseContent(updatedCourseContent);
  };

  const removeCourseContent = (index) => {
    const updatedCourseContent = [...courseContent];
    updatedCourseContent.splice(index, 1);
    setCourseContent(updatedCourseContent);
  };
  // Function to upload course banner
  const handleBannerUpload = (files) => {
    //console.log(files);
    // Check if file type is image
    if (files[0].type.startsWith("image")) {
      // Add uploaded banner files to state
      setBannerFiles(files);
    } else {
      showSnackbar(
        "Please upload an image file for the banner.",
        "error",
        "top"
      );
    }
  };

  // Function to upload course videos
  const handleVideoUpload = (files) => {
    // Check if file type is video
    if (files.every((file) => file.type.startsWith("video"))) {
      // Add uploaded video files to state
      setVideoFiles([...videoFiles, ...files]);
    } else {
      showSnackbar(
        "Please upload video files for the course videos.",
        "error",
        "top"
      );
    }
  };

  // Function to handle file drop for banner
  const handleBannerDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.file;
    handleBannerUpload(files);
  };

  // Function to handle file drop for videos
  const handleVideoDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleVideoUpload(files);
  };

  // Function to prevent default behavior for file drop
  const preventDefaultBehavior = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleBannerSelect = (e) => {
    const files = e.target.files;
    handleBannerUpload(files);
  };

  // Function to handle file selection for videos
  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    handleVideoUpload(files);
  };

  // Function to remove video file
  const removeVideo = (index) => {
    const newVideoFiles = [...videoFiles];
    newVideoFiles.splice(index, 1);
    setVideoFiles(newVideoFiles);
    // Remove the corresponding title
  const newVideoTitles = videoTitles.filter((titleObj) => titleObj.index !== index);
  setVideoTitles(newVideoTitles);
  };
  // Function to remove banner file
  const removeBanner = () => {
    setBannerFiles(null);
  };

  // Function to handle drag and drop reordering of videos
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    const items = [...videoFiles];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setVideoFiles(items);

    // Reorder corresponding titles
  const newVideoTitles = [...videoTitles];
  const draggedTitle = newVideoTitles[startIndex];
  newVideoTitles.splice(startIndex, 1);
  newVideoTitles.splice(endIndex, 0, draggedTitle);

  // Update index values of titles
  newVideoTitles.forEach((titleObj, index) => {
    if(titleObj)
    {

      titleObj.index = index;
    }
  });

  setVideoTitles(newVideoTitles);
  };
  return (
   <>
   {loading?<Loader/>: <div className="flex items-center justify-center p-12">
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Upload Course</h2>
        <div class="mx-auto w-full  bg-white">
          <form onSubmit={handleFormSubmit}>
            <div class="mb-5">
              <label
                for="name"
                class="mb-3 block text-base font-medium text-[#07074D]"
              >
                Course Title
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter course title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="courseOverviewDesc"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Course Overview Desc
              </label>
              <textarea
                type="text"
                id="courseOverviewDesc"
                name="courseOverviewDesc"
                placeholder="Course Overview Desc"
                value={courseOverviewDesc}
                onChange={(e) => setCourseOverviewDesc(e.target.value)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="courseDesc"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Course Desc
              </label>
              <textarea
                type="text"
                id="courseDesc"
                name="courseDesc"
                placeholder="Course Desc"
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
            <div className="mb-5">
              <label
                htmlFor="folderName"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                FolderName
              </label>
              <input
                type="text"
                id="folderName"
                name="folderName"
                placeholder="FolderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="courseDuration"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                CourseDuration
              </label>
              <input
                type="text"
                id="courseDuration"
                name="courseDuration"
                placeholder="Course Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
            <div className="mb-5">
        <label htmlFor="initialPrice" className="mb-3 block text-base font-medium text-[#07074D]">
          Initial Price
        </label>
        <input
          type="text"
          id="initialPrice"
          name="initialPrice"
          placeholder="Initial Price"
          value={initialPrice}
         
          onChange={(e) => {
            const input = e.target.value;
            // Allow only numeric input
            if (/^\d*\.?\d*$/.test(input)) {
              setInitialPrice(input);
            }
          }}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        />
      </div>
      
      <div className="mb-5">
        <label htmlFor="offeredPrice" className="mb-3 block text-base font-medium text-[#07074D]">
          Offered Price
        </label>
        <input
          type="text"
          id="offeredPrice"
          name="offeredPrice"
          placeholder="Offered Price"
          value={offeredPrice}
          onChange={(e) => {
            const input = e.target.value;
            // Allow only numeric input
            if (/^\d*\.?\d*$/.test(input)) {
              setOfferedPrice(input);
            }
          }}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        />
      </div>
      </div>
            <div className="mb-5">
              <label
                htmlFor="text"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Course Tag
              </label>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="Enter tag for course"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="text"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                ContentList
              </label>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="Enter course contet list"
                value={contentList}
                onChange={(e) => setContentList(e.target.value)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="col-span-full">
              <label
                htmlFor="product-details"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Course Content Description
              </label>

              {courseContent.map((content, index) => (
                <div key={index} className="flex items-center mb-4">
                  <div className="w-1/3 pr-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={content.title}
                      onChange={(e) => handleContentTitleChange(index, e.target.value)}
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                  <div className="w-2/3 pr-3">
                    <textarea
                      placeholder="Description"
                      value={content.description}
                      onChange={(e) => handleContentDescriptionChange(index, e.target.value)}
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeCourseContent(index)}
                      className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
             <button
                  type="button"
                  onClick={addCourseContent}
                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md"
                >
                  +
                </button>
              
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">
                Is this Course Popular
              </label>
              <div class="flex flex-wrap -mx-2">
                <div class="px-2 w-1/3">
                  <label
                    for="color-yes"
                    class="block text-gray-700 font-medium mb-2"
                  >
                    <input
                      type="radio"
                      id="yes"
                      name="popluar"
                      value="yes"
                      checked={isPopular}
                      onChange={() => setIsPopular(true)}
                      class="mr-2"
                    />
                    Yes
                  </label>
                </div>
              </div>
            </div>
            {/* Banner upload section */}
            <div
              className="mb-6 pt-4"
              // onDrop={handleBannerDrop}
              // onDragOver={preventDefaultBehavior}
            >
              <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                Upload Course Banner
              </label>
              {/* Drag and drop area for banner */}
              <div className="mb-8">
                <input
                  type="file"
                  name="banner"
                  id="banner"
                  onChange={handleBannerSelect}
                  multiple
                  className="sr-only"
                />
                <label
                  htmlFor="banner"
                  className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                >
                  <div>
                    {/* <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                      Drop files here
                    </span>
                    <span className="mb-2 block text-base font-medium text-[#6B7280]">
                      Or
                    </span> */}
                    <span className="inline-flex cursor-pointer rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                      Browse
                    </span>
                  </div>
                </label>
              </div>
              {bannerFiles && (
                <div class="rounded-md bg-[#F5F7FB] py-4 px-8">
                  <div class="flex items-center justify-between">
                    <span class="truncate pr-3 text-base font-medium text-[#07074D]">
                      {bannerFiles[0].name}
                    </span>
                    <button
                      class="text-[#07074D]"
                      onClick={() => removeBanner()}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                          fill="currentColor"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Video upload section */}
            <div
              className="mb-6 pt-4"
              // onDrop={handleVideoDrop}
              // onDragOver={preventDefaultBehavior}
            >
              <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                Upload Course Video
              </label>
              {/* Drag and drop area for videos */}
              <div className="mb-8">
                <input
                  type="file"
                  name="videos"
                  id="videos"
                  className="sr-only"
                  onChange={handleVideoSelect}
                  multiple
                />
                <label
                  htmlFor="videos"
                  className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                >
                  <div>
                    {/* <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                      Drop files here
                    </span>
                    <span className="mb-2 block text-base font-medium text-[#6B7280]">
                      Or
                    </span> */}
                    <span className="inline-flex cursor-pointer rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                      Browse
                    </span>
                  </div>
                </label>
              </div>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="videos">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {videoFiles.map((fileWithTitle, index) => (
                        <Draggable
                          key={index}
                          draggableId={index.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="mb-4">
                                <div className="rounded-md bg-[#F5F7FB] py-4 px-8">
                                  <div className="flex items-center justify-between">
                                    <span className="truncate pr-3 text-base font-medium text-[#07074D]">
                                      {fileWithTitle.name}
                                    </span>
                                    <input
                                      type="text"
                                      placeholder="Enter video title"
                                      name={`title[${index}]`}
  value={titleForIndex(index)}
  onChange={(e) => handleVideoTitleChange(e, index)}
                                      className="w-[35rem] rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />{" "}
                                    <button
                                      className="text-[#07074D]"
                                      onClick={() => removeVideo(index)}
                                    >
                                      <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                                          fill="currentColor"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.27933565 9.72066L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                                          fill="currentColor"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            <div>
              <button
                type="submit"
                class="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              >
                Upload Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>}
   </>
  );
};

export default UploadFolder;
