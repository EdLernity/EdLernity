const crypto = require("crypto");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const courseModel = require("../models/courseModel");
const UserModel = require("../models/userModel");
const UserCourseModel = require('../models/userCourseSchema');
const { createUserCourse } = require("../utils/userCourseUtils");
const Transaction = require("../models/transactionSchema");


dotenv.config();

const getEnrollCoursesList = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const enrollList = await UserCourseModel.find({ userId: req.user._id })
    .populate({ path: "userId", select: ["firstName", "lastName"] })
    .populate({ path: "courseIds", select: ["courseTitle", "courseBanner","courseScore"] });
 if (enrollList.length <= 0) {
      return res.status(400).json({  });
    }

    res.status(200).json(enrollList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went Wrong" });
  }
};
const getEnrolledCoursesList = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const enrollList = await UserCourseModel.findOne({ userId: req.user._id })
    
 if (!enrollList) {
      return res.status(400).json({  });
    }

    res.status(200).json({enrollList:enrollList.courseIds});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

const EnrollCourses = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { courseId ,enrollingAllCourses} = req.body;

    
  

    if(enrollingAllCourses===true&&courseId==="lifeTimeFinalPrice")
    {
    let lifeTimeFinalPrice = Number(989) + '00';

      var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET,
      });
  
      var options = {
        amount: lifeTimeFinalPrice,
        currency: "INR",
        receipt: "EdLernity's Lifetime subscription"
      };
  
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.error(err);
        }
  
        res.status(200).json({ data: order,userData:req.user });
      });
    }else{
      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
      }
  
      const course = await courseModel.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      let finalPrice = Number(course.offeredPrice) + '00';
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    var options = {
      amount: finalPrice,
      currency: "INR",
      receipt: course.courseTitle.slice(0, 40)
    };

    instance.orders.create(options, function (err, order) {
      if (err) {
        console.error(err);
      }

      res.status(200).json({ data: order,userData:req.user });
    });
  }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

const createOrder = async (courseId, uid,response) => {
  console.log(courseId)
  if(courseId==="lifeTimeFinalPrice")
  {
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
     const transactionObj=new Transaction({
      userId:uid,
      paymentMethod:"Online",
      paymentId:response.razorpay_payment_id,
      subscribedAllCourse:true,
      amount:986
     })
     const trans=await transactionObj.save();
     const existingUserCourses = await UserCourseModel.findOne({ userId: uid });
console.log(existingUserCourses)
     let newCourseIds = [];
 
     if (existingUserCourses) {
       // Extract existing courseIds from UserCourseModel
       const existingCourseIds = existingUserCourses.courseIds;
 
       // Add only unique courseIds to newCourseIds
       newCourseIds = courseIds.filter(courseId => !existingCourseIds.includes(courseId));
       const existingUserCourses = await UserCourseModel.findOneAndUpdate(
        { userId: uid },
        { $addToSet: { courseIds: { $each: newCourseIds } }, paid: true, transactionId: trans._id },
        { upsert: true, new: true }
      );
  
     } else {
       newCourseIds = courseIds;
       const userCourseObj=new UserCourseModel({
        userId:uid,
        courseIds:newCourseIds,
        paid:true,
       transactionId:trans._id,
      });
      await userCourseObj.save(); // No existing UserCourseModel, add all courseIds
     }
    
    
    
  }
  else{
  const course = await courseModel.findById(courseId);
  course.enrollmentCount+=1;
  await course.save();
 
 
 const transactionObj=new Transaction({
  courseId:courseId,
  userId:uid,
  paymentMethod:"Online",
  paymentId:response.razorpay_payment_id
 })
 const trans=await transactionObj.save();

 const userCourseObj=new UserCourseModel({
  userId:uid,
  courseIds:courseId,
  paid:true,
 transactionId:trans._id,
});
await userCourseObj.save();
  }
  // if (!userCourse) return res.status(401).send({ message: "Failed to add courses" });
};

const verify = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { response, courseId } = req.body;
    const sign = response.razorpay_order_id + "|" + response.razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString()).digest("hex");

    if (response.razorpay_signature === expectedSign) {
      createOrder(courseId, req.user._id,response);
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = { getEnrollCoursesList, EnrollCourses, verify ,getEnrolledCoursesList};
