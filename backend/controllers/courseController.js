const { default: mongoose } = require("mongoose");
const courseModel = require("../models/courseModel");
const userCourseSchema = require("../models/userCourseSchema");
const modelPlayer = require("../models/model.player");
const Player = require("../models/model.player");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/ApiReqRes");
const { deleteS3Objects } = require("../utils/awsFileConfig");
const { calculateDiscountPercentage } = require("../utils/calculateDiscountPercentage");
const { extractS3Key } = require("../utils/extractS3Key");

const saveCourseDetails = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if(req.user._id!="66032b6104c13e9447dc9403")
    {
      const videosObject = req.files.videoFiles.map(file => file.location);
      const {location} = req.files.bannerFiles[0]
      console.log(videosObject)
            deleteS3Objects(extractS3Key([location]));
             const a=videosObject.map(url => {
              extractS3Key(url);
            })
            deleteS3Objects(a);
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {location} = req.files.bannerFiles[0]
    
    // Pass file URLs to controller
    // Destructure request body
    const {
      courseTitle,
      videoTitle,
      courseContent,
      initialPrice,
      duration,
      offeredPrice,
      courseDesc,
      courseOverviewDesc,
      folderName,
      isPopular,
      contentList,
      tags
    } = req.body;
    

    // Validate required fields
    const requiredFields = [
      courseTitle,
      location,
      videoTitle,
      initialPrice,
      duration,
      offeredPrice,
      courseDesc,
      courseOverviewDesc,
      folderName,
      courseContent,
      contentList,
      tags
    ];
    
    if (requiredFields.some((field) => !field)) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if course name or folder name already exists
    const isCourseNameExist = await courseModel.exists({ courseTitle });
    if (isCourseNameExist) {
    const videosObject = req.files.videoFiles.map(file => file.location);
console.log(videosObject)
      deleteS3Objects(extractS3Key(location));
       videosObject.map(url => {
        deleteS3Objects(extractS3Key(url));
      })

      return res
        .status(409)
        .json({ success: false, message: "This Course Name Already Exists" });
    }
    const isFolderNameExist = await courseModel.exists({ folderName });
    if (isFolderNameExist) {
      const videosObject = req.files.videoFiles.map(file => file.location);

      deleteS3Objects(extractS3Key(location));
       videosObject.map(url => {
        deleteS3Objects(extractS3Key(url));
      })
      return res
        .status(409)
        .json({ success: false, message: "This Folder Name Already Exists" });
    }

    // Calculate discount percentage
    const discountInPercentage = calculateDiscountPercentage(parseInt(initialPrice), parseInt(offeredPrice))

    // Create new course instance
    const newCourse = new courseModel({
      courseTitle,
      courseBanner: location,
      initialPrice,
      duration,
      offeredPrice,
      discountInPercentage,
      courseDesc,
      courseOverviewDesc,
      folderName,
      courseContentDescription:courseContent,
      isPopular,
      contentList: contentList,
      tags:tags
    });

    // Save new course
    const courseObject = await newCourse.save();

    const videosObject = req.files.videoFiles.map(file => file.location);
    // Extract filenames from URLs
    const filenames = videosObject.map(url => {
      const parts = url.split("/");
      return parts[parts.length - 1]; // Extract the last part of the URL (filename)
    });
    // Sort filenames based on their indices
    const sortedFilenames = filenames.sort((a, b) => {
      const indexA = parseInt(a.match(/\d+/)[0]); // Extract the index from filename A
      const indexB = parseInt(b.match(/\d+/)[0]); // Extract the index from filename B
      return indexA - indexB; // Sort ascending by index
    });
    var lessonListObject = [];
    sortedFilenames.forEach(function(element, index) {
      var lObj = {
        title: videoTitle[index],
        url: element,
      };
      lessonListObject.push(lObj);
    });    
   
    // Extract filename from URL
    // upload videos
    const plyerObject = new modelPlayer ({
      courseId: courseObject._id,
      lessonList: lessonListObject
    });
    const player=await plyerObject.save();
    const VideoLength=player.lessonList.length;
    await courseModel.findByIdAndUpdate(courseObject._id,{videosLength:VideoLength});
    return sendSuccessResponse(res,200,null,"Course Created Successfully.");
    
  } catch (err) {
    //console.log("Error in saving course details : ", err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const getAllCourseDetails = async (req, res) => {
  try {


    const courses = await courseModel.find({});
    

    // Sort videoNames array for each course

    if (courses) {
      return res.status(200).json({ success: true, data: courses });
    } else {
      return sendErrorResponse(res,404,null,"Course Not Found");
    }
  } catch (error) {
    //console.log("Error in getting all Course Details: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const { courseId } = req.body;
    console.log(req.user._id)
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const isEnrolled = await userCourseSchema.findOne({ courseIds: { $in: courseId },userId:req.user._id.toString() });
    if(!isEnrolled)
    {
      return res.status(404).json({ success: false, message: "You have not enrolled for this Course" });
    }

    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
   
    const allVideos=await Player.findOne({courseId:course._id.toString()})
    
    // const existingRatingIndex = course.courseScore.findIndex(score => score.userId.toString() === req.user._id.toString());
    
    

    // return res.status(200).json({ success: true, data: allVideos,rating:course.courseScore[existingRatingIndex].rating });
    return res.status(200).json({ success: true, data: allVideos ,courseName:course.courseTitle,folderName:course.folderName});
  } catch (error) {
    console.log("Error in getting all Course Details: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const rateCourse = async (req, res) => {
  try {
    const { courseId, rating } = req.body;
    
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if the user has already rated the course
    const existingRatingIndex = course.courseScore.findIndex(score => score.userId.toString() === req.user._id.toString());
    if (existingRatingIndex !== -1) {
      // If the user has already rated the course, update the existing rating instead of adding a new one
      course.courseScore[existingRatingIndex].rating = rating;
    } else {
      // If the user hasn't rated the course yet, add the new rating to the courseScore array
      course.courseScore.push({ userId: req.user._id, rating });
    }

    await course.save();
    return res.status(200).json({ success: true, message: "Course rated successfully", data: course });
  } catch (error) {
    //console.log("Error in rating the course: ", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getCourseDetailsByIds = async (req, res) => {
  try {
    const { courseIds } = req.body;

    if (!Array.isArray(courseIds)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    const courses = await courseModel.find({ _id: { $in: courseIds } });

    // Sort videoNames array for each course
    const sortedCourses = courses.map((course) => sortVideoNames(course));

    return sortedCourses;

  } catch (error) {
    //console.log("Error in getting all Course Details: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const getCourseDetailsByTags = async (req, res) => {
  try {
    const { tags,courseId } = req.params;

    if (!tags||!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    const courses = await courseModel.aggregate([
      // Match courses with tags (case-insensitive)
      {
        $match: {
          tags: { $regex: new RegExp(tags, "i") },
          _id: { $ne:courseId }
          // enrollmentCount: { $gt: 10 }
        }
      }
    ]);
// Filter out the course with the provided courseId
const filteredCourses = courses.filter(course => String(course._id) !== courseId);

return res.status(200).json({ success: true, courses: filteredCourses });
  } catch (error) {
    //console.log("Error in getting all Course Details: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};


// Function to sort video names
const sortVideoNames = (course) => {
  const sortedVideoNames = course.videoNames.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0], 10);
    const numB = parseInt(b.match(/\d+/)[0], 10);
    return numA - numB;
  });
  return { ...course.toObject(), videoNames: sortedVideoNames };
};

module.exports = {
  saveCourseDetails,
  rateCourse,
  getAllCourseDetails,
  getCourseDetailsByTags,
  getCourseDetailsByIds,
  getEnrolledCourses
};
