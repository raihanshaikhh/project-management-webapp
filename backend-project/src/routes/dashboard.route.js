import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.midleware.js";
import { getDashboard } from "../controller/dashboard.controller.js";

const router = Router();

router.get("/", verifyJWT, getDashboard);

export default router;