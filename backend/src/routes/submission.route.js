import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmissions, getAllSubmissionsForProblem, getSubmissionForProblem } from
    "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions)
submissionRoutes.get("/get-submission/:problemId", authMiddleware, getSubmissionForProblem)
submissionRoutes.get("/get-submission-count/:problemId", authMiddleware, getAllSubmissionsForProblem)

export default submissionRoutes;