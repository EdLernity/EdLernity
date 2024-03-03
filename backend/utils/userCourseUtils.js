// utils/userCourseUtils.js
const UserCourseModel = require('../models/userCourseSchema');

// Function to create user-course association
const createUserCourse = async (userId, courseIds, isAllCourse) => {
    try {
        let userCourse = await UserCourseModel.findOne({ userId });
        if (userCourse) {
            userCourse.courseIds = courseIds;
            userCourse.isAllCourse = isAllCourse;
        } else {
            userCourse = new UserCourseModel({
                userId,
                courseIds,
                isAllCourse,
            });
        }
        await userCourse.save();
        return userCourse;
    } catch (error) {
        throw error;
    }
};

module.exports = { createUserCourse };
