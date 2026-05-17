import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import asyncHandler from "../utils/asyn-handler.js";
import { Workspace } from "../models/workspace.model.js";
import { WorkspaceMember } from "../models/workspace.member.model.js";
import mongoose from "mongoose";
import { UserRolesEnum } from "../utils/costants.js";


// ── GET /api/v1/workspace ─────────────────────────────────────────────────────
const getWorkspaceUser = asyncHandler(async (req, res) => {
  const result = await WorkspaceMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
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
              as: "members",
              pipeline: [
                {
                  $lookup: {
                    from: "users",           // populate user details on each member
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                      {
                        $project: {          // never expose sensitive fields
                          password: 0,
                          refreshToken: 0,
                        },
                      },
                    ],
                  },
                },
                { $unwind: "$user" },
              ],
            },
          },
          {
            $addFields: {
              memberCount: { $size: "$members" },
            },
          },
        ],
      },
    },
    { $unwind: "$workspace" },             // one workspace per member doc
    {
      $project: {
        _id: 0,
        role: "$role",                     // current user's role
        joinedAt: "$joinedAt",
        workspace: "$workspace",
      },
    },
  ]);

  if (!result.length) {
    throw new ApiError(404, "No workspace found for this user");
  }

  return res.status(200).json(
    new ApiResponse(200, result[0], "Workspace fetched successfully")
  );
});

// ── POST /api/v1/workspace ────────────────────────────────────────────────────
const createWorkSpace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Workspace name is required");
  }

  // one workspace per user — block if they already have one
  const existing = await WorkspaceMember.findOne({
    user: req.user._id,
    role: UserRolesEnum.ADMIN,
  });
  if (existing) {
    throw new ApiError(409, "You already have a workspace");
  }

  const workspace = await Workspace.create({
    name: name.trim(),
    description: description?.trim() ?? "",
    createdBy: req.user._id,
  });

  await WorkspaceMember.create({
    user: req.user._id,
    workspace: workspace._id,
    role: UserRolesEnum.ADMIN,
  });

  return res.status(201).json(
    new ApiResponse(201, workspace, "Workspace created successfully")
  );
});

// ── POST /api/v1/workspace/invite ─────────────────────────────────────────────
const inviteMember = asyncHandler(async (req, res) => {
  const { email, role = UserRolesEnum.MEMBER } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  // 1. find the workspace the current user admins
  const myMembership = await WorkspaceMember.findOne({
    user: req.user._id,
    role: UserRolesEnum.ADMIN,
  });
  if (!myMembership) {
    throw new ApiError(403, "Only admins can invite members");
  }

  // 2. find the user being invited
  const invitee = await User.findOne({ email: email.trim().toLowerCase() });
  if (!invitee) {
    throw new ApiError(404, "No user found with that email");
  }

  // 3. check not already a member (unique index will also catch this but gives better error)
  const alreadyMember = await WorkspaceMember.findOne({
    workspace: myMembership.workspace,
    user: invitee._id,
  });
  if (alreadyMember) {
    throw new ApiError(409, "User is already a member of this workspace");
  }

  // 4. add them
  const newMember = await WorkspaceMember.create({
    workspace: myMembership.workspace,
    user: invitee._id,
    role,
  });

  // 5. return populated member so frontend can append directly
  const populated = await WorkspaceMember.findById(newMember._id).populate(
    "user",
    "-password -refreshToken"
  );

  return res.status(201).json(
    new ApiResponse(201, populated, "Member invited successfully")
  );
});

// ── DELETE /api/v1/workspace/members/:userId ──────────────────────────────────
const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const myMembership = await WorkspaceMember.findOne({
    user: req.user._id,
    role: UserRolesEnum.ADMIN,
  });
  if (!myMembership) {
    throw new ApiError(403, "Only admins can remove members");
  }

  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot remove yourself");
  }

  const deleted = await WorkspaceMember.findOneAndDelete({
    workspace: myMembership.workspace,
    user: userId,
  });
  if (!deleted) {
    throw new ApiError(404, "Member not found in this workspace");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Member removed successfully")
  );
});

// ── GET /api/v1/workspace/members ─────────────────────────────────────────────
const getWorkspaceMembers = asyncHandler(async (req, res) => {
  const myMembership = await WorkspaceMember.findOne({
    user: req.user._id,
  });
  if (!myMembership) {
    throw new ApiError(403, "You are not part of any workspace");
  }

  const members = await WorkspaceMember.find({
    workspace: myMembership.workspace,
  }).populate("user", "-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, members, "Members fetched successfully")
  );
});

export {
  createWorkSpace,
  getWorkspaceUser,
  inviteMember,
  removeMember,
  getWorkspaceMembers,
};