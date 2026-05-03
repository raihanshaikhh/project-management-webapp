import mongoose, {Schema} from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/costants.js";


const projectMember =new Schema ({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        trim:true,

    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role:{
        type:String,
        enum:AvailableUserRole,
        default:UserRolesEnum.MEMBER,
    },





},{timestamps:true})
projectMember.index({ project: 1, user: 1 }, { unique: true });
export const ProjectMember = mongoose.model(
  "ProjectMember",
  projectMember
);