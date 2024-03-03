// controllers/userCourseController.js
const { createUserCourse } = require('../utils/userCourseUtils');

// Controller function to create user-course association
const createUserCourseController = async (req, res) => {
    try {
        const { userId, courseIds, isAllCourse } = req.body;
        const userCourse = await createUserCourse(userId, courseIds, isAllCourse);
        res.status(201).json({ success: true, userCourse });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createUserCourseController };
