const crypto = require("crypto");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const courseModel = require("../models/courseModel");
const UserModel = require("../models/userModel");
const UserCourseModel = require('../models/userCourseSchema');
const UserInternship = require("../models/userInternshipSchema");
const InternshipStudentAssignment = require("../models/internshipStudentAssignmentSchema");
const { grantSingleCourseAccess, grantAllCoursesAccess } = require("../utils/userCourseUtils");
const Transaction = require("../models/transactionSchema");
const Certificate = require("../models/model.certfication");
const { getInternshipBySlug } = require("../utils/internshipCatalog");
const { generateUniqueCertificateId } = require("../utils/certificateIdGenerator");

dotenv.config();


const getCertificationCoursesList = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { courseId } = req.params;

    // Check if courseId is null or not provided
    if (!courseId) {
      return res.status(400).json({ message: "CourseId is required" });
    }
    const isCertificationDone = await Certificate.findOne({ userId: req.user._id, courseId: courseId });
    if (isCertificationDone) {
      return res.status(200).json({ message: "Certificate already generated successfully", uuid: isCertificationDone.uuid });
    }

    const enrollList = await UserCourseModel.find({ userId: req.user._id, courseIds: { $in: courseId } });

    if (!enrollList || enrollList.length === 0) {
      return res.status(400).json({ message: "User is not enrolled in the specified course" });
    }



    // Generate a UID for the certificate
    const uuid = await generateUniqueCertificateId("course");

    // Create a new certificate document
    const certification = new Certificate({
      userId: req.user._id,
      courseId: courseId,
      uuid: uuid
    });

    // Save the certificate document
    await certification.save();

    // Send success response
    return res.status(200).json({ message: "Certificate generated successfully", uuid: uuid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = getCertificationCoursesList;


const getEnrollCoursesList = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { consolidateUserCourseRecords } = require("../utils/userCourseUtils");
    const enrollment = await consolidateUserCourseRecords(req.user._id);
    if (!enrollment) {
      return res.status(200).json([]);
    }

    const populated = await UserCourseModel.findById(enrollment._id)
      .populate({ path: "userId", select: ["firstName", "lastName"] })
      .populate({ path: "courseIds", select: ["courseTitle", "courseBanner", "courseScore"] });

    res.status(200).json([populated]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went Wrong" });
  }
};
const getEnrolledCoursesList = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { getMergedUserCourseState } = require("../utils/userCourseUtils");
    const state = await getMergedUserCourseState(req.user._id);

    if (!state) {
      return res.status(200).json({ enrollList: [] });
    }

    res.status(200).json({ enrollList: state.mergedCourseIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

const enrollInternshipRecord = async ({
  userId,
  slug,
  paymentId,
  amount,
  transactionId = null,
  enrollmentSource = "payment",
}) => {
  const internship = getInternshipBySlug(slug);
  if (!internship) {
    throw new Error(`Unknown internship slug: ${slug}`);
  }

  const existing = await UserInternship.findOne({ userId, internshipSlug: slug });
  if (existing) {
    await InternshipStudentAssignment.findOneAndUpdate(
      { studentId: userId, internshipSlug: slug },
      { $set: { active: true } },
      { upsert: true }
    );
    return existing;
  }

  const record = await UserInternship.create({
    userId,
    internshipSlug: slug,
    title: internship.title,
    category: internship.category,
    coverImage: internship.coverImage,
    transactionId,
    paymentId,
    amount: amount != null ? String(amount) : null,
    enrollmentSource,
  });

  await InternshipStudentAssignment.findOneAndUpdate(
    { studentId: userId, internshipSlug: slug },
    { $set: { active: true } },
    { upsert: true }
  );

  return record;
};

const getInternshipEnrollments = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const internships = await UserInternship.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("internshipSlug title category coverImage createdAt enrollmentSource");

    res.status(200).json({
      internships: internships.map((item) => ({
        slug: item.internshipSlug,
        title: item.title,
        category: item.category,
        coverImage: item.coverImage,
        enrolledAt: item.createdAt,
        enrollmentSource: item.enrollmentSource,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

const EnrollCourses = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { courseId, enrollingAllCourses, enrollingInternship, internshipSlug } = req.body;

    // Internship program checkout (₹5,599) - includes GenAI workshop + Reznio as bonuses
    if (enrollingInternship === true || (courseId && String(courseId).startsWith("internship-"))) {
      const internshipAmountPaise = Number(5599) * 100;
      const slug = internshipSlug || String(courseId).replace(/^internship-/, "");

      const existingInternship = await UserInternship.findOne({
        userId: req.user._id,
        internshipSlug: slug,
      });
      if (existingInternship) {
        return res.status(200).json({ data: "enrolled", userData: req.user });
      }

      if (!getInternshipBySlug(slug)) {
        return res.status(400).json({ message: "Invalid internship program" });
      }

      var internshipInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET,
      });

      var internshipOptions = {
        amount: internshipAmountPaise,
        currency: "INR",
        receipt: (`Intern-${slug}`).slice(0, 40),
        notes: {
          type: "internship",
          slug,
          includes: "genai-workshop,reznio-access",
        },
      };

      internshipInstance.orders.create(internshipOptions, function (err, order) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Unable to create internship order" });
        }
        res.status(200).json({ data: order, userData: req.user });
      });
      return;
    }

    if (enrollingAllCourses === true && courseId === "lifeTimeFinalPrice") {
      let lifeTimeFinalPrice = Number(899) + '00';

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

        res.status(200).json({ data: order, userData: req.user });
      });
    } else {
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

        res.status(200).json({ data: order, userData: req.user });
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

const createOrder = async (courseId, uid, response, internshipSlug) => {
  //console.log(courseId)
  if (courseId && String(courseId).startsWith("internship-")) {
    const slug = internshipSlug || String(courseId).replace(/^internship-/, "");
    const transactionObj = new Transaction({
      userId: uid,
      paymentMethod: "Online",
      paymentId: response.razorpay_payment_id,
      amount: "5599",
      internshipSlug: slug,
      notes: "Internship enrollment includes GenAI workshop + Reznio access",
    });
    const transaction = await transactionObj.save();
    await enrollInternshipRecord({
      userId: uid,
      slug,
      paymentId: response.razorpay_payment_id,
      amount: "5599",
      transactionId: transaction._id,
      enrollmentSource: "payment",
    });
    return;
  }

  if (courseId === "lifeTimeFinalPrice") {
    const courses = await courseModel.find();
    if (!courses || courses.length === 0) {
      throw new Error("No courses found");
    }

    await Promise.all(courses.map(async (course) => {
      course.enrollmentCount += 1;
      await course.save();
    }));

    const courseIds = courses.map((course) => course._id);
    const transactionObj = new Transaction({
      userId: uid,
      paymentMethod: "Online",
      paymentId: response.razorpay_payment_id,
      subscribedAllCourse: true,
      amount: 899,
    });
    const trans = await transactionObj.save();
    await grantAllCoursesAccess(uid, courseIds, trans._id);
    return;
  }

  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  course.enrollmentCount += 1;
  await course.save();

  const transactionObj = new Transaction({
    courseId,
    userId: uid,
    paymentMethod: "Online",
    paymentId: response.razorpay_payment_id,
    amount: Number(course.offeredPrice),
  });
  const trans = await transactionObj.save();
  await grantSingleCourseAccess(uid, courseId, trans._id);
};

const verify = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { response, courseId, internshipSlug } = req.body;
    const sign = response.razorpay_order_id + "|" + response.razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString()).digest("hex");

    if (response.razorpay_signature === expectedSign) {
      await createOrder(courseId, req.user._id, response, internshipSlug);
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getEnrollCoursesList,
  EnrollCourses,
  verify,
  getEnrolledCoursesList,
  getCertificationCoursesList,
  getInternshipEnrollments,
  enrollInternshipRecord,
};
