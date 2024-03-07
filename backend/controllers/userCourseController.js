// controllers/userCourseController.js
const { createUserCourse } = require('../utils/userCourseUtils');
const { getUserCourseById } = require('../utils/userCourseUtils');
const { getAllCourseDetails , getCourseDetailsByIds } = require('../controllers/courseController');
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Controller function to create user-course association
const createUserCourseController = async (req, res) => {
    try {
        const { userId, courseIds, isAllCourse } = req.body;
        const userCourse = await createUserCourse(userId, courseIds, isAllCourse);
        if (!userCourse) return res.status(401).send({ message: "Failed to add courses" });
        res.status(201).json({ success: true, userCourse });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getUserCourseByIdController = async (req, res) => {
    try {
        // const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

        // let userId = decodeToken.userId;

        let userId = '65e371937c70ff6e3cab6c3c';

        const userCourse = await getUserCourseById(userId);

        let isAllCourse = userCourse.isAllCourse;

        let courseIds =  userCourse.userCourseIds;
        
        if (!userCourse){
            return res.status(404).json({success:false, message:"No User Course found"});
        } else {
            if (isAllCourse) {
                const courses = await getAllCourseDetails();

                res.status(200).json({  
                    success :true , 
                    data : courses
                });
            } else {
                const courses = await getCourseDetailsByIds({ body: { courseIds } },res);

                res.status(200).json({  
                    success :true, 
                    data : courses
                });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error getting the user's courses", error: error});
    }
}


module.exports = { createUserCourseController , getUserCourseByIdController };
