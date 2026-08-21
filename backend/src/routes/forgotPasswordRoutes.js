import express from "express";
import { requestPasswordReset } from "../controllers/forgotPasswordController.js";
const router = express.Router();
router.post("/", requestPasswordReset);
export default router;
