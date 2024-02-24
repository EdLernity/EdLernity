const courseModel = require('../models/courseModel')

const saveCourseDetails = async(req,res) => {
    try{
        let {courseTitle , initialPrice , offeredPrice , courseDesc , courseOverviewDesc , folderName , courseContentDescription , isPopular} = req.body;

        if (!courseTitle || !initialPrice || !offeredPrice || !courseDesc || !courseOverviewDesc || !folderName || !courseContentDescription) {
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

        let discountInPercentage =Math.round(100- ((offeredPrice / initialPrice ) * 100));
        console.log(discountInPercentage)

        discountInPercentage  = parseInt(discountInPercentage);

        if (!Number(discountInPercentage)) {
            return res.status(400).send("Discount should be a number");
        } else if (discountInPercentage < 1 || discountInPercentage > 100){
           return res.status(400).send("Discount must be between 1 and 100")
        }

        let newCourse = new courseModel({
            courseTitle , 
            initialPrice, 
            offeredPrice, 
            discountInPercentage,
            courseDesc ,
            courseOverviewDesc,  
            folderName ,  
            courseContentDescription,
            isPopular
        });
        await newCourse.save();
        return res.status(200).json({success : true , message : "Course  Details Saved Successfully" , data : newCourse});
    }catch(err){
        console.log("Error in saving course details : ", err);
        res.status(500).send({"error": "Internal Server Error"})
    }
}

module.exports = {saveCourseDetails}