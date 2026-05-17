import mongoose, { Schema } from "mongoose";

const WorkspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ← remove the members array entirely, WorkspaceMember collection handles this
  },
  { timestamps: true }
);

export const Workspace = mongoose.model("Workspace", WorkspaceSchema);