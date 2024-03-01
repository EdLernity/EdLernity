const mongoose = require('mongoose')

const courseSchema =  new mongoose.Schema({
    courseTitle : { type : String,  required:true},
    initialPrice : { type : Number,  required:true},
    offeredPrice : { type : Number,  required:true},
    discountInPercentage : { type : Number,  required:true},
    courseDesc : { type :  String , required:true},
    courseOverviewDesc : { type :  String , required:true},
    folderName : { type : String,  required:true},
    courseContentDescription : [{
        question : {type : String , required : true},
        answer : {type : String, required: true},
    }],
    isPopular : { type : Boolean,  required:true},
    image : { type : String,  required:true},
    videoNames : { type : [String] ,required:true},
})

const courseModel = mongoose.model("Course",courseSchema)

module.exports = courseModel
