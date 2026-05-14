import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import asyncHandler from "../utils/asyn-handler.js"
import { Workspace } from "../models/workspace.model.js"
import { WorkspaceMember } from "../models/workspace.member.model.js";
import mongoose from "mongoose"
import { AvailableUserRole, UserRolesEnum } from "../utils/costants.js"
import { inviteTestEmail } from "../utils/mail.js"

const getWorkspaceUser = asyncHandler(async(req, res)=>{
    WorkspaceMember.aggregate([
   {
      $match: {
         user: new mongoose.Types.ObjectId(req.user._id)
      }
   },
   {
      $lookup: {
         from: "workspaces",
         localField: "workspace",
         foreignField: "_id",
         as: "workspace",
         pipeline: [
            {
               $lookup: {
                  from: "workspacemembers",
                  localField: "_id",
                  foreignField: "workspace",
                  as: "members"
               }
            },
            {
               $addFields: {
                  memberCount: { $size: "$members" }
               }
            }
         ]
      }
   }
])
})
const getWorkspaceById = asyncHandler(async(req, res)=>{
    const {workspaceId} =  req.params
      
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
            throw new ApiError(400, "Invalid workspace id")
        }
        const workspace = await Workspace.findById(workspaceId)
         if (!workspace) {
        throw new ApiError(404, "workspace not found")
    }

    const member = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: req.user._id
        })
    
        if (!member) {
            throw new ApiError(403, "You are not a member of this workspace")
        }
    
        return res.status(200).json(
            new ApiResponse(200, workspace, "workspace fetched successfully")
        )
    })


const createWorkSpace = asyncHandler(async (req, res) => {
    const { name, description } = req.body

     if (!name?.trim()) {
        throw new ApiError(400, "Workspace name is required")
    }
    const workspace = await Workspace.create({
        name,   
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id),
    })
   
    await WorkspaceMember.create({
        user: req.user._id,
        workspace: workspace._id,
        role: UserRolesEnum.ADMIN
    })


    return res.status(201).json(new ApiResponse(201, workspace, "Workspace Created Successfully"))
})


export{
    createWorkSpace,
    getWorkspaceById,
    getWorkspaceUser
}