const courseModel = require('../models/courseModel')
const axios =  require('axios');

const saveCourseDetails = async(req,res) => {
    try{
        let {courseTitle , initialPrice , offeredPrice , courseDesc , courseOverviewDesc , folderName , courseContentDescription , isPopular , imagePath , videoNames} = req.body;

        if (!courseTitle || !initialPrice || !offeredPrice || !courseDesc || !courseOverviewDesc || !folderName || !courseContentDescription || !imagePath || !videoNames) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Checking if the course name already exists in the database or not 
        let isCourseNameExist = await courseModel.findOne({courseTitle});

        if (isCourseNameExist) {
            return res.status(409).json({success : false , message : 'This Course Name Already Exists'});
        }

        let isFolderNameExist = await courseModel.findOne({folderName});
        
        if (isFolderNameExist) {
            return res.status(409).json({success : false , message : 'This Folder Name Already Exists'});
        }

        let discountInPercentage = Math.round(100- ((offeredPrice / initialPrice ) * 100));

        discountInPercentage  = parseInt(discountInPercentage);

        if (!Number(discountInPercentage)) {
            return res.status(400).send("Discount should be a number");
        } else if (discountInPercentage < 1 || discountInPercentage > 100){
           return res.status(400).send("Discount must be between 1 and 100")
        }

        image = imagePath;

        let newCourse = new courseModel({
            courseTitle , 
            initialPrice, 
            offeredPrice, 
            discountInPercentage,
            courseDesc ,
            courseOverviewDesc,  
            folderName ,  
            courseContentDescription,
            isPopular,
            videoNames,
            image
        });
        await newCourse.save();
        return res.status(200).json({success : true , message : "Course  Details Saved Successfully" , data : newCourse});
    }catch(err){
        console.log("Error in saving course details : ", err);
        res.status(500).send({"error": "Internal Server Error"})
    }
}

const getAllCourseDetails = (req, res) => {
    try {
        courseModel.find({}).then((courses) => {
            // Sort videoNames array for each course
            const sortedCourses = courses.map(course => {
                const sortedVideoNames = course.videoNames.sort((a, b) => {
                    // Extract numeric part from video names
                    const numA = parseInt(a.match(/\d+/)[0], 10);
                    const numB = parseInt(b.match(/\d+/)[0], 10);
                    return numA - numB;
                });
                return { ...course.toObject(), videoNames: sortedVideoNames };
            });

            return res.status(200).json({ success: true, data: sortedCourses });
        }).catch((err) => {
            return res.status(404).json({ success: false, message: err });
        });
    } catch (error) {
        console.log("Error in getting all Course Details: ", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// const saveVideoName = async (req,res) => {
//     const updateVideoNames = async (courseId, newVideoNames) => {
//         try {
//             // Find the course by its ID and update the videoNames field
//             const result = await courseModel.findByIdAndUpdate(courseId, { videoNames: newVideoNames });
    
//             if (!result) {
//                 throw new Error("Course not found");
//             }
    
//             return { success: true, message: "Video names updated successfully" };
//         } catch (error) {
//             return { success: false, error: error.message };
//         }
//     };
    
//     // Example usage:
//     const courseId = req.body.id; // ID of the course to update
//     let videoNames = []
//     const courseResponse = await axios.get("http://localhost:3001/api/courses/Coding_Interview_Prepration_EdLernity");
//     courseResponse.data.videos.forEach(element=>{
//             videoNames.push(element)
//     })
    
//     updateVideoNames(courseId, videoNames)
//         .then((response) => {
//             console.log(response);
//         })
//         .catch((error) => {
//             console.error(error);
//         });
    
// }

module.exports = {saveCourseDetails,getAllCourseDetails}