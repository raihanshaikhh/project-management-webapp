import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus } from "../utils/costants.js";



const taskSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: AvailableTaskStatus,
      default: "todo",
    },

    attachments: {
     name: String,
    size: String,
    url: String,
    mimetype: String,
    },

    links: {
      type: [
        {
          url: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);