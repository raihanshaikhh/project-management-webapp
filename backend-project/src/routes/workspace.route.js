import { Router } from "express";
import {
  createWorkSpace,
  getWorkspaceUser,
  inviteMember,
  removeMember,
  getWorkspaceMembers,
  leaveWorkspace,
  deleteWorkspace,
} from "../controller/workspace.controller.js";
import { verifyJWT } from "../middlewares/auth.midleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/")
  .post(createWorkSpace)
  .get(getWorkspaceUser)
  .delete(deleteWorkspace);   // ← admin deletes workspace

  
router.route("/leave")
  .delete(leaveWorkspace);
router.route("/invite")
  .post(inviteMember);

router.route("/members")
  .get(getWorkspaceMembers);

router.route("/members/:userId")
  .delete(removeMember);

export default router;