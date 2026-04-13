import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Projects
    const projects = await Project.find({
      members: userId,
    });

    const projectCount = projects.length;

    // Tasks
    const tasks = await Task.find({
      assignedTo: userId,
    }).populate("project", "name");

    const openTasks = tasks.filter(t => t.status !== "Done").length;

    const taskCounts = {
      todo: tasks.filter(t => t.status === "To Do").length,
      in_progress: tasks.filter(t => t.status === "In Progress").length,
      done: tasks.filter(t => t.status === "Done").length,
    };

    // Recent tasks (limit 12)
    const myTasks = tasks.slice(0, 12);

    // Project stats
    const projectStats = await Promise.all(
      projects.map(async (proj) => {
        const projTasks = await Task.find({ project: proj._id });

        const done = projTasks.filter(t => t.status === "Done").length;

        return {
          _id: proj._id,
          name: proj.name,
          total: projTasks.length,
          done,
          color: proj.color || "#3b82f6",
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        projectCount,
        openTasks,
        taskCounts,
        myTasks,
        projects: projectStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Dashboard fetch failed",
      error: error.message,
    });
  }
};