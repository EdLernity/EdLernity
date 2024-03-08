const courseModel = require("../models/courseModel");

const saveCourseDetails = async (req, res) => {
  try {
    // Destructure request body
    const {
      courseTitle,
      initialPrice,
      offeredPrice,
      courseDesc,
      courseOverviewDesc,
      folderName,
      courseContentDescription,
      isPopular,
      imagePath,
      videoNames,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      courseTitle,
      initialPrice,
      offeredPrice,
      courseDesc,
      courseOverviewDesc,
      folderName,
      courseContentDescription,
      imagePath,
      videoNames,
    ];
    if (requiredFields.some((field) => !field)) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if course name or folder name already exists
    const isCourseNameExist = await courseModel.exists({ courseTitle });
    if (isCourseNameExist) {
      return res
        .status(409)
        .json({ success: false, message: "This Course Name Already Exists" });
    }
    const isFolderNameExist = await courseModel.exists({ folderName });
    if (isFolderNameExist) {
      return res
        .status(409)
        .json({ success: false, message: "This Folder Name Already Exists" });
    }

    // Calculate discount percentage
    const discountInPercentage = Math.round(
      100 - (offeredPrice / initialPrice) * 100
    );

    // Create new course instance
    const newCourse = new courseModel({
      courseTitle,
      initialPrice,
      offeredPrice,
      discountInPercentage,
      courseDesc,
      courseOverviewDesc,
      folderName,
      courseContentDescription,
      isPopular,
      videoNames,
      image: imagePath,
    });

    // Save new course
    await newCourse.save();

    return res.status(200).json({
      success: true,
      message: "Course Details Saved Successfully",
      data: newCourse,
    });
  } catch (err) {
    console.log("Error in saving course details : ", err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const getAllCourseDetails = async (req, res) => {
  try {

    let isFromUi  = req?.query?.isFromUI || false;

    const courses = await courseModel.find({});

    // Sort videoNames array for each course
    const sortedCourses = courses.map((course) => sortVideoNames(course));

    if (isFromUi) {
      return res.status(200).json({ success: true, data: sortedCourses });
    } else {
      return sortedCourses;
    }
  } catch (error) {
    console.log("Error in getting all Course Details: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getAllCourseDetailsCount = async (req, res) => {
  try {
    const courses = await courseModel.find({});

    // Sort videoNames array for each course
    const sortedCourses = courses.map((course) => sortVideoNames(course));

    return res.status(200).json({ success: true, data: sortedCourses.length });
  } catch (error) {
    console.log("Error in getting all Course Details: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
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
    console.log("Error in getting all Course Details: ", error);
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
  getAllCourseDetails,
  getCourseDetailsByIds,
  getAllCourseDetailsCount
};
