import { Router } from "express";
import {
    createWorkSpace,
    getWorkspaceById,
    getWorkspaceUser

} from "../controller/workspace.controller.js";
import { verifyJWT } from "../middlewares/auth.midleware.js";




const router = Router();
console.log("workspace routes loaded");
router.use(verifyJWT)


router.route("/")
.post(createWorkSpace)
.get(getWorkspaceUser);


export default router;