import mongoose, { Schema } from "mongoose";
import { UserRolesEnum, AvailableUserRole } from "../utils/costants.js";

const workspaceMemberSchema = new Schema(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: AvailableUserRole,
      default: UserRolesEnum.MEMBER,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate members in same workspace
workspaceMemberSchema.index(
  { workspace: 1, user: 1 },
  { unique: true }
);

export const WorkspaceMember = mongoose.model(
  "WorkspaceMember",
  workspaceMemberSchema
);