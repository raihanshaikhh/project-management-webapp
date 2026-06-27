import { User } from "../models/user.models.js"
import { SubTask } from "../models/subTask.model.js"
import { Task } from "../models/task.model.js"
import { ProjectMember } from "../models/projectMember.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import asyncHandler from "../utils/asyn-handler.js"
import mongoose from "mongoose"
import { Project } from "../models/project.model.js"
import { Priority, TaskStatusEnum, UserRolesEnum } from "../utils/costants.js"


const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params

  const project = await Project.findById(projectId)
  if (!project) throw new ApiError(404, "Project not found")

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId)
  }).populate("assignedTo", "avatar username fullName")

  return res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"))
})


const createTasks = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body
  const { projectId } = req.params
console.log("PROJECT ID:", projectId);
  const project = await Project.findById(projectId)
  if (!project) throw new ApiError(404, "Project not found")


  const files = req.files || []
  const attachments = files.map((file) => ({
    url: `${process.env.SERVER_URL}/images/${file.originalname}`,
    MimeType: file.mimetype,
    size: file.size
  }))
  const member = await ProjectMember.findOne({
   project: projectId,
   user: req.user._id,
});
if (!member) {
   throw new ApiError(
      403,
      "You are not a member of this project"
   );
}
  const task = await Task.create({
    title,
    description,
    workspace: project.workspace,
    createdBy: req.user._id,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : null,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments
  })

  return res.status(201).json(new ApiResponse(201, task, "Task created successfully"))
})

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params
  const existingTask = await Task.findById(taskId);

if (!existingTask) {
   throw new ApiError(404, "Task not found");
}
const member = await ProjectMember.findOne({
   project: existingTask.project,
   user: req.user._id,
});

if (!member) {
   throw new ApiError(
      403,
      "You are not a member of this project"
   );
}
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
    title, description, status, priority,
    dueDate, assignedTo, attachments, links
  } = req.body;
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid Task Id");
  }

  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  // check membership in the project
  const member = await ProjectMember.findOne({
    project: task.project,
    user: req.user._id,
  });
  if (!member) throw new ApiError(403, "You are not a member of this project");

  const isAdmin = member.role === UserRolesEnum.ADMIN;
  const isAssignee = task.assignedTo?.toString() === req.user._id.toString();
  const isCreator = task.createdBy?.toString() === req.user._id.toString();

  // members can only edit tasks assigned to them or created by them
  if (!isAdmin && !isAssignee && !isCreator) {
    throw new ApiError(403, "You don't have permission to edit this task");
  }

  const $set = {};
  const $unset = {};

  if (title !== undefined) $set.title = title;
  if (description !== undefined) $set.description = description;
  if (status !== undefined) $set.status = status;
  if (priority !== undefined) $set.priority = priority;
  if (attachments !== undefined) $set.attachments = attachments;
  if (links !== undefined) $set.links = links;

  if (dueDate !== undefined) {
    if (dueDate === null || dueDate === "") $unset.dueDate = "";
    else $set.dueDate = dueDate;
  }

  // only admins can reassign tasks
  if (assignedTo !== undefined) {
    if (!isAdmin) throw new ApiError(403, "Only admins can reassign tasks");
    if (assignedTo === null || assignedTo === "") {
      $unset.assignedTo = "";
    } else {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        throw new ApiError(400, "Invalid assignedTo user Id");
      }
      $set.assignedTo = new mongoose.Types.ObjectId(assignedTo);
    }
  }

  const modifier = { $set };
  if (Object.keys($unset).length > 0) modifier.$unset = $unset;

  const updated = await Task.findByIdAndUpdate(taskId, modifier, {
    new: true,
    runValidators: true,
  }).populate("assignedTo", "username fullName avatar");

  const io = req.app.get("io");
  io.to(`project:${String(updated.project)}`).emit("taskUpdated", {
    projectId: String(updated.project),
    task: updated,
  });

  return res.status(200).json(new ApiResponse(200, updated, "Task updated successfully"));
});

const deleteTasks = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid Task Id");
  }

  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  // only admins and task creators can delete
  const member = await ProjectMember.findOne({
    project: task.project,
    user: req.user._id,
  });
  if (!member) throw new ApiError(403, "You are not a member of this project");

  const isAdmin = member.role === UserRolesEnum.ADMIN;
  const isCreator = task.createdBy?.toString() === req.user._id.toString();

  if (!isAdmin && !isCreator) {
    throw new ApiError(403, "Only admins or the task creator can delete this task");
  }

  await Task.findByIdAndDelete(taskId);
  await SubTask.deleteMany({ task: taskId });

  return res.status(200).json(new ApiResponse(200, task, "Task deleted successfully"));
});

const createSubTasks = asyncHandler(async (req, res) => {
  const { taskId } = req.params
  const { title } = req.body

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