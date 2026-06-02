import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { WorkspaceMember } from "../models/workspace.member.model.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // get user's workspace
    const membership = await WorkspaceMember.findOne({ user: userId });

    // fetch all projects in the workspace
    const projects = membership
      ? await Project.find({ workspace: membership.workspace })
      : [];

    const projectCount = projects.length;

    // tasks assigned to this user
    const tasks = await Task.find({ assignedTo: userId })
      .populate("project", "name color");

    const openTasks = tasks.filter((t) => t.status !== "done").length;

    const taskCounts = {
      todo: tasks.filter((t) => t.status === "todo").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };

    const myTasks = tasks.slice(0, 12);

    // project health stats
    const projectStats = await Promise.all(
      projects.map(async (proj) => {
        const projTasks = await Task.find({ project: proj._id });
        const done = projTasks.filter((t) => t.status === "done").length; // ← lowercase

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