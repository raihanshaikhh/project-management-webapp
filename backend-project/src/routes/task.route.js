import { Router } from "express";
import { validate } from "../middlewares/vlidators.middleware.js";
import {
  getTasks, createTasks, getTaskById,
  updateTasks, deleteTasks,
  createSubTasks, updateSubTasks, deleteSubTasks
} from "../controller/task.controller.js"
import { createTaskValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.midleware.js";

const router = Router()

router.use(verifyJWT) // ✅ applies to all routes below cleanly
router.route("/project/:projectId")
.get(getTasks)
.post(createTaskValidator(), validate, createTasks)

router.route("/:taskId")
.get(getTaskById)
.patch(updateTasks)
.delete(deleteTasks)

router.post("/tasks/:taskId/subtasks", createSubTasks)
router.patch("/subtasks/:subtaskId", updateSubTasks)
router.delete("/subtasks/:subTaskId", deleteSubTasks)


export default router;