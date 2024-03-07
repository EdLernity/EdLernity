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

const getUserCourseById = async (userId) => {
    try {
        if (!userId)  {
            const err = new Error("Invalid input");
            err.statusCode = 400;
            throw err;
        }
        const userCourse = await UserCourseModel.findOne( { userId: userId} );
        if(!userCourse){
            const err = new Error(`No record found for the given user id ${userId}`);
            err.statusCode = 404;
            throw err;
        }

        const data = {
            userCourseIds : userCourse.courseIds,
            isAllCourse : userCourse.isAllCourse
        }
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { createUserCourse , getUserCourseById};
