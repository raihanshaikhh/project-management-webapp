import { User } from "../models/user.models.js"
import { SubTask } from "../models/subTask.model.js"
import { Task } from "../models/task.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import asyncHandler from "../utils/asyn-handler.js"
import mongoose from "mongoose"
import { Project } from "../models/project.model.js"
import { Priority } from "../utils/costants.js"

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params

  const project = await Project.findById(projectId)        // ✅ fixed
  if (!project) throw new ApiError(404, "Project not found")

  const tasks = await Task.find({                           // ✅ fixed
    project: new mongoose.Types.ObjectId(projectId)
  }).populate("assignedTo", "avatar username fullName")

  return res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"))
})

const createTasks = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status} = req.body
  const { projectId } = req.params

  const project = await Project.findById(projectId)
  if (!project) throw new ApiError(404, "Project not found")

  const files = req.files || []
  const attachments = files.map((file) => ({              // ✅ fixed
    url: `${process.env.SERVER_URL}/images/${file.originalname}`,
    MimeType: file.mimetype,
    size: file.size
  }))

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments                                            // ✅ now defined
  })

  return res.status(201).json(new ApiResponse(201, task, "Task created successfully"))
})

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  const task = await Task.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(taskId) } },
    {
      $lookup: {
        from: "users", localField: "assignedTo", foreignField: "_id", as: "assignedTo",
        pipeline: [{ $project: { _id: 1, username: 1, fullName: 1, avatar: 1 } }]
      }
    },
    {
      $lookup: {
        from: "subtasks", localField: "_id", foreignField: "task", as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users", localField: "createdBy", foreignField: "_id", as: "createdBy",
              pipeline: [{ $project: { _id: 1, username: 1, fullName: 1, avatar: 1 } }]
            }
          },
          { $addFields: { createdBy: { $arrayElemAt: ["$createdBy", 0] } } }
        ]
      }
    },
    { $addFields: { assignedTo: { $arrayElemAt: ["$assignedTo", 0] } } }
  ])

  if (!task || task.length === 0) throw new ApiError(404, "Task not found")

  return res.status(200).json(new ApiResponse(200, task[0], "Task fetched successfully"))
})

const updateTasks = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    attachments,
    links
  } = req.body;

  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid Task Id");
  }

  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (priority !== undefined) updateData.priority = priority;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  if(links !== undefined) updateData.links = links;
  

  if (assignedTo !== undefined) {
    updateData.assignedTo = assignedTo || null;
  }

  if (attachments !== undefined) updateData.attachments = attachments;
  if (links !== undefined) updateData.links = links;

  const task = await Task.findByIdAndUpdate(
    taskId,
    updateData,
    { new: true, runValidators: true }
  ).populate("assignedTo", "username fullName avatar");

  if (!task) throw new ApiError(404, "Task not found");

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTasks = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  if (!mongoose.Types.ObjectId.isValid(taskId)) throw new ApiError(400, "Invalid Task Id")

  const task = await Task.findByIdAndDelete(taskId)
  if (!task) throw new ApiError(404, "Task not found")

  await SubTask.deleteMany({ task: taskId })

  return res.status(200).json(new ApiResponse(200, task, "Task deleted successfully"))
})

const createSubTasks = asyncHandler(async (req, res) => {
  const { taskId } = req.params
  const { title } = req.body                              // ✅ fixed

  if (!mongoose.Types.ObjectId.isValid(taskId)) throw new ApiError(400, "Invalid Task Id")

  const task = await Task.findById(taskId)
  if (!task) throw new ApiError(404, "Task not found")

  const subtask = await SubTask.create({
    title,
    task: taskId,
    createdBy: req.user._id
  })

  return res.status(201).json(new ApiResponse(201, subtask, "Subtask created"))
})

const updateSubTasks = asyncHandler(async (req, res) => {
  const { title, isCompleted } = req.body
  const { subtaskId } = req.params

  if (!mongoose.Types.ObjectId.isValid(subtaskId)) throw new ApiError(400, "Invalid SubTask Id")

  const updateData = {}
  if (title) updateData.title = title
  if (isCompleted !== undefined) updateData.isCompleted = isCompleted

  const subTask = await SubTask.findByIdAndUpdate(subtaskId, updateData, { new: true, runValidators: true })
  if (!subTask) throw new ApiError(404, "Subtask not found")

  return res.status(200).json(new ApiResponse(200, subTask, "Subtask updated successfully"))
})

const deleteSubTasks = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params

  if (!mongoose.Types.ObjectId.isValid(subTaskId)) throw new ApiError(400, "Invalid SubTask Id")

  const subtask = await SubTask.findByIdAndDelete(subTaskId)
  if (!subtask) throw new ApiError(404, "Subtask not found")

  return res.status(200).json(new ApiResponse(200, subtask, "Subtask deleted"))
})

export {
  getTasks, createTasks, getTaskById,
  updateTasks, deleteTasks,
  createSubTasks, updateSubTasks, deleteSubTasks
}