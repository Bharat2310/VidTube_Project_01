import mongoose , {Schema} from "mongoose"
import { User } from "./user.model"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const videoSchema = new Schema({
    videoFile : {
        type : String, //cloudanary url
        required  : true,
    },
    thumbnail : {
        type : String, //cloudanary url
        required  : true,
    },title : {
        type : String, 
        required  : true,
    },
    description : {
        type : String, 
        required  : true,
    },
    views : {
        type : Number, //cloudanary url
        default: 0,
    },
    duration:{
        type : String, //cloudanary url
        required : true
    },
    isPublished : {
        type: Boolean,
        default: true,
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref  : User,
    }


}, {timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)