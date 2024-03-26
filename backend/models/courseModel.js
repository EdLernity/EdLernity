const mongoose = require('mongoose')

const courseSchema =  new mongoose.Schema({
    courseTitle : { type : String,  required:true},
    courseBanner: { type: String, required: true },
    initialPrice : { type : Number,  required:true},
    duration: { type: String, required: true },
    offeredPrice : { type : Number,  required:true},
    discountInPercentage : { type : Number,  required:true},
    courseDesc : { type :  String , required:true},
    courseOverviewDesc : { type :  String , required:true},
    courseContentDescription : [{
        title : {type : String , required : true},
        description : {type : String, required: true},
    }],
    isPopular : { type : Boolean,  required:true},
    enrollmentCount: { type: Number, default: 0 },
    contentList: { type: String, required: true },
    folderName: { type: String, required: true },
    videosLength: { type: Number, default: 0 },
    courseScore: {
        type: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, min: 1, max: 5, required: true }
        }],
        default: []
    },
    tags: { type: Array, required: true },
    
})

const courseModel = mongoose.model("Course",courseSchema)

module.exports = courseModel
