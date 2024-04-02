const courseModel = require("../models/courseModel");
const UserModel = require("../models/userModel");
const UserCourseModel = require('../models/userCourseSchema');
const Transaction = require("../models/transactionSchema");
exports.getAllCoursesAndUsers = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if(req.user._id!="66032b6104c13e9447dc9403")
    {
      return res.status(404).json({ message: "Unauthorized" }); 
    }
    const user=await UserModel.find({}).select("firstName email");
    const courses = await courseModel.find({}).select("courseTitle offeredPrice")
    res.json({user,courses});
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.addCoursesToUsers = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if(req.user._id!="66032b6104c13e9447dc9403")
    {
      return res.status(404).json({ message: "Unauthorized" }); 
    }
    const data = req.body;

  // Accessing properties of the object
  const isAllCourseSubscribed = data["Is All Course Subscribed"];
  const courseId = data["Course"];
  const userName = data["User name"];
  const paymentId = data["Payment Id"];
// Log all properties of the object

    if (isAllCourseSubscribed) {
      const courses = await courseModel.find();
      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: "No courses found" });
      }
  
      await Promise.all(courses.map(async course => {
        course.enrollmentCount += 1;
        await course.save();
      }));
      // Extracting _id values from courses
      const courseIds = courses.map(course => course._id);
      // Fetch UserCourseModel by userId
      const transactionObj = new Transaction({
        userId: userName,
        paymentMethod: "Online",
        paymentId: paymentId,
        subscribedAllCourse: true,
        amount: 986
      })
      const trans = await transactionObj.save();
      const existingUserCourses = await UserCourseModel.findOne({ userId: userName });
      //console.log(existingUserCourses)
      let newCourseIds = [];
  
      if (existingUserCourses) {
        // Extract existing courseIds from UserCourseModel
        const existingCourseIds = existingUserCourses.courseIds;
  
        // Add only unique courseIds to newCourseIds
        newCourseIds = courseIds.filter(courseId => !existingCourseIds.includes(courseId));
        const existingUserCourses = await UserCourseModel.findOneAndUpdate(
          { userId: userName },
          { $addToSet: { courseIds: { $each: newCourseIds } }, paid: true, transactionId: trans._id,isAllCourse:true },
          { upsert: true, new: true }
        );
  
      } else {
        newCourseIds = courseIds;
        const userCourseObj = new UserCourseModel({
          userId: userName,
          courseIds: newCourseIds,
          paid: true,
          transactionId: trans._id,
          isAllCourse:true
        });
        await userCourseObj.save(); // No existing UserCourseModel, add all courseIds
      }
  
  
  
    }
    else {
      const course = await courseModel.findById(courseId);
      course.enrollmentCount += 1;
      await course.save();
  
  
      const transactionObj = new Transaction({
        courseId: courseId,
        userId: userName,
        paymentMethod: "Online",
        paymentId: paymentId,
        amount: Number(course.offeredPrice)
      })
      const trans = await transactionObj.save();
  
      const userCourseObj = new UserCourseModel({
        userId: userName,
        courseIds: courseId,
        paid: true,
        transactionId: trans._id,
      });
      await userCourseObj.save();
    }
    res.status(200).json({ message:"Course access has been provided to user!" });
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};